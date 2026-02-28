'use client';

import Image from 'next/image';

interface AppImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  onClick?: () => void;
  [key: string]: any;
}

function AppImage({
  src = '/assets/images/no_image.png',
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  onClick,
  ...props
}: AppImageProps) {

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes || '100vw'}
          className={className}
          style={{ objectFit: 'cover' }}
          priority={priority}
          onClick={onClick}
          unoptimized
          {...props}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      priority={priority}
      onClick={onClick}
      unoptimized
      {...props}
    />
  );
}

export default AppImage;