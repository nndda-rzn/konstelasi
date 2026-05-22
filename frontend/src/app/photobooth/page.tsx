'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Camera, RotateCcw, FlipHorizontal,
  Download, Save, Loader2, Type, Palette, LayoutTemplate,
  Check, Sparkles, Image as ImageIcon,
} from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import { CREATE_NOTE, ADD_NOTE_IMAGE } from '@/graphql/mutations';
import { createClient } from '@/lib/supabase/client';
import { notify } from '@/lib/toast';
import { ApolloWrapper } from '@/lib/apollo/ApolloWrapper';
import { Providers } from '@/lib/Providers';

type Stage = 'camera' | 'flash' | 'edit' | 'saving' | 'done';
type FilterKey = 'normal' | 'grayscale' | 'sepia' | 'warm' | 'cool' | 'fade' | 'vivid';
type FrameKey = 'polaroid' | 'minimal' | 'vintage' | 'plain';
type EditTab = 'filter' | 'frame' | 'caption';

interface FilterDef { key: FilterKey; label: string; css: string; canvas: string; }
interface FrameDef { key: FrameKey; label: string; desc: string; }

const FILTERS: FilterDef[] = [
  { key: 'normal',    label: 'Normal',    css: '',                                                          canvas: 'none' },
  { key: 'grayscale', label: 'Mono',      css: 'grayscale(100%)',                                           canvas: 'grayscale(100%)' },
  { key: 'sepia',     label: 'Sepia',     css: 'sepia(80%)',                                                canvas: 'sepia(80%)' },
  { key: 'warm',      label: 'Warm',      css: 'saturate(140%) hue-rotate(10deg) brightness(1.05)',         canvas: 'saturate(140%) hue-rotate(10deg) brightness(1.05)' },
  { key: 'cool',      label: 'Cool',      css: 'saturate(80%) hue-rotate(-20deg) brightness(1.08)',         canvas: 'saturate(80%) hue-rotate(-20deg) brightness(1.08)' },
  { key: 'fade',      label: 'Fade',      css: 'contrast(0.78) brightness(1.12) saturate(0.65)',            canvas: 'contrast(0.78) brightness(1.12) saturate(0.65)' },
  { key: 'vivid',     label: 'Vivid',     css: 'saturate(180%) contrast(1.08)',                             canvas: 'saturate(180%) contrast(1.08)' },
];

const FRAMES: FrameDef[] = [
  { key: 'polaroid', label: 'Polaroid', desc: 'Bingkai putih klasik + tanggal' },
  { key: 'minimal',  label: 'Minimal',  desc: 'Border tipis elegan' },
  { key: 'vintage',  label: 'Vintage',  desc: 'Bingkai krem antik' },
  { key: 'plain',    label: 'Plain',    desc: 'Tanpa bingkai' },
];

