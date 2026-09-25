import React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export default function Image({
  src,
  alt,
  fill,
  priority,
  sizes,
  quality,
  className = '',
  style,
  loading,
  decoding,
  ...rest
}: ImageProps) {
  const computedStyle: React.CSSProperties = fill
    ? {
        position: 'absolute',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit: 'cover',
        ...style,
      }
    : { ...style };

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? 'eager' : loading || 'lazy'}
      decoding={decoding || 'async'}
      className={className}
      style={computedStyle}
      {...rest}
    />
  );
}
