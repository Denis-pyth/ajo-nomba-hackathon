import Image from "next/image";

export function MacStudioMockup() {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <Image
        src="/mac-studio.png"
        alt="Ajo Dashboard Preview"
        width={1500}
        height={1125}
        className="w-full h-auto"
        priority
      />
    </div>
  );
}
