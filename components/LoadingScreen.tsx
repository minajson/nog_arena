import Logo from "./Logo";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <Logo className="h-20 w-auto animate-logo-spin sm:h-28" priority />
    </div>
  );
}
