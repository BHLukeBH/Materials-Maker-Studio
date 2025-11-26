import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Check, X } from 'lucide-react';

interface ImageCropperModalProps {
    imageSrc: string;
    onCancel: () => void;
    onComplete: (dataUrl: string) => void;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ imageSrc, onCancel, onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const CANVAS_WIDTH = 600;
    const CANVAS_HEIGHT = 450; // 4:3 of 600

    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            setImage(img);
            // Calculate initial fit
            const scaleX = CANVAS_WIDTH / img.width;
            const scaleY = CANVAS_HEIGHT / img.height;
            const initialScale = Math.max(scaleX, scaleY);
            setScale(initialScale);
            // Center
            setOffset({
                x: (CANVAS_WIDTH - img.width * initialScale) / 2,
                y: (CANVAS_HEIGHT - img.height * initialScale) / 2
            });
        };
    }, [imageSrc]);

    useEffect(() => {
        if (!image || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(scale, scale);
        ctx.drawImage(image, 0, 0);
        ctx.restore();

    }, [image, scale, offset]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleSave = () => {
        if (!canvasRef.current) return;
        const dataUrl = canvasRef.current.toDataURL('image/png');
        onComplete(dataUrl);
    };

    return (
        <div className="no-print fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl overflow-hidden max-w-2xl w-full flex flex-col shadow-2xl">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Crop Image (4:3)</h3>
                    <button onClick={onCancel} className="text-slate-500 hover:text-red-500"><X /></button>
                </div>
                
                <div className="p-4 bg-slate-900 flex justify-center overflow-hidden relative cursor-move">
                    <canvas 
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className="border-2 border-dashed border-slate-600 shadow-lg"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
                        Drag to Pan
                    </div>
                </div>

                <div className="p-6 bg-white space-y-4">
                    <div className="flex items-center gap-4">
                        <ZoomOut size={20} className="text-slate-400" />
                        <input 
                            type="range" 
                            min="0.1" 
                            max="3" 
                            step="0.1" 
                            value={scale} 
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <ZoomIn size={20} className="text-slate-400" />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={onCancel} className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-bh-green text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                            <Check size={18} /> Set Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;
