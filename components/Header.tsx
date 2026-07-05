import Logo from "./Logo";
import SoundToggle from "./SoundToggle";
import AmbientHum from "./AmbientHum";

/* Fixed h-16 so full-height game screens can rely on calc(100svh - 4rem). */
export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/90 px-4 backdrop-blur-sm sm:px-6">
      <Logo className="h-12 w-auto sm:h-13" priority />
      <div className="flex items-center gap-3">
        <AmbientHum />
        <SoundToggle />
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-nog-gold-500/60 to-transparent"
      />
    </header>
  );
}
