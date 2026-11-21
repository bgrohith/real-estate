import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize, RotateCcw, Compass, Sparkles, Layers, Info, Check } from 'lucide-react';
import { Property, VirtualTourScene } from '../types';

interface VirtualTour360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export const VirtualTour360Modal: React.FC<VirtualTour360ModalProps> = ({
  isOpen,
  onClose,
  property,
}) => {
  const scenes: VirtualTourScene[] =
    property.virtualTour && property.virtualTour.length > 0
      ? property.virtualTour
      : [
          {
            sceneName: 'Main Luxury Living Vista',
            panoramaUrl:
              property.images?.[0]?.url ||
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
            roomType: 'Living Room',
          },
          {
            sceneName: 'Master Bedroom Panoramic View',
            panoramaUrl:
              property.images?.[1]?.url ||
              'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
            roomType: 'Master Suite',
          },
        ];

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showHotspotInfo, setShowHotspotInfo] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentScene = scenes[activeSceneIndex] || scenes[0];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX - scrollOffset);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newOffset = e.clientX - startX;
    setScrollOffset(newOffset);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX - scrollOffset);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const newOffset = e.touches[0].clientX - startX;
    setScrollOffset(newOffset);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-300 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent z-20 text-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sapphire-600/90 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sapphire">
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              360° Immersive Tour
            </span>
            <span className="text-xs text-slate-300 font-medium hidden sm:inline">• Drag cursor or finger to rotate</span>
          </div>
          <h2 className="text-base sm:text-xl font-serif font-bold text-white truncate max-w-md sm:max-w-xl">
            {property.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScrollOffset(0)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Reset Angle"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset View</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 360 Panoramic Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className={`relative flex-1 overflow-hidden flex items-center justify-center cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        {/* Panoramic Background with infinite looping simulated translation */}
        <div
          className="absolute inset-0 flex transition-transform duration-75 ease-out will-change-transform"
          style={{
            transform: `translateX(${scrollOffset % 1200}px)`,
            width: '300%',
            left: '-100%',
          }}
        >
          <img
            src={currentScene.panoramaUrl}
            alt={currentScene.sceneName}
            className="w-1/3 h-full object-cover shrink-0 pointer-events-none brightness-95"
          />
          <img
            src={currentScene.panoramaUrl}
            alt={currentScene.sceneName}
            className="w-1/3 h-full object-cover shrink-0 pointer-events-none brightness-95"
          />
          <img
            src={currentScene.panoramaUrl}
            alt={currentScene.sceneName}
            className="w-1/3 h-full object-cover shrink-0 pointer-events-none brightness-95"
          />
        </div>

        {/* Ambient Dark Vignette & Depth Overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/60 pointer-events-none" />

        {/* Interactive Hotspot Markers on the Room */}
        <div className="absolute top-1/3 left-1/3 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowHotspotInfo(
                showHotspotInfo === 'marble'
                  ? null
                  : 'Imported Statuario Italian Marble flooring with customized under-floor acoustic damping.'
              );
            }}
            className="group relative flex items-center justify-center"
          >
            <span className="w-8 h-8 rounded-full bg-sapphire-500/80 animate-ping absolute" />
            <span className="w-7 h-7 rounded-full bg-white text-sapphire-900 shadow-xl flex items-center justify-center font-bold text-xs border-2 border-sapphire-600 hover:scale-110 transition-transform">
              <Info className="w-3.5 h-3.5 text-sapphire-700" />
            </span>
          </button>
          {showHotspotInfo === 'marble' && (
            <div className="absolute top-9 left-1/2 -translate-x-1/2 w-64 bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl border border-sapphire-500/40 text-xs shadow-2xl animate-in zoom-in-95">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Spec Highlight</span>
              <p className="mt-1 text-slate-200">Imported Statuario Italian Marble flooring with under-floor acoustic insulation.</p>
            </div>
          )}
        </div>

        <div className="absolute top-1/2 right-1/4 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowHotspotInfo(
                showHotspotInfo === 'ceiling'
                  ? null
                  : '11.5 feet clear double-height floor-to-ceiling soundproof Saint-Gobain glass.'
              );
            }}
            className="group relative flex items-center justify-center"
          >
            <span className="w-8 h-8 rounded-full bg-amber-500/80 animate-ping absolute" />
            <span className="w-7 h-7 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-xs border-2 border-amber-500 hover:scale-110 transition-transform">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            </span>
          </button>
          {showHotspotInfo === 'ceiling' && (
            <div className="absolute top-9 left-1/2 -translate-x-1/2 w-64 bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl border border-amber-500/40 text-xs shadow-2xl animate-in zoom-in-95">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Clear Height</span>
              <p className="mt-1 text-slate-200">11.5 feet clear double-height floor-to-ceiling soundproof Saint-Gobain glazing.</p>
            </div>
          )}
        </div>

        {/* Center Compass Reticle */}
        <div className="pointer-events-none absolute bottom-24 flex items-center gap-2 bg-slate-950/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-slate-300 text-xs">
          <Compass className="w-4 h-4 text-sapphire-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span>Active View: <strong>{currentScene.sceneName}</strong></span>
        </div>
      </div>

      {/* Bottom Room Switcher Bar */}
      <div className="p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {scenes.map((scene, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveSceneIndex(idx);
                  setScrollOffset(0);
                  setShowHotspotInfo(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 ${
                  activeSceneIndex === idx
                    ? 'bg-sapphire-600 text-white shadow-sapphire scale-105'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{scene.sceneName}</span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 shrink-0">
            <span>Powered by BuyYourProperty 3D Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VirtualTour360Modal;