async function renderFinalPhoto(
  imageSrc: string,
  filter: FilterKey,
  frame: FrameKey,
  caption: string,
): Promise<string> {
  return new Promise((resolve) => {
    const PHOTO = 720;
    const filterDef = FILTERS.find(f => f.key === filter)!;
    let cW = PHOTO, cH = PHOTO, pX = 0, pY = 0;

    if (frame === 'polaroid') { cW = PHOTO + 72; cH = PHOTO + 72 + 120; pX = 36; pY = 36; }
    else if (frame === 'minimal') { cW = PHOTO + 24; cH = PHOTO + 24; pX = 12; pY = 12; }
    else if (frame === 'vintage') { cW = PHOTO + 80; cH = PHOTO + 80; pX = 40; pY = 40; }

    const canvas = document.createElement('canvas');
    canvas.width = cW; canvas.height = cH;
    const ctx = canvas.getContext('2d')!;

    if (frame === 'polaroid') {
      ctx.fillStyle = '#FFFAF7';
      ctx.fillRect(0, 0, cW, cH);
    } else if (frame === 'minimal') {
      ctx.fillStyle = '#F8F4F0';
      ctx.fillRect(0, 0, cW, cH);
    } else if (frame === 'vintage') {
      ctx.fillStyle = '#F5ECD7';
      ctx.fillRect(0, 0, cW, cH);
      ctx.strokeStyle = '#C9A96E'; ctx.lineWidth = 2;
      ctx.strokeRect(14, 14, cW - 28, cH - 28);
      ctx.strokeStyle = '#C9A96E'; ctx.lineWidth = 0.5;
      ctx.strokeRect(22, 22, cW - 44, cH - 44);
    }

    const img = new Image();
    img.onload = () => {
      if (filterDef.canvas !== 'none') ctx.filter = filterDef.canvas;
      ctx.drawImage(img, pX, pY, PHOTO, PHOTO);
      ctx.filter = 'none';

      if (frame === 'polaroid') {
        const now = new Date();
        const dateStr = caption || now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        ctx.fillStyle = '#5A3E4C';
        ctx.font = '26px "Segoe Script","Lucida Handwriting",cursive';
        ctx.textAlign = 'center';
        ctx.fillText(dateStr, cW / 2, PHOTO + pY + 74);
      } else if (caption) {
        const grad = ctx.createLinearGradient(pX, pY + PHOTO - 80, pX, pY + PHOTO);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = grad;
        ctx.fillRect(pX, pY + PHOTO - 80, PHOTO, 80);
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.font = '22px "Segoe Script","Lucida Handwriting",cursive';
        ctx.textAlign = 'center';
        ctx.fillText(caption, pX + PHOTO / 2, pY + PHOTO - 22);
      }
      resolve(canvas.toDataURL('image/jpeg', 0.93));
    };
    img.src = imageSrc;
  });
}

