'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RotateCcw, FlipHorizontal, Loader2, Check } from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import { CREATE_NOTE, ADD_NOTE_IMAGE } from '@/graphql/mutations';
import { createClient } from '@/lib/supabase/client';
import { notify } from '@/lib/toast';

interface PhotoBoothModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSaved: (note: any) => void;
  canvasId?: string;
}

type Stage = 'camera' | 'flash' | 'developing' | 'preview' | 'done';

// Draw polaroid frame onto canvas and return base64 data URL
async function drawPolaroid(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const PHOTO_SIZE = 720;
    const FRAME_SIDE = 36;
    const FRAME_TOP = 36;
    const FRAME_BOTTOM = 110;
    const canvas = document.createElement('canvas');
    canvas.width = PHOTO_SIZE + FRAME_SIDE * 2;
    canvas.height = PHOTO_SIZE + FRAME_TOP + FRAME_BOTTOM;
    const ctx = canvas.getContext('2d')!;

    // Polaroid background (warm white)
    ctx.fillStyle = '#FFFAF7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle inner shadow on photo area
    ctx.save();
    ctx.shadowColor = 'rgba(90,62,76,0.12)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#f0e8e0';
    ctx.fillRect(FRAME_SIDE, FRAME_TOP, PHOTO_SIZE, PHOTO_SIZE);
    ctx.restore();

    const img = new Image();
    img.onload = () => {
      // Draw photo
      ctx.drawImage(img, FRAME_SIDE, FRAME_TOP, PHOTO_SIZE, PHOTO_SIZE);

      // Thin border around photo
      ctx.strokeStyle = 'rgba(90,62,76,0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(FRAME_SIDE, FRAME_TOP, PHOTO_SIZE, PHOTO_SIZE);

      // Date text (handwriting style)
      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      ctx.fillStyle = '#5A3E4C';
      ctx.font = '26px "Segoe Script", "Lucida Handwriting", "Brush Script MT", cursive';
      ctx.textAlign = 'center';
      ctx.fillText(dateStr, canvas.width / 2, PHOTO_SIZE + FRAME_TOP + 68);

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = imageSrc;
  });
}

