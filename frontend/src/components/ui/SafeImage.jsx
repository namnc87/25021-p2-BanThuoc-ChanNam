'use client';

import { useState } from 'react';

export default function SafeImage({ src, alt, className, fallbackSrc = '/images/no-image.png' }) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
