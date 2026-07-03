import Logo from "./Logo";
import SoundToggle from "./SoundToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <Logo className="h-14 w-auto sm:h-16 md:h-20" priority />
        <span className="text-xl font-black tracking-tight text-nog-black sm:text-2xl md:text-3xl">
          NOG <span className="text-nog-green-700">Arena</span>
        </span>
      </div>
      <SoundToggle />
    </header>
  );
}
