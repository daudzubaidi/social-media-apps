import Image from "next/image";

const savedImages = [
  "/assets/figma-profile/gallery/1.png",
  "/assets/figma-profile/gallery/2.png",
  "/assets/figma-profile/gallery/3.png",
  "/assets/figma-profile/gallery/4.png",
  "/assets/figma-profile/gallery/5.png",
  "/assets/figma-profile/gallery/6.png",
  "/assets/figma-profile/gallery/7.png",
  "/assets/figma-profile/gallery/8.png",
  "/assets/figma-profile/gallery/9.png",
];

export default function MeSavedPage() {
  return (
    <section className="grid grid-cols-3 gap-[1.778px] md:gap-1">
      {savedImages.map((src, index) => (
        <div
          key={src}
          className="relative aspect-square overflow-hidden rounded-[2.667px] md:rounded-sm"
        >
          <Image
            src={src}
            alt={`Saved image ${index + 1}`}
            fill
            sizes="(max-width: 768px) 119px, 268px"
            className="object-cover"
            priority={index < 3}
          />
        </div>
      ))}
    </section>
  );
}
