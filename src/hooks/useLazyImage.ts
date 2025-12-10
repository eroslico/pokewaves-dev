import { useState, useEffect, useRef } from 'react';

interface UseLazyImageOptions {
  src: string;
  placeholder?: string;
  threshold?: number;
}

export const useLazyImage = ({ src, placeholder, threshold = 0.1 }: UseLazyImageOptions) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = new Image();
            image.src = src;
            image.onload = () => {
              setImageSrc(src);
              setIsLoaded(true);
            };
            observer.unobserve(img);
          }
        });
      },
      { threshold }
    );

    observer.observe(img);

    return () => {
      if (img) {
        observer.unobserve(img);
      }
    };
  }, [src, threshold]);

  return { imgRef, imageSrc, isLoaded };
};
