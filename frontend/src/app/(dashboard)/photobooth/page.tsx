'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, RotateCcw, FlipHorizontal, Download, Save,
  Loader2, Palette, LayoutTemplate, Check, Timer, Smile, X,
} from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import { CREATE_NOTE, ADD_NOTE_IMAGE } from '@/graphql/mutations';
import { createClient } from '@/lib/supabase/client';
import { notify } from '@/lib/toast';
import { ApolloWrapper } from '@/lib/apollo/ApolloWrapper';
import { Providers } from '@/lib/Providers';

type Stage = 'landing' | 'setup' | 'countdown' | 'flash' | 'edit' | 'saving' | 'done';
type FilterKey = 'normal' | 'grayscale' | 'sepia' | 'warm' | 'cool' | 'fade' | 'vivid';
type LayoutKey = 'single' | 'strip3' | 'strip4' | 'grid4' | 'grid6';
type EditTab = 'filter' | 'color' | 'sticker' | 'caption';

interface StickerItem { id: string; emoji: string; x: number; y: number; }

const FILTERS = [
  { key: 'normal' as FilterKey, label: 'Normal', css: '', canvas: 'none' },
  { key: 'grayscale' as FilterKey, label: 'Mono', css: 'grayscale(100%)', canvas: 'grayscale(100%)' },
  { key: 'sepia' as FilterKey, label: 'Sepia', css: 'sepia(80%)', canvas: 'sepia(80%)' },
  { key: 'warm' as FilterKey, label: 'Warm', css: 'saturate(140%) hue-rotate(10deg) brightness(1.05)', canvas: 'saturate(140%) hue-rotate(10deg) brightness(1.05)' },
  { key: 'cool' as FilterKey, label: 'Cool', css: 'saturate(80%) hue-rotate(-20deg) brightness(1.08)', canvas: 'saturate(80%) hue-rotate(-20deg) brightness(1.08)' },
  { key: 'fade' as FilterKey, label: 'Fade', css: 'contrast(0.78) brightness(1.12) saturate(0.65)', canvas: 'contrast(0.78) brightness(1.12) saturate(0.65)' },
  { key: 'vivid' as FilterKey, label: 'Vivid', css: 'saturate(180%) contrast(1.08)', canvas: 'saturate(180%) contrast(1.08)' },
];

const LAYOUTS = [
  { key: 'single' as LayoutKey, label: '1 Foto', desc: 'Polaroid klasik', shots: 1 },
  { key: 'strip3' as LayoutKey, label: 'Strip 3', desc: '3 foto vertikal', shots: 3 },
  { key: 'strip4' as LayoutKey, label: 'Strip 4', desc: '4 foto vertikal', shots: 4 },
  { key: 'grid4' as LayoutKey, label: 'Grid 2x2', desc: '4 foto kotak', shots: 4 },
  { key: 'grid6' as LayoutKey, label: 'Grid 3x2', desc: '6 foto kolase', shots: 6 },
];

const TIMERS = [{ value: 3, label: '3s' }, { value: 5, label: '5s' }];

const STRIP_COLORS = [
  { key: 'white', label: 'Putih', bg: '#FFFAF7', text: '#5A3E4C' },
  { key: 'black', label: 'Hitam', bg: '#1a1a1a', text: 'rgba(255,255,255,0.8)' },
  { key: 'pink', label: 'Soft Pink', bg: '#FFE5E8', text: '#5A3E4C' },
  { key: 'warm', label: 'Warm Paper', bg: '#F5ECD7', text: '#5A3E4C' },
];

const EMOJI_PALETTE = ['🎀', '✨', '💖', '🌸', '🍒', '🦋', '🧸', '💌', '☁️', '🍓', '⭐', '🌷', '🩷', '🫧', '🪄', '🎂'];

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
}

function drawStickers(ctx: CanvasRenderingContext2D, stickers: StickerItem[], cW: number, cH: number) {
  stickers.forEach(s => {
    ctx.font = '42px serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.emoji, (s.x / 100) * cW, (s.y / 100) * cH);
  });
}