export default function PhotoBoothModal({ isOpen, onClose, onPhotoSaved, canvasId }: PhotoBoothModalProps) {
  const [stage, setStage] = useState<Stage>('camera');
  const [capturedRaw, setCapturedRaw] = useState<string | null>(null);
  const [polaroidSrc, setPolaroidSrc] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [saving, setSaving] = useState(false);
  const [developProgress, setDevelopProgress] = useState(0);
  const webcamRef = useRef<Webcam>(null);
  const developTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [createNote] = useMutation<any>(CREATE_NOTE);
  const [addNoteImage] = useMutation<any>(ADD_NOTE_IMAGE);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStage('camera');
      setCapturedRaw(null);
      setPolaroidSrc(null);
      setDevelopProgress(0);
      setSaving(false);
      if (developTimerRef.current) clearInterval(developTimerRef.current);
    }
  }, [isOpen]);

  // Developing progress animation
  useEffect(() => {
    if (stage === 'developing') {
      setDevelopProgress(0);
      developTimerRef.current = setInterval(() => {
        setDevelopProgress(prev => {
          if (prev >= 100) {
            clearInterval(developTimerRef.current!);
            return 100;
          }
          return prev + 2;
        });
      }, 40);
    }
    return () => {
      if (developTimerRef.current) clearInterval(developTimerRef.current);
    };
  }, [stage]);

  // When polaroid is ready and developing is done, show preview
  useEffect(() => {
    if (stage === 'developing' && polaroidSrc && developProgress >= 100) {
      setTimeout(() => setStage('preview'), 300);
    }
  }, [stage, polaroidSrc, developProgress]);

  const handleCapture = useCallback(async () => {
    const raw = webcamRef.current?.getScreenshot({ width: 720, height: 720 });
    if (!raw) return;

    // Flash
    setStage('flash');
    await new Promise(r => setTimeout(r, 160));

    setCapturedRaw(raw);
    setStage('developing');

    // Process polaroid in background while animation plays
    const polaroid = await drawPolaroid(raw);
    setPolaroidSrc(polaroid);
  }, []);

  const handleRetake = () => {
    setStage('camera');
    setCapturedRaw(null);
    setPolaroidSrc(null);
    setDevelopProgress(0);
  };

  const handleSave = async () => {
    if (!polaroidSrc) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';

      // Convert base64 to blob
      const res = await fetch(polaroidSrc);
      const blob = await res.blob();
      const fileName = `photobooth_${Date.now()}.jpg`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('notes_images')
        .upload(filePath, blob, { contentType: 'image/jpeg' });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('notes_images')
        .getPublicUrl(filePath);

      const now = new Date();
      const title = `📸 ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;

      const { data: noteData } = await createNote({
        variables: {
          input: {
            title,
            positionX: Math.random() * 400 + 200,
            positionY: Math.random() * 300 + 150,
            canvasId: canvasId || undefined,
          },
        },
      });

      if (noteData?.createNote) {
        const { data: imgData } = await addNoteImage({
          variables: {
            input: {
              noteId: noteData.createNote.id,
              imageUrl: urlData.publicUrl,
              caption: 'Photo Booth',
              order: 0,
            },
          },
        });

        onPhotoSaved({
          ...noteData.createNote,
          images: imgData?.addNoteImage ? [imgData.addNoteImage] : [],
        });

        setStage('done');
        notify.success('Foto polaroid tersimpan ke kanvas!');
        setTimeout(() => onClose(), 1600);
      }
    } catch (err: any) {
      notify.error('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* Flash overlay */}
          <AnimatePresence>
            {stage === 'flash' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 z-10 bg-white"
              />
            )}
          </AnimatePresence>

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/20 bg-[#1a1625]/92 shadow-[0_32px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            {/* Accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E63946]/60 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E63946] to-[#9D0208]">
                  <Camera className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-bold text-white/90">Photo Booth</span>
              </div>
              <button onClick={onClose} className="rounded-xl p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 pb-6">
              {/* Camera Stage */}
              {(stage === 'camera' || stage === 'flash') && (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: '1/1' }}>
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode, aspectRatio: 1, width: 720, height: 720 }}
                      mirrored={facingMode === 'user'}
                      className="h-full w-full object-cover"
                    />
                    {/* Grid overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:33.33%_33.33%]" />
                    {/* Vignette */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.35)_100%)]" />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                    >
                      <FlipHorizontal className="h-4 w-4" />
                    </button>

                    {/* Shutter button */}
                    <button
                      onClick={handleCapture}
                      className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B7A] to-[#9D0208] shadow-[0_8px_32px_rgba(230,57,70,0.45)] transition-all hover:scale-105 hover:shadow-[0_12px_40px_rgba(230,57,70,0.55)] active:scale-95"
                    >
                      <span className="absolute inset-1.5 rounded-full border-2 border-white/30" />
                      <Camera className="relative h-6 w-6 text-white" />
                    </button>

                    <div className="h-10 w-10" />
                  </div>
                  <p className="text-center text-[11px] text-white/30">Klik tombol untuk mengambil foto</p>
                </div>
              )}

              {/* Developing Stage */}
              {stage === 'developing' && (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-2xl bg-[#FFFAF7]" style={{ aspectRatio: '1/1.18' }}>
                    {capturedRaw && (
                      <motion.img
                        src={capturedRaw}
                        alt="developing"
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ filter: 'brightness(2) saturate(0) blur(8px)' }}
                        animate={{ filter: 'brightness(1) saturate(1) blur(0px)' }}
                        transition={{ duration: 2.2, ease: 'easeOut' }}
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-[#FFFAF7]/90 to-transparent pb-4">
                      <p className="font-scrapbook-handwriting text-sm text-[#5A3E4C]/60">mengembangkan foto...</p>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#E63946] to-[#D9A441]"
                      initial={{ width: '0%' }}
                      animate={{ width: `${developProgress}%` }}
                      transition={{ ease: 'linear' }}
                    />
                  </div>
                </div>
              )}

              {/* Preview Stage */}
              {stage === 'preview' && polaroidSrc && (
                <div className="space-y-4">
                  <motion.div
                    initial={{ rotate: -3, scale: 0.92, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                    className="overflow-hidden rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.35)]"
                  >
                    <img src={polaroidSrc} alt="polaroid" className="w-full" />
                  </motion.div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleRetake}
                      disabled={saving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 py-3 text-sm font-semibold text-white/70 transition-all hover:bg-white/15 disabled:opacity-40"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Ulangi
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E63946] to-[#9D0208] py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(157,2,8,0.35)] transition-all hover:shadow-[0_12px_32px_rgba(157,2,8,0.45)] disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </div>
              )}

              {/* Done Stage */}
              {stage === 'done' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 gap-4"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#38D9A9] to-[#3BC9DB] shadow-[0_8px_32px_rgba(56,217,169,0.4)]">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-white/80">Foto tersimpan ke kanvas!</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
