import Logo from "./Logo";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-white">
      <div className="relative flex items-center justify-center">
        <span className="absolute h-32 w-32 animate-ping rounded-full bg-nog-green-500/10" />
        <span className="absolute h-24 w-24 animate-pulse rounded-full bg-nog-gold-500/10" />
        <Logo className="relative h-20 w-auto animate-logo-spin sm:h-28" priority />
      </div>
      <p className="text-sm font-black uppercase tracking-[0.3em] text-nog-black/40">
        Loading&hellip;
      </p>
    </div>
  );
}
