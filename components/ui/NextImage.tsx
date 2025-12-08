import NextImage, { type ImageProps as NextImageProps } from "next/image";
import type { StaticImageData } from "next/image";

// Hostname to treat as already-optimized / served from origin.
const REMOTE_HOST = "strada-cms-bucket.s3.me-south-1.amazonaws.com";

function isRemoteS3(src: string | StaticImageData | undefined) {
  if (!src || typeof src !== "string") return false;
  try {
    const url = new URL(src);
    return url.hostname.includes(REMOTE_HOST);
  } catch (e) {
    return false;
  }
}

export default function Image(props: NextImageProps) {
  // If the image is served from your S3 bucket, skip Next.js optimization
  // to avoid Vercel Image Transform counts and rely on origin CDN/TTL.
  const shouldUnoptimized = isRemoteS3((props as any).src);
  return <NextImage {...props} unoptimized={shouldUnoptimized} />;
}