function PhotoboothContent() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [stage, setStage] = useState<Stage>('camera');
  const [rawPhoto, setRawPhoto] = useState<string | null>(null);
  const [finalPhoto, setFinalPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('normal');
  const [selectedFrame, setSelectedFrame] = useState<FrameKey>('polaroid');
  const [caption, setCaption] = useState('');
  const [activeTab, setActiveTab] = useState<EditTab>('filter');
  const [processing, setProcessing] = useState(false);

  const [createNote] = useMutation<any>(CREATE_NOTE);
  const [addNoteImage] = useMutation<any>(ADD_NOTE_IMAGE);

  // Re-render preview whenever edit options change
  useEffect(() => {
    if (!rawPhoto || stage !== 'edit') return;
    let cancelled = false;
    setProcessing(true);
    renderFinalPhoto(rawPhoto, selectedFilter, selectedFrame, caption).then(result => {
      if (!cancelled) { setFinalPhoto(result); setProcessing(false); }
    });
    return () => { cancelled = true; };
  }, [rawPhoto, selectedFilter, selectedFrame, caption, stage]);

  const handleCapture = useCallback(async () => {
    const raw = webcamRef.current?.getScreenshot({ width: 720, height: 720 });
    if (!raw) return;
    setStage('flash');
    await new Promise(r => setTimeout(r, 160));
    setRawPhoto(raw);
    setStage('edit');
  }, []);

  const handleRetake = () => {
    setStage('camera');
    setRawPhoto(null);
    setFinalPhoto(null);
    setCaption('');
    setSelectedFilter('normal');
    setSelectedFrame('polaroid');
  };

  const handleDownload = () => {
    if (!finalPhoto) return;
    const a = document.createElement('a');
    a.href = finalPhoto;
    a.download = `konstelasi_photobooth_${Date.now()}.jpg`;
    a.click();
    notify.success('Foto diunduh!');
  };

  const handleSaveToCanvas = async () => {
    if (!finalPhoto) return;
    setStage('saving');
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';
      const res = await fetch(finalPhoto);
      const blob = await res.blob();
      const fileName = `photobooth_${Date.now()}.jpg`;
      const filePath = `${userId}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('notes_images').upload(filePath, blob, { contentType: 'image/jpeg' });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('notes_images').getPublicUrl(filePath);
      const now = new Date();
      const title = `📸 ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      const { data: noteData } = await createNote({
        variables: { input: { title, positionX: Math.random() * 400 + 200, positionY: Math.random() * 300 + 150 } },
      });
      if (noteData?.createNote) {
        await addNoteImage({
          variables: { input: { noteId: noteData.createNote.id, imageUrl: urlData.publicUrl, caption: caption || 'Photo Booth', order: 0 } },
        });
        setStage('done');
        notify.success('Foto tersimpan ke kanvas!');
        setTimeout(() => router.push('/canvas'), 1800);
      }
    } catch (err: any) {
      notify.error('Gagal menyimpan: ' + err.message);
      setStage('edit');
    }
  };

  const filterCss = FILTERS.find(f => f.key === selectedFilter)?.css || '';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#FFF1E8_0%,transparent_34%),radial-gradient(circle_at_bottom_right,#F2E8FF_0%,transparent_30%),linear-gradient(135deg,#FFF8F4_0%,#FFFAF7_50%,#F8F1FF_100%)]">
      {/* Orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#E63946]/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[-160px] right-[-120px] h-[400px] w-[400px] rounded-full bg-[#7C83FD]/12 blur-[120px]" />

      {/* Flash */}
      <AnimatePresence>
        {stage === 'flash' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }} className="fixed inset-0 z-50 bg-white" />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#E6B8A2]/15 bg-white/72 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <button onClick={() => router.push('/canvas')} className="rounded-xl p-2 transition-colors hover:bg-[#FFE5E8]/50">
            <ArrowLeft className="h-5 w-5 text-[#5A3E4C]/60" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E63946] to-[#9D0208]">
              <Camera className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-base font-bold text-[#3F2A35]">Photo Booth</h1>
          </div>
          {stage === 'edit' && (
            <span className="ml-auto rounded-full border border-[#E6B8A2]/30 bg-white/60 px-3 py-1 text-[11px] font-semibold text-[#9D0208]">
              Mode Edit
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_360px]">
        {/* Left: Camera / Preview */}
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-black shadow-[0_24px_80px_rgba(84,45,55,0.14)]" style={{ aspectRatio: '1/1' }}>
            {(stage === 'camera') && (
              <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode, aspectRatio: 1, width: 720, height: 720 }}
                mirrored={facingMode === 'user'} className="h-full w-full object-cover"
              />
            )}
            {(stage === 'edit' || stage === 'saving') && rawPhoto && (
              <div className="relative h-full w-full">
                <img src={rawPhoto} alt="preview" className="h-full w-full object-cover transition-all duration-500"
                  style={{ filter: filterCss }} />
                {processing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </div>
            )}
            {stage === 'done' && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#1a1625]">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#38D9A9] to-[#3BC9DB] shadow-[0_8px_32px_rgba(56,217,169,0.4)]">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <p className="text-sm font-semibold text-white/80">Tersimpan ke kanvas!</p>
              </motion.div>
            )}
            {/* Grid overlay on camera */}
            {stage === 'camera' && (
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:33.33%_33.33%]" />
            )}
          </div>

          {/* Camera controls */}
          {stage === 'camera' && (
            <div className="flex items-center justify-between">
              <button onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E6B8A2]/30 bg-white/60 text-[#5A3E4C]/60 transition-all hover:bg-white/80">
                <FlipHorizontal className="h-5 w-5" />
              </button>
              <button onClick={handleCapture}
                className="group relative flex h-18 w-18 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B7A] to-[#9D0208] shadow-[0_8px_32px_rgba(230,57,70,0.4)] transition-all hover:scale-105 hover:shadow-[0_12px_40px_rgba(230,57,70,0.5)] active:scale-95"
                style={{ width: '72px', height: '72px' }}>
                <span className="absolute inset-2 rounded-full border-2 border-white/30" />
                <Camera className="relative h-7 w-7 text-white" />
              </button>
              <div className="h-11 w-11" />
            </div>
          )}
        </div>

        {/* Right: Edit Panel */}
        {(stage === 'edit' || stage === 'saving') && (
          <div className="flex flex-col gap-4">
            {/* Tabs */}
            <div className="flex gap-1 rounded-2xl border border-[#E6B8A2]/20 bg-white/50 p-1 backdrop-blur-sm">
              {([['filter', 'Filter', Palette], ['frame', 'Frame', LayoutTemplate], ['caption', 'Caption', Type]] as const).map(([key, label, Icon]) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${activeTab === key ? 'bg-gradient-to-r from-[#9D0208] to-[#E63946] text-white shadow-sm' : 'text-[#5A3E4C]/55 hover:text-[#5A3E4C]'}`}>
                  <Icon className="h-3.5 w-3.5" />{label}
                </button>
              ))}
            </div>

            {/* Filter Tab */}
            {activeTab === 'filter' && (
              <div className="grid grid-cols-4 gap-2">
                {FILTERS.map(f => (
                  <button key={f.key} onClick={() => setSelectedFilter(f.key)}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2 transition-all ${selectedFilter === f.key ? 'border-[#9D0208]/40 bg-[#9D0208]/8 shadow-sm' : 'border-[#E6B8A2]/20 bg-white/50 hover:border-[#E6B8A2]/40'}`}>
                    {rawPhoto && (
                      <div className="h-12 w-12 overflow-hidden rounded-xl">
                        <img src={rawPhoto} alt={f.label} className="h-full w-full object-cover" style={{ filter: f.css }} />
                      </div>
                    )}
                    <span className={`text-[10px] font-semibold ${selectedFilter === f.key ? 'text-[#9D0208]' : 'text-[#5A3E4C]/55'}`}>{f.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Frame Tab */}
            {activeTab === 'frame' && (
              <div className="grid grid-cols-2 gap-2">
                {FRAMES.map(fr => (
                  <button key={fr.key} onClick={() => setSelectedFrame(fr.key)}
                    className={`rounded-2xl border p-3 text-left transition-all ${selectedFrame === fr.key ? 'border-[#9D0208]/40 bg-[#9D0208]/8' : 'border-[#E6B8A2]/20 bg-white/50 hover:border-[#E6B8A2]/40'}`}>
                    <p className={`text-xs font-bold ${selectedFrame === fr.key ? 'text-[#9D0208]' : 'text-[#3F2A35]'}`}>{fr.label}</p>
                    <p className="mt-0.5 text-[10px] text-[#5A3E4C]/50">{fr.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Caption Tab */}
            {activeTab === 'caption' && (
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#5A3E4C]/45">Teks / Caption</label>
                <textarea value={caption} onChange={e => setCaption(e.target.value)} rows={3}
                  placeholder="Tulis caption atau biarkan kosong untuk tanggal otomatis..."
                  className="w-full resize-none rounded-2xl border border-[#E6B8A2]/30 bg-white/65 px-4 py-3 text-sm text-[#3F2A35] outline-none placeholder:text-[#5A3E4C]/30 focus:border-[#9D0208]/35 focus:ring-4 focus:ring-[#E6B8A2]/20 font-scrapbook-handwriting" />
              </div>
            )}

            {/* Preview final */}
            {finalPhoto && !processing && (
              <div className="overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(84,45,55,0.12)]">
                <img src={finalPhoto} alt="final" className="w-full" />
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-auto flex flex-col gap-2">
              <button onClick={handleSaveToCanvas} disabled={stage === 'saving' || processing}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#9D0208] via-[#E63946] to-[#D9A441] py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(157,2,8,0.25)] transition-all hover:shadow-[0_12px_32px_rgba(157,2,8,0.35)] disabled:opacity-60">
                {stage === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {stage === 'saving' ? 'Menyimpan...' : 'Simpan ke Kanvas'}
              </button>
              <div className="flex gap-2">
                <button onClick={handleDownload} disabled={processing}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#E6B8A2]/30 bg-white/60 py-3 text-xs font-semibold text-[#5A3E4C]/70 transition-all hover:bg-white/80 disabled:opacity-50">
                  <Download className="h-4 w-4" /> Unduh
                </button>
                <button onClick={handleRetake}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#E6B8A2]/30 bg-white/60 py-3 text-xs font-semibold text-[#5A3E4C]/70 transition-all hover:bg-white/80">
                  <RotateCcw className="h-4 w-4" /> Ulangi
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PhotoboothPage() {
  return (
    <ApolloWrapper>
      <Providers>
        <PhotoboothContent />
      </Providers>
    </ApolloWrapper>
  );
}
