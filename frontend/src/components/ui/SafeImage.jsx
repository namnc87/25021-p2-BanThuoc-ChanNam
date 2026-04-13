'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function SafeImage({ src, alt, className, fallbackSrc = '/images/no-image.png', width, height, fill, sizes, ...rest }) {
  const [error, setError] = useState(false);

  const imageSrc = error ? fallbackSrc : src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      width={width}
      height={height}
      fill={fill}
      sizes={sizes}
      {...rest}
    />
  );
}
