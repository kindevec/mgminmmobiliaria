import React, { useState, useEffect, useRef, useImperativeHandle, HTMLAttributes } from 'react';

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Define the type for a single gallery item
export interface GalleryItem {
  id?: string;
  common: string;
  binomial: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
    by: string;
  };
  badge?: string;
  tag?: string;
  onSelect?: () => void;
  onVisit?: () => void;
  onWhatsApp?: () => void;
  raw?: any;
}

export interface CircularGalleryHandle {
  next: () => void;
  prev: () => void;
  rotateBy: (deg: number) => void;
}

// Define the props for the CircularGallery component
export interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
  /** Callback triggered when an item is clicked */
  onItemSelect?: (item: GalleryItem, index: number) => void;
  /** External rotation control or helper */
  rotationOffset?: number;
}

const CircularGallery = React.forwardRef<CircularGalleryHandle, CircularGalleryProps>(
  (
    {
      items,
      className,
      radius = 580,
      autoRotateSpeed = 0.03,
      onItemSelect,
      rotationOffset = 0,
      ...props
    },
    ref
  ) => {
    const [rotation, setRotation] = useState(rotationOffset);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isStepping, setIsStepping] = useState(false);
    const [responsiveRadius, setResponsiveRadius] = useState(radius);

    const steppingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const dragStartXRef = useRef<number>(0);
    const rotationAtDragStartRef = useRef<number>(0);
    const hasDraggedSignificantlyRef = useRef<boolean>(false);

    // Responsive radius calculation for clean 3D perspective on mobile and desktop
    useEffect(() => {
      const updateRadius = () => {
        if (typeof window === 'undefined') return;
        const w = window.innerWidth;
        if (w < 480) {
          setResponsiveRadius(Math.min(radius, 270));
        } else if (w < 768) {
          setResponsiveRadius(Math.min(radius, 370));
        } else if (w < 1024) {
          setResponsiveRadius(Math.min(radius, 470));
        } else if (w < 1440) {
          setResponsiveRadius(Math.min(radius, 560));
        } else {
          setResponsiveRadius(Math.min(radius, 600));
        }
      };

      updateRadius();
      window.addEventListener('resize', updateRadius);
      return () => window.removeEventListener('resize', updateRadius);
    }, [radius]);

    // Effect to handle scroll-based rotation
    useEffect(() => {
      const handleScroll = () => {
        if (isDragging) return;
        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = scrollProgress * 360;
        setRotation((prev) => (scrollRotation + prev * 0.1) % 360);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, [isDragging]);

    // Effect for auto-rotation when not scrolling or dragging
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling && !isDragging) {
          setRotation((prev) => (prev + autoRotateSpeed) % 360);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isScrolling, isDragging, autoRotateSpeed]);

    // Interactive Drag / Touch controls
    const handlePointerDown = (clientX: number) => {
      setIsDragging(true);
      dragStartXRef.current = clientX;
      rotationAtDragStartRef.current = rotation;
      hasDraggedSignificantlyRef.current = false;
    };

    const handlePointerMove = (clientX: number) => {
      if (!isDragging) return;
      const deltaX = clientX - dragStartXRef.current;
      if (Math.abs(deltaX) > 5) {
        hasDraggedSignificantlyRef.current = true;
      }
      const sensitivity = 0.25;
      setRotation(rotationAtDragStartRef.current - deltaX * sensitivity);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    const anglePerItem = items.length > 0 ? 360 / items.length : 40;

    useImperativeHandle(ref, () => ({
      next: () => {
        setIsStepping(true);
        setRotation((prev) => prev - anglePerItem);
        if (steppingTimeoutRef.current) clearTimeout(steppingTimeoutRef.current);
        steppingTimeoutRef.current = setTimeout(() => setIsStepping(false), 450);
      },
      prev: () => {
        setIsStepping(true);
        setRotation((prev) => prev + anglePerItem);
        if (steppingTimeoutRef.current) clearTimeout(steppingTimeoutRef.current);
        steppingTimeoutRef.current = setTimeout(() => setIsStepping(false), 450);
      },
      rotateBy: (deg: number) => {
        setIsStepping(true);
        setRotation((prev) => prev + deg);
        if (steppingTimeoutRef.current) clearTimeout(steppingTimeoutRef.current);
        steppingTimeoutRef.current = setTimeout(() => setIsStepping(false), 450);
      },
    }));

    if (!items || items.length === 0) {
      return null;
    }

    return (
      <div
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn(
          'relative w-full h-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-hidden touch-pan-y',
          className
        )}
        style={{ perspective: '2000px' }}
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={handlePointerUp}
        {...props}
      >
        <div
          className="relative w-full h-full will-change-transform"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
            transition: isStepping ? 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = ((rotation % 360) + 360) % 360;
            const relativeAngle = ((itemAngle + totalRotation) % 360 + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.2, 1 - (normalizedAngle / 160));
            const isFrontCard = normalizedAngle < 40;

            return (
              <div
                key={item.id || item.photo.url + i}
                role="group"
                aria-label={item.common}
                className="absolute w-[210px] min-[360px]:w-[230px] sm:w-[260px] lg:w-[285px] xl:w-[310px] h-[410px] min-[360px]:h-[440px] sm:h-[500px] lg:h-[550px] xl:h-[590px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${responsiveRadius}px) translate(-50%, -50%)`,
                  left: '50%',
                  top: '50%',
                  opacity: opacity,
                  transition: 'opacity 0.25s linear',
                  zIndex: isFrontCard ? 30 : 10,
                }}
              >
                <div
                  onClick={(e) => {
                    if (!hasDraggedSignificantlyRef.current) {
                      e.stopPropagation();
                      onItemSelect?.(item, i);
                      item.onSelect?.();
                    }
                  }}
                  className={cn(
                    'relative w-full h-full rounded-2xl shadow-2xl overflow-hidden group border border-slate-200/80 bg-slate-900 transition-all duration-300 flex flex-col',
                    isFrontCard
                      ? 'ring-2 ring-[#22A33D] shadow-[#22A33D]/25 scale-102 cursor-pointer'
                      : 'hover:border-white/50 cursor-pointer'
                  )}
                >
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 pointer-events-none"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                    loading="lazy"
                  />

                  {/* Card overlay with property details and title - elevated higher */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pb-7 sm:pb-9 bg-gradient-to-t from-black/95 via-black/75 to-transparent text-white pointer-events-none flex flex-col justify-end pt-24">
                    <h3 className="text-base sm:text-lg font-black leading-snug tracking-tight text-white group-hover:text-[#5be196] transition-colors line-clamp-1">
                      {item.common}
                    </h3>
                    <em className="text-xs sm:text-sm not-italic font-semibold text-slate-200 block mt-0.5 line-clamp-1">
                      {item.binomial}
                    </em>
                    {item.photo.by && (
                      <p className="text-[11px] sm:text-xs text-slate-300/80 mt-0.5 mb-3 line-clamp-1">
                        {item.photo.by}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1.5 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onVisit?.();
                        }}
                        className="flex-1 bg-white hover:bg-slate-100 text-slate-900 py-2.5 px-2 rounded-full text-xs font-bold transition-all hover:scale-102 active:scale-95 cursor-pointer shadow-md text-center whitespace-nowrap"
                      >
                        Visitar
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onWhatsApp?.();
                        }}
                        className="flex-1 bg-[#22A33D] hover:bg-[#1a8230] text-white py-2.5 px-2 rounded-full text-xs font-bold transition-all hover:scale-102 active:scale-95 cursor-pointer shadow-md text-center whitespace-nowrap"
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
