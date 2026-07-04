import Logo from "./Logo";
import SoundToggle from "./SoundToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-transparent bg-white/90 px-4 py-3 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <Logo className="h-14 w-auto sm:h-16 md:h-20" priority />
        <span className="text-xl font-black tracking-tight text-nog-black sm:text-2xl md:text-3xl">
          NOG <span className="text-nog-green-700">Arena</span>
        </span>
        <span className="ml-1 hidden items-center gap-1.5 rounded-full bg-nog-green-600/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-nog-green-700 sm:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-nog-green-600" />
          Live
        </span>
      </div>
      <SoundToggle />
      <div
        aria-hidden
        className="absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-nog-gold-500/60 to-transparent"
      />
    </header>
  );
}
