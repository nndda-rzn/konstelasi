'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { X, Eraser, Download, Palette } from 'lucide-react';

interface DrawingCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (dataUrl: string) => void;
}

const COLORS = ['#4A2F3C', '#FF8FA3', '#FFB4A2', '#B5EAD7', '#C7CEEA', '#FFD6A5', '#E0BBE4', '#FF6B9D'];

export default function DrawingCanvas({ isOpen, onClose, onSave }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#4A2F3C');
  const [lineWidth, setLineWidth] = useState(3);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [isOpen]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setLastPos(getPos(e));
  };

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !lastPos) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    setLastPos(pos);
  }, [isDrawing, lastPos, color, lineWidth]);

  const stopDraw = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    if (onSave) {
      onSave(dataUrl);
    } else {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `drawing_${new Date().toISOString().split('T')[0]}.png`;
      a.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[700px] max-w-[90vw] bg-white dark:bg-[#2a2438] rounded-2xl border border-[#FFB4A2]/20 dark:border-[#FF8FA3]/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#FF8FA3]" />
            <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Drawing Canvas</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFB4A2]/10 transition-colors">
            <X className="w-4 h-4 text-[#5A3E4C]/60 dark:text-[#e2d9f3]/60" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-[#FFB4A2]/10 dark:border-[#FF8FA3]/10">
          {/* Colors */}
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-1 ring-[#FF8FA3] scale-110' : 'hover:scale-110'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="w-px h-5 bg-[#FFB4A2]/15" />

          {/* Line Width */}
          <input
            type="range"
            min="1"
            max="12"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-20 h-1.5 accent-[#FF8FA3]"
          />
          <span className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 w-4">{lineWidth}</span>

          <div className="w-px h-5 bg-[#FFB4A2]/15" />

          {/* Actions */}
          <button onClick={clearCanvas} className="p-1.5 rounded-lg hover:bg-[#FFB4A2]/10 text-[#5A3E4C]/50 dark:text-[#e2d9f3]/50 hover:text-[#FF8FA3] transition-all" title="Hapus">
            <Eraser className="w-4 h-4" />
          </button>
          <button onClick={saveCanvas} className="p-1.5 rounded-lg hover:bg-[#FFB4A2]/10 text-[#5A3E4C]/50 dark:text-[#e2d9f3]/50 hover:text-[#FF8FA3] transition-all" title="Simpan">
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas */}
        <div className="p-4">
          <canvas
            ref={canvasRef}
            width={650}
            height={400}
            className="w-full rounded-xl border border-[#FFB4A2]/15 dark:border-[#FF8FA3]/10 cursor-crosshair bg-white"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
          />
        </div>
      </div>
    </div>
  );
}
