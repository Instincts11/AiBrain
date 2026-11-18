import Image from "next/image";

export function SectionBg({
  src,
  overlay = "from-[#05070f]/75 via-[#05070f]/55 to-[#05070f]/90",
}: {
  src: string;
  overlay?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority={src.includes("hero-bg") || src.includes("bg-hero")}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />
    </div>
  );
}
