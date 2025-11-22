import React, { useRef, useEffect, useState } from 'react';
import { Eraser, Undo, Trash2, Send, GripHorizontal, Image } from 'lucide-react';

interface DrawingCanvasProps {
  onSend: (dataUrl: string) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onSend }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(4);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [canvasHeight, setCanvasHeight] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasWidth, setCanvasWidth] = useState(100); // Percentage
  const [hasInk, setHasInk] = useState(false);

  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize and resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save current content
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

    // Setup scaling for Retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = canvasHeight * dpr;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Restore content (or clear if new)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, canvasHeight);
    if (hasInk) {
      ctx.drawImage(tempCanvas, 0, 0, rect.width * dpr, canvasHeight * dpr);
    }

  }, [canvasHeight, canvasWidth]); // Re-run when size changes

  const getPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDraw = (e: React.PointerEvent) => {
    e.preventDefault();

    // Check if clicking on uploaded image
    if (uploadedImage && canvasRef.current) {
      const pos = getPos(e);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Calculate image dimensions
      const maxSize = 200;
      let width = uploadedImage.width;
      let height = uploadedImage.height;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width *= ratio;
        height *= ratio;
      }

      // Check if click is within image bounds
      if (pos.x >= imagePosition.x && pos.x <= imagePosition.x + width &&
        pos.y >= imagePosition.y && pos.y <= imagePosition.y + height) {
        setIsDraggingImage(true);
        setDragStart({ x: pos.x - imagePosition.x, y: pos.y - imagePosition.y });
        return; // Don't start drawing
      }
    }

    setIsDrawing(true);
    const pos = getPos(e);
    startPos.current = pos;
  };

  const draw = (e: React.PointerEvent) => {
    e.preventDefault();

    if (isDraggingImage) {
      const pos = getPos(e);
      setImagePosition({
        x: pos.x - dragStart.x,
        y: pos.y - dragStart.y
      });
      return;
    }

    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(startPos.current.x, startPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    startPos.current = pos;
    setHasInk(true);
  };

  const endDraw = () => {
    setIsDrawing(false);
    setIsDraggingImage(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    // Refill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasInk(false);
    setUploadedImage(null); // Clear uploaded image too
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          setUploadedImage(img);
          setImagePosition({ x: 50, y: 50 });
          setHasInk(true);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    clearCanvas();
  };

  const handleUndo = () => {
    // Simple undo would require history tracking - for now just clear
    if (hasInk) {
      clearCanvas();
    }
  };

  const handleSend = () => {
    if (!hasInk) {
      alert('Draw something first!');
      return;
    }
    if (canvasRef.current) {
      onSend(canvasRef.current.toDataURL('image/png'));
      clearCanvas();
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'drawing.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = canvasHeight;

    const handleMouseMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - startY;
      setCanvasHeight(Math.max(100, startHeight + deltaY));
    };

    const handleMouseUp = () => {
      document.removeEventListener('pointermove', handleMouseMove);
      document.removeEventListener('pointerup', handleMouseUp);
    };

    document.addEventListener('pointermove', handleMouseMove);
    document.addEventListener('pointerup', handleMouseUp);
  };

  // Redraw canvas when image position changes (from dragging)
  useEffect(() => {
    if (uploadedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear and redraw
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, canvasHeight);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, canvasHeight);

        // Draw image at new position
        const maxSize = 200;
        let width = uploadedImage.width;
        let height = uploadedImage.height;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }
        ctx.drawImage(uploadedImage, imagePosition.x, imagePosition.y, width, height);
        setHasInk(true);
      }
    }
  }, [imagePosition, uploadedImage]);

  return (
    <div className="border-4 border-black rounded-lg p-4 bg-white mb-4">
      <div className="flex flex-wrap items-center gap-4 mb-3 pb-3 border-b-2 border-gray-100">
        <div className="flex gap-2 items-center">
          📏
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 p-0 border-2 border-black rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 border-l-2 border-gray-200 pl-4">
          <div className="w-2 h-2 rounded-full bg-black"></div>
          <input
            type="range"
            min="1"
            max="12"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-20 accent-black"
            title="Brush Size"
          />
          <div className="w-4 h-4 rounded-full bg-black"></div>
        </div>

        <div className="flex items-center gap-2 border-l-2 border-gray-200 pl-4">
          📐
          <input
            type="range"
            min="200"
            max="600"
            step="20"
            value={canvasHeight}
            onChange={(e) => setCanvasHeight(Number(e.target.value))}
            className="w-20 accent-black"
            title="Canvas Height"
          />
          <span className="text-xs font-bold">H</span>
        </div>

        <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg border-2 border-gray-200">
          <button
            onClick={() => setIsErasing(false)}
            className={`p-2 rounded transition-colors ${!isErasing ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
            title="Draw"
          >
            ✏️
          </button>
          <button
            onClick={() => setIsErasing(true)}
            className={`p-2 rounded transition-colors ${isErasing ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
            title="Erase"
          >
            <Eraser size={18} />
          </button>
          <button
            onClick={handleUndo}
            className="p-2 rounded bg-white hover:bg-gray-100 transition-colors"
            title="Undo"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded bg-white hover:bg-gray-100 transition-colors"
            title="Clear"
          >
            <Trash2 size={18} />
          </button>
          <label
            className="p-2 rounded bg-white hover:bg-gray-100 transition-colors cursor-pointer"
            title="Upload Image"
          >
            <Image size={18} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={handleSend}
            className="p-2 rounded bg-black text-white hover:bg-gray-800 transition-colors ml-auto"
            title="Send"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2 border-l-2 border-gray-200 pl-4">
          📏
          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={canvasWidth}
            onChange={(e) => setCanvasWidth(Number(e.target.value))}
            className="w-20 accent-black"
            title="Canvas Width %"
          />
          <span className="text-xs font-bold">W%</span>
        </div>

        <div className="ml-auto flex gap-2">
          <button
            onClick={clearCanvas}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold border-2 border-black rounded hover:bg-red-50 text-red-600 transition-colors"
          >
            <Eraser size={14} /> Clear
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-2 bg-white border-2 border-black rounded font-bold text-xs hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            💾 Download
          </button>
          <button
            onClick={handleSend}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold bg-black text-white border-2 border-black rounded hover:bg-gray-800 transition-colors"
          >
            <Send size={14} /> Send
          </button>
        </div>
      </div>

      <div style={{ width: `${canvasWidth}%` }} className="relative group">
        <canvas
          ref={canvasRef}
          style={{ height: `${canvasHeight}px`, width: '100%' }}
          className="border-2 border-gray-200 rounded bg-white touch-none cursor-crosshair"
          onPointerDown={startDraw}
          onPointerMove={draw}
          onPointerUp={endDraw}
          onPointerLeave={endDraw}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white border-2 border-black rounded-full p-1 cursor-ns-resize shadow-md"
          onPointerDown={handleResizeStart}
        >
          <GripHorizontal size={16} />
        </div>
      </div>
    </div >
  );
};

export default DrawingCanvas;