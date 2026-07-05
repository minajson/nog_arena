"use client";

import { useRouter } from "next/navigation";
import VideoIntro from "@/components/VideoIntro";

export default function OpeningPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-nog-black">
      <VideoIntro
        src="/videos/opening-video.mp4"
        label="Opening Video"
        onEnd={() => router.push("/menu")}
      />
    </main>
  );
}
