"use client";

interface PhotoDividerProps {
  imageUrl: string;
}

export default function PhotoDivider({ imageUrl }: PhotoDividerProps) {
  return (
    <div
      className="section-photo"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
