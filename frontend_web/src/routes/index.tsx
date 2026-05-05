import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, Shield, Search, Scale } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Sri Lanka Police — Traffic Fine Management System" },
      { property: "og:title", content: "Sri Lanka Police — Traffic Fine Management" },
      { property: "og:description", content: "Pay traffic fines online or access the official monitoring portal." },
    ],
  }),
});

function Landing() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-hidden bg-noise">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--navy-deep)]/40 to-[var(--navy-deep)] z-10 pointer-events-none" />

      {/* --- LANGUAGE TOGGLE HEADER --- */}
      <header className="absolute top-0 w-full z-30 p-6 flex justify-end">
        <div className="flex gap-2 text-xs font-display tracking-widest text-[var(--gold-primary)] bg-[var(--navy-deep)]/50 p-2 border border-[var(--gold-primary)]/30 backdrop-blur-md rounded-sm">
          <button onClick={() => setLanguage('en')} className={`px-3 py-1 transition-colors ${language === 'en' ? 'bg-[var(--gold-primary)] text-[var(--navy-deep)] font-bold' : 'hover:bg-[var(--gold-primary)]/20'}`}>EN</button>
          <button onClick={() => setLanguage('si')} className={`px-3 py-1 transition-colors ${language === 'si' ? 'bg-[var(--gold-primary)] text-[var(--navy-deep)] font-bold' : 'hover:bg-[var(--gold-primary)]/20'}`}>සිං</button>
          <button onClick={() => setLanguage('ta')} className={`px-3 py-1 transition-colors ${language === 'ta' ? 'bg-[var(--gold-primary)] text-[var(--navy-deep)] font-bold' : 'hover:bg-[var(--gold-primary)]/20'}`}>தமி</button>
        </div>
      </header>

      <main className="relative z-20 flex flex-col items-center min-h-screen px-6 pt-24 pb-12">

        <div className="text-center fade-up pointer-events-none">
          <div className="text-[var(--gold-primary)] font-display text-2xl md:text-4xl tracking-wider">
            {language === 'en' ? "ශ්‍රී ලංකා පොලිස් දෙපාර්තමේන්තුව" : t("police.dept")}
          </div>
          <h1 className="mt-3 font-display text-5xl md:text-7xl gold-gradient-text font-black">
            {t("police.dept")}
          </h1>
          <div className="ornate-divider max-w-md mx-auto pointer-events-auto">
            <span className="text-2xl">❖</span>
          </div>
          <p className="text-cream/90 text-lg md:text-xl tracking-widest uppercase">
            {t("system.title")}
          </p>
        </div>

        {/* Updated Grid: 2 columns on tablet, 4 columns on desktop */}
        <div className="mt-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl pt-16">

          <PortalCard
            to="/pay"
            icon={<Car size={40} />}
            title={t("card.pay.title")}
            desc={t("card.pay.desc")}
            cta={t("card.pay.cta")}
            variant="gold"
            delay="0s"
          />

          <PortalCard
            to="/search"
            icon={<Search size={40} />}
            title={t("card.search.title")}
            desc={t("card.search.desc")}
            cta={t("card.search.cta")}
            variant="gold"
            delay="0.1s"
          />

          {/* NEW: DISPUTE PORTAL CARD */}
          <PortalCard
            to="/dispute"
            icon={<Scale size={40} />}
            title={t("card.dispute.title") || "Dispute a Fine"}
            desc={t("card.dispute.desc") || "Submit a formal appeal and upload digital evidence."}
            cta={t("card.dispute.cta") || "Open Tribunal"}
            variant="gold"
            delay="0.2s"
          />

          <PortalCard
            to="/admin"
            icon={<Shield size={40} />}
            title={t("card.admin.title")}
            desc={t("card.admin.desc")}
            cta={t("card.admin.cta")}
            variant="crimson"
            delay="0.3s"
          />

        </div>

<footer className="mt-16 text-center text-cream/60 text-sm font-serif">
  <div className="ornate-divider max-w-xs mx-auto"><span>✦</span></div>
  {t("footer")}

  {/* NEW: Secret link for Police Officers */}
  <div className="mt-4">
    <Link to="/officer" className="text-[10px] uppercase tracking-widest text-[var(--gold-primary)]/50 hover:text-[var(--gold-primary)] transition-colors">
      Police Personnel: Open Field App
    </Link>
  </div>
</footer>
      </main>
    </div>
  );
}

function PortalCard({ to, icon, title, desc, cta, variant, delay }: { to: string; icon: React.ReactNode; title: string; desc: string; cta: string; variant: "gold" | "crimson", delay: string }) {
  return (
    <Link to={to} className="block group h-full">
      <div className="ornate-card p-6 lg:p-8 text-center fade-up h-full flex flex-col" style={{ animationDelay: delay }}>

        <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full mx-auto mb-4 text-[var(--gold-primary)] border-2 border-[var(--gold-primary)]/40 glow-pulse group-hover:scale-110 transition-transform">
          {icon}
        </div>

        <h3 className="text-2xl lg:text-3xl font-display gold-gradient-text mb-2">{title}</h3>
        <p className="text-cream/80 mb-6 font-serif flex-grow">{desc}</p>

        <button className={`metallic-btn w-full ${variant === "crimson" ? "crimson-btn" : ""}`}>
          {cta} →
        </button>
      </div>
    </Link>
  );
}