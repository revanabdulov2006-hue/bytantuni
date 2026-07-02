import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <header className="relative flex min-h-120 flex-col items-center justify-center overflow-hidden px-4 py-20 text-center sm:min-h-140">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{ backgroundImage: "url(/hero.jpg)" }}
      >
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-black/40 to-bg" />

      <div className="animate-hero-in mb-6 flex items-center gap-3" style={{ animationDelay: "0.05s" }}>
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-accent-light/80" />
        <span className="bg-gradient-to-r from-accent-light via-[#ffcf8a] to-accent-light bg-clip-text font-(--font-display) text-2xl italic font-semibold tracking-[0.12em] text-transparent drop-shadow-sm sm:text-3xl">
          By Tantuni
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-accent-light/80" />
      </div>
      <h1
        className="animate-hero-in font-(--font-display) text-5xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-6xl"
        style={{ animationDelay: "0.18s" }}
      >
        Tantuni Bizim
        <br />
        İşimiz
      </h1>
      <p
        className="animate-hero-in mt-5 max-w-md text-sm text-white/80 drop-shadow-sm sm:text-base"
        style={{ animationDelay: "0.3s" }}
      >
       Pulsuz çatdırılma və ən dadlı yeməklərimizlə xidmətinizdəyik.
      </p>
      <a
        href="#menu"
        className="animate-hero-in mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_36px_-8px_rgba(242,121,10,.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-light hover:shadow-[0_18px_40px_-8px_rgba(242,121,10,.7)]"
        style={{ animationDelay: "0.42s" }}
      >
        Menyuya Bax
        <ChevronDown size={16} />
      </a>
    </header>
  );
}