async function renderSingle(src: string, filter: FilterKey, stickers: StickerItem[], caption: string): Promise<string> {
  const S = 720, P = 36, B = 110;
  const cW = S + P * 2, cH = S + P * 2 + B;
  const canvas = document.createElement('canvas'); canvas.width = cW; canvas.height = cH;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#FFFAF7'; ctx.fillRect(0, 0, cW, cH);
  const img = await loadImg(src);
  const f = FILTERS.find(x => x.key === filter)!;
  if (f.canvas !== 'none') ctx.filter = f.canvas;
  ctx.drawImage(img, P, P, S, S); ctx.filter = 'none';
  const d = caption || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillStyle = '#5A3E4C'; ctx.font = '24px "Segoe Script","Lucida Handwriting",cursive';
  ctx.textAlign = 'center'; ctx.fillText(d, cW / 2, S + P + 68);
  drawStickers(ctx, stickers, cW, cH);
  return canvas.toDataURL('image/jpeg', 0.93);
}

async function renderStrip(photos: string[], filter: FilterKey, colorKey: string, stickers: StickerItem[], caption: string): Promise<string> {
  const W = 580, H = 580, PAD = 28, GAP = 12, FOOT = 80;
  const cW = W + PAD * 2;
  const cH = H * photos.length + GAP * (photos.length - 1) + PAD * 2 + FOOT;
  const color = STRIP_COLORS.find(c => c.key === colorKey) || STRIP_COLORS[0];
  const f = FILTERS.find(x => x.key === filter)!;
  const canvas = document.createElement('canvas'); canvas.width = cW; canvas.height = cH;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color.bg; ctx.fillRect(0, 0, cW, cH);
  const imgs = await Promise.all(photos.map(loadImg));
  imgs.forEach((img, i) => {
    if (f.canvas !== 'none') ctx.filter = f.canvas;
    ctx.drawImage(img, PAD, PAD + i * (H + GAP), W, H); ctx.filter = 'none';
  });
  const d = caption || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillStyle = color.text;
  ctx.font = 'bold 16px "Segoe Script","Lucida Handwriting",cursive'; ctx.textAlign = 'center';
  ctx.fillText('Konstelasi', cW / 2, cH - FOOT / 2 - 6);
  ctx.font = '12px "Segoe Script","Lucida Handwriting",cursive';
  ctx.fillText(d, cW / 2, cH - FOOT / 2 + 16);
  drawStickers(ctx, stickers, cW, cH);
  return canvas.toDataURL('image/jpeg', 0.93);
}

async function renderGrid(photos: string[], filter: FilterKey, colorKey: string, cols: number, stickers: StickerItem[], caption: string): Promise<string> {
  const CELL = 360, PAD = 24, GAP = 10, FOOT = 70;
  const rows = Math.ceil(photos.length / cols);
  const cW = CELL * cols + GAP * (cols - 1) + PAD * 2;
  const cH = CELL * rows + GAP * (rows - 1) + PAD * 2 + FOOT;
  const color = STRIP_COLORS.find(c => c.key === colorKey) || STRIP_COLORS[0];
  const f = FILTERS.find(x => x.key === filter)!;
  const canvas = document.createElement('canvas'); canvas.width = cW; canvas.height = cH;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color.bg; ctx.fillRect(0, 0, cW, cH);
  const imgs = await Promise.all(photos.map(loadImg));
  imgs.forEach((img, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = PAD + col * (CELL + GAP), y = PAD + row * (CELL + GAP);
    if (f.canvas !== 'none') ctx.filter = f.canvas;
    ctx.drawImage(img, x, y, CELL, CELL); ctx.filter = 'none';
  });
  const d = caption || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillStyle = color.text;
  ctx.font = 'bold 16px "Segoe Script","Lucida Handwriting",cursive'; ctx.textAlign = 'center';
  ctx.fillText('Konstelasi  •  ' + d, cW / 2, cH - FOOT / 2 + 4);
  drawStickers(ctx, stickers, cW, cH);
  return canvas.toDataURL('image/jpeg', 0.93);
}

