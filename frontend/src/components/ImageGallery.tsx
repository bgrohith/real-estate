import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Sparkles, Video } from 'lucide-react';
import { PropertyImage, VirtualTourScene } from '../types';
import VirtualTour360Modal from './VirtualTour360Modal';

interface ImageGalleryProps {
  images: PropertyImage[];
  title: string;
  virtualTour?: VirtualTourScene[];
  property?: any;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  title,
  virtualTour,
  property,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);

  const displayImages =
    images && images.length > 0
      ? images
      : [
          {
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          },
        ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <>
      <div className="space-y-3">
        {/* Main Image with Zoom & 360 Tour Badges */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 group">
          <img
            src={displayImages[activeIndex].url}
            alt={`${title} - view ${activeIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer transition-all duration-500 group-hover:scale-105"
            onClick={() => setIsLightboxOpen(true)}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

          {/* Top Floating 360 Tour Button if available */}
          {virtualTour && virtualTour.length > 0 && (
            <button
              onClick={() => setIs360ModalOpen(true)}
              className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-slate-950/80 hover:bg-sapphire-600 border border-amber-400/40 text-amber-300 hover:text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-2 shadow-xl hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Launch 360° Virtual Experience</span>
            </button>
          )}

          {/* Lightbox Trigger Button */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-4 right-4 bg-slate-950/80 hover:bg-slate-900 text-white p-2.5 rounded-xl backdrop-blur-md transition-all flex items-center gap-2 text-xs font-medium border border-white/10"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Full Gallery ({displayImages.length})</span>
          </button>

          {/* Previous / Next Arrow Controls */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails Row (Up to 4 images) */}
        {displayImages.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {displayImages.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-[16/10] rounded-2xl overflow-hidden border-2 transition-all ${
                  activeIndex === idx
                    ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img.thumbnail || img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-white pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg">{title}</h3>
                <p className="text-xs text-slate-400">
                  Image {activeIndex + 1} of {displayImages.length}
                </p>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center max-h-[80vh] py-4">
              <img
                src={displayImages[activeIndex].url}
                alt={`${title} - full preview`}
                className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
              />

              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            <div className="flex justify-center gap-2 pt-4 overflow-x-auto">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-16 h-12 rounded-xl overflow-hidden border-2 shrink-0 ${
                    activeIndex === idx ? 'border-amber-400' : 'border-slate-800 opacity-50'
                  }`}
                >
                  <img src={img.thumbnail || img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 360 Virtual Tour Modal */}
      {property && (
        <VirtualTour360Modal
          isOpen={is360ModalOpen}
          onClose={() => setIs360ModalOpen(false)}
          property={property}
        />
      )}
    </>
  );
};
export default ImageGallery;