function PhotoboothContent() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const capturedRef = useRef<string[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>('landing');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [finalPhoto, setFinalPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('normal');
  const [selectedLayout, setSelectedLayout] = useState<LayoutKey>('strip4');
  const [selectedTimer, setSelectedTimer] = useState(3);
  const [selectedStripColor, setSelectedStripColor] = useState('white');
  const [caption, setCaption] = useState('');
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [activeTab, setActiveTab] = useState<EditTab>('filter');
  const [processing, setProcessing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [createNote] = useMutation<any>(CREATE_NOTE);
  const [addNoteImage] = useMutation<any>(ADD_NOTE_IMAGE);
  const layoutDef = LAYOUTS.find(l => l.key === selectedLayout)!;

  // Render preview
  useEffect(() => {
    if (capturedPhotos.length === 0 || stage !== 'edit') return;
    let cancelled = false; setProcessing(true);
    let p: Promise<string>;
    if (selectedLayout === 'single') p = renderSingle(capturedPhotos[0], selectedFilter, stickers, caption);
    else if (selectedLayout === 'grid4') p = renderGrid(capturedPhotos, selectedFilter, selectedStripColor, 2, stickers, caption);
    else if (selectedLayout === 'grid6') p = renderGrid(capturedPhotos, selectedFilter, selectedStripColor, 3, stickers, caption);
    else p = renderStrip(capturedPhotos, selectedFilter, selectedStripColor, stickers, caption);
    p.then(r => { if (!cancelled) { setFinalPhoto(r); setProcessing(false); } });
    return () => { cancelled = true; };
  }, [capturedPhotos, selectedFilter, selectedStripColor, caption, stickers, stage, selectedLayout]);

  // Countdown tick
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c !== null ? c - 1 : null), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Take shot when countdown hits 0
  useEffect(() => {
    if (countdown !== 0 || !isCapturing) return;
    setCountdown(null);
    const raw = webcamRef.current?.getScreenshot({ width: 720, height: 720 });
    if (!raw) return;
    setStage('flash');
    setTimeout(() => {
      capturedRef.current = [...capturedRef.current, raw];
      setCapturedPhotos([...capturedRef.current]);
      if (capturedRef.current.length >= layoutDef.shots) {
        setIsCapturing(false); setStage('edit');
      } else {
        setStage('countdown'); setCountdown(selectedTimer);
      }
    }, 200);
  }, [countdown, isCapturing, layoutDef.shots, selectedTimer]);

  const handleStart = useCallback(() => {
    capturedRef.current = []; setCapturedPhotos([]); setFinalPhoto(null); setStickers([]);
    setIsCapturing(true); setStage('countdown'); setCountdown(selectedTimer);
  }, [selectedTimer]);

  const handleRetake = () => {
    setStage('setup'); setCapturedPhotos([]); capturedRef.current = [];
    setFinalPhoto(null); setCaption(''); setStickers([]); setIsCapturing(false); setCountdown(null);
  };

  const addSticker = (emoji: string) => {
    setStickers(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, emoji, x: 50, y: 50 }]);
  };

  const removeSticker = (id: string) => setStickers(prev => prev.filter(s => s.id !== id));

  const handleDownload = () => {
    if (!finalPhoto) return;
    const a = document.createElement('a'); a.href = finalPhoto;
    a.download = `konstelasi_photobooth_${Date.now()}.jpg`; a.click();
    notify.success('Foto diunduh!');
  };

  const handleSave = async () => {
    if (!finalPhoto) return; setStage('saving');
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';
      const res = await fetch(finalPhoto); const blob = await res.blob();
      const filePath = `${userId}/photobooth_${Date.now()}.jpg`;
      const { error: err } = await supabase.storage.from('notes_images').upload(filePath, blob, { contentType: 'image/jpeg' });
      if (err) throw err;
      const { data: urlData } = supabase.storage.from('notes_images').getPublicUrl(filePath);
      const title = `📸 ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      const { data: nd } = await createNote({ variables: { input: { title, positionX: Math.random() * 400 + 200, positionY: Math.random() * 300 + 150 } } });
      if (nd?.createNote) {
        await addNoteImage({ variables: { input: { noteId: nd.createNote.id, imageUrl: urlData.publicUrl, caption: caption || 'Photo Booth', order: 0 } } });
        setStage('done'); notify.success('Foto tersimpan ke kanvas!');
        setTimeout(() => router.push('/canvas'), 1800);
      }
    } catch (e: any) { notify.error('Gagal: ' + e.message); setStage('edit'); }
  };

  const filterCss = FILTERS.find(f => f.key === selectedFilter)?.css || '';

  return (
    <>
      {/* LANDING */}
      {stage === 'landing' && (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#FFF5F7]">
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFB8C0]/40 blur-[160px]" />
          <div className="pointer-events-none absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#FFE5E8]/60 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#FFE5E8]/50 blur-[120px]" />
          <motion.div animate={{ y: [0, -12, 0], rotate: [-8, -6, -8] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-[6%] top-[18%] hidden lg:flex flex-col gap-2 rounded-lg bg-white p-2 shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
            {[1,2,3,4].map(i => (<div key={i} className="h-20 w-16 rounded-sm bg-gradient-to-br from-[#f0e8e4] to-[#e8ddd8]" />))}
            <p className="text-center text-[8px] font-medium text-[#8C7783] mt-1">konstelasi</p>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0], rotate: [6, 8, 6] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-[6%] top-[15%] hidden lg:flex flex-col gap-2 rounded-lg bg-white p-2 shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
            {[1,2,3,4].map(i => (<div key={i} className="h-20 w-16 rounded-sm bg-gradient-to-br from-[#ede5e0] to-[#e0d6d0]" />))}
            <p className="text-center text-[8px] font-medium text-[#8C7783] mt-1">konstelasi</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 flex flex-col items-center text-center px-6">
            <div className="flex items-center gap-6 mb-2">
              <span className="text-sm font-light tracking-[0.3em] text-[#8C7783] uppercase">Est</span>
              <h1 className="text-[clamp(3rem,10vw,7rem)] font-extralight tracking-[-0.04em] text-[#3F2A35] leading-none">photobooth</h1>
              <span className="text-sm font-light tracking-[0.3em] text-[#8C7783] uppercase">2026</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#8C7783]">Simpan momen kecil sebelum ia berubah menjadi kenangan besar.</p>
            <motion.button onClick={() => setStage('setup')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="mt-10 flex items-center gap-3 rounded-full bg-gradient-to-r from-[#E63946] to-[#FF6B7A] px-10 py-4 text-base font-bold text-white shadow-[0_12px_40px_rgba(230,57,70,0.35)] hover:shadow-[0_16px_52px_rgba(230,57,70,0.45)]">
              START <Camera className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* APP */}
      {stage !== 'landing' && (
      <div className="relative min-h-screen overflow-hidden bg-[#FFF5F7]">
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFB8C0]/20 blur-[130px]" />
        <AnimatePresence>{stage === 'flash' && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="fixed inset-0 z-50 bg-white" />)}</AnimatePresence>

        <header className="sticky top-0 z-20 border-b border-[#FFB8C0]/15 bg-white/72 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E63946] to-[#9D0208]"><Camera className="h-4 w-4 text-white" /></div>
              <h1 className="text-base font-bold text-[#3F2A35]">Photo Booth</h1>
            </div>
            {(stage === 'countdown' || stage === 'flash') && (<span className="ml-auto rounded-full border border-[#FFB8C0]/30 bg-white/60 px-3 py-1 text-[11px] font-semibold text-[#E63946]">Foto {capturedPhotos.length + 1} / {layoutDef.shots}</span>)}
            {stage === 'edit' && (<span className="ml-auto rounded-full border border-[#FFB8C0]/30 bg-white/60 px-3 py-1 text-[11px] font-semibold text-[#E63946]">Mode Edit</span>)}
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-8">
          {/* SETUP & COUNTDOWN */}
          {(stage === 'setup' || stage === 'countdown' || stage === 'flash') && (
            <div className="flex flex-col gap-6">
              <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/60 bg-black shadow-[0_24px_80px_rgba(84,45,55,0.14)]" style={{ aspectRatio: '1/1' }}>
                <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={{ facingMode, aspectRatio: 1, width: 720, height: 720 }} mirrored={facingMode === 'user'} className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:33.33%_33.33%]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.3)_100%)]" />
                <AnimatePresence>{stage === 'countdown' && countdown !== null && countdown > 0 && (
                  <motion.div key={countdown} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[120px] font-black text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] leading-none">{countdown}</span>
                  </motion.div>
                )}</AnimatePresence>
              </div>
              {capturedPhotos.length > 0 && (
                <div className="flex justify-center gap-3">
                  {capturedPhotos.map((p, i) => (<motion.div key={i} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-14 w-[74px] overflow-hidden rounded-lg border-2 border-[#E63946]/30 shadow-md"><img src={p} alt="" className="h-full w-full object-cover" style={{ filter: filterCss }} /></motion.div>))}
                  {Array.from({ length: layoutDef.shots - capturedPhotos.length }).map((_, i) => (<div key={`e${i}`} className="h-14 w-[74px] rounded-lg border-2 border-dashed border-[#FFB8C0]/40 bg-white/30" />))}
                </div>
              )}
              {stage === 'setup' && (
                <div className="mx-auto w-full max-w-xl space-y-4">
                  <div>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#6D5561]"><LayoutTemplate className="inline h-3.5 w-3.5 mr-1" />Layout</p>
                    <div className="grid grid-cols-5 gap-2">
                      {LAYOUTS.map(l => (
                        <button key={l.key} onClick={() => setSelectedLayout(l.key)} className={`rounded-2xl border p-2.5 text-center transition-all ${selectedLayout === l.key ? 'border-[#E63946]/40 bg-[#E63946]/6 shadow-sm' : 'border-[#FFB8C0]/25 bg-white/50 hover:border-[#FFB8C0]/50'}`}>
                          <p className={`text-xs font-bold ${selectedLayout === l.key ? 'text-[#E63946]' : 'text-[#3F2A35]'}`}>{l.label}</p>
                          <p className="text-[9px] text-[#8C7783] mt-0.5">{l.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#6D5561]"><Timer className="inline h-3.5 w-3.5 mr-1" />Timer</p>
                    <div className="flex gap-2">
                      {TIMERS.map(t => (<button key={t.value} onClick={() => setSelectedTimer(t.value)} className={`flex-1 rounded-2xl border py-2.5 text-sm font-semibold transition-all ${selectedTimer === t.value ? 'border-[#E63946]/40 bg-[#E63946]/6 text-[#E63946]' : 'border-[#FFB8C0]/25 bg-white/50 text-[#6D5561]'}`}>{t.label}</button>))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FFB8C0]/25 bg-white/60 text-[#6D5561] hover:bg-white/80"><FlipHorizontal className="h-5 w-5" /></button>
                    <button onClick={handleStart} className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#E63946] to-[#FF6B7A] py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(230,57,70,0.25)] hover:shadow-[0_12px_32px_rgba(230,57,70,0.35)] transition-all">
                      <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
                      <Camera className="relative h-5 w-5" /><span className="relative">Mulai Sesi Foto</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EDIT */}
          {(stage === 'edit' || stage === 'saving') && (
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div ref={previewRef} className="relative mx-auto w-full max-w-sm overflow-auto rounded-2xl shadow-[0_16px_48px_rgba(84,45,55,0.12)]" style={{ maxHeight: '72vh' }}>
                {finalPhoto && !processing ? (<img src={finalPhoto} alt="result" className="w-full" />) : (<div className="flex aspect-[3/4] items-center justify-center bg-[#FFF5F7]"><Loader2 className="h-8 w-8 animate-spin text-[#E63946]/50" /></div>)}
                {/* Sticker overlay for drag */}
                {stickers.map(s => (
                  <motion.div key={s.id} drag dragMomentum={false} dragConstraints={previewRef}
                    className="absolute cursor-grab active:cursor-grabbing text-3xl select-none" style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%,-50%)' }}
                    onDragEnd={(_, info) => { if (!previewRef.current) return; const rect = previewRef.current.getBoundingClientRect(); const nx = ((info.point.x - rect.left) / rect.width) * 100; const ny = ((info.point.y - rect.top) / rect.height) * 100; setStickers(prev => prev.map(st => st.id === s.id ? { ...st, x: Math.max(0, Math.min(100, nx)), y: Math.max(0, Math.min(100, ny)) } : st)); }}>
                    {s.emoji}
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-1 rounded-2xl border border-[#FFB8C0]/20 bg-white/50 p-1">
                  {([['filter','Filter',Palette],['color','Warna',LayoutTemplate],['sticker','Stiker',Smile]] as const).map(([k,lbl,Icon]) => (
                    <button key={k} onClick={() => setActiveTab(k as EditTab)} className={`flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition-all ${activeTab === k ? 'bg-[#E63946] text-white shadow-sm' : 'text-[#6D5561] hover:text-[#3F2A35]'}`}><Icon className="h-3.5 w-3.5" />{lbl}</button>
                  ))}
                </div>
                {activeTab === 'filter' && (<div className="grid grid-cols-4 gap-2">{FILTERS.map(f => (<button key={f.key} onClick={() => setSelectedFilter(f.key)} className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2 transition-all ${selectedFilter === f.key ? 'border-[#E63946]/40 bg-[#E63946]/6' : 'border-[#FFB8C0]/20 bg-white/50 hover:border-[#FFB8C0]/40'}`}>{capturedPhotos[0] && <div className="h-10 w-10 overflow-hidden rounded-lg"><img src={capturedPhotos[0]} alt="" className="h-full w-full object-cover" style={{ filter: f.css }} /></div>}<span className={`text-[10px] font-semibold ${selectedFilter === f.key ? 'text-[#E63946]' : 'text-[#6D5561]'}`}>{f.label}</span></button>))}</div>)}
                {activeTab === 'color' && selectedLayout !== 'single' && (<div className="grid grid-cols-2 gap-2">{STRIP_COLORS.map(c => (<button key={c.key} onClick={() => setSelectedStripColor(c.key)} className={`rounded-2xl border p-3 text-left transition-all ${selectedStripColor === c.key ? 'border-[#E63946]/40 bg-[#E63946]/6' : 'border-[#FFB8C0]/20 bg-white/50 hover:border-[#FFB8C0]/40'}`}><div className="mb-2 h-6 w-full rounded-lg" style={{ backgroundColor: c.bg, border: c.key === 'white' ? '1px solid #eee' : 'none' }} /><p className={`text-xs font-bold ${selectedStripColor === c.key ? 'text-[#E63946]' : 'text-[#3F2A35]'}`}>{c.label}</p></button>))}</div>)}
                {activeTab === 'color' && selectedLayout === 'single' && (<p className="text-xs text-[#8C7783] text-center py-4">Warna frame hanya untuk mode Strip/Grid.</p>)}
                {activeTab === 'sticker' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-8 gap-1.5">{EMOJI_PALETTE.map(e => (<button key={e} onClick={() => addSticker(e)} className="flex h-9 w-9 items-center justify-center rounded-xl text-xl hover:bg-[#FFE5E8]/60 transition-colors">{e}</button>))}</div>
                    {stickers.length > 0 && (<div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-widest text-[#6D5561]">Aktif ({stickers.length})</p><div className="flex flex-wrap gap-1.5">{stickers.map(s => (<button key={s.id} onClick={() => removeSticker(s.id)} className="flex items-center gap-1 rounded-full border border-[#FFB8C0]/30 bg-white/60 px-2 py-1 text-sm hover:bg-red-50 hover:border-red-200 transition-all">{s.emoji}<X className="h-3 w-3 text-[#8C7783]" /></button>))}</div></div>)}
                    <p className="text-[10px] text-[#8C7783]">Klik emoji untuk menambah. Geser di preview untuk memposisikan.</p>
                  </div>
                )}
                <div><p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-[#6D5561]">Caption</p><input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Tulis caption..." className="w-full rounded-2xl border border-[#FFB8C0]/25 bg-white/65 px-4 py-2.5 text-sm text-[#3F2A35] outline-none placeholder:text-[#8C7783]/60 focus:border-[#E63946]/35 focus:ring-4 focus:ring-[#FFB8C0]/15 font-scrapbook-handwriting" /></div>
                <div className="mt-auto flex flex-col gap-2">
                  <button onClick={handleSave} disabled={stage === 'saving' || processing} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E63946] to-[#FF6B7A] py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(230,57,70,0.22)] disabled:opacity-60">{stage === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{stage === 'saving' ? 'Menyimpan...' : 'Simpan ke Kanvas'}</button>
                  <div className="flex gap-2">
                    <button onClick={handleDownload} disabled={processing} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#FFB8C0]/25 bg-white/60 py-3 text-xs font-semibold text-[#6D5561] hover:bg-white/80 disabled:opacity-50"><Download className="h-4 w-4" />Unduh</button>
                    <button onClick={handleRetake} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#FFB8C0]/25 bg-white/60 py-3 text-xs font-semibold text-[#6D5561] hover:bg-white/80"><RotateCcw className="h-4 w-4" />Ulangi</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DONE */}
          {stage === 'done' && (<motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-4"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#38D9A9] to-[#3BC9DB] shadow-[0_8px_32px_rgba(56,217,169,0.4)]"><Check className="h-10 w-10 text-white" /></div><p className="text-sm font-semibold text-[#3F2A35]/80">Foto tersimpan ke kanvas!</p></motion.div>)}
        </main>
      </div>
      )}
    </>
  );
}

export default function PhotoboothPage() {
  return (<ApolloWrapper><Providers><PhotoboothContent /></Providers></ApolloWrapper>);
}
