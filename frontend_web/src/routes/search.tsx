import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, FileText, AlertCircle, CheckCircle2, Shield, Award, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatLKR } from "@/hooks/useCountUp";

export const Route = createFileRoute("/search")({
  component: SearchPortal,
  head: () => ({
    meta: [
      { title: "Record Lookup — Sri Lanka Police" },
      { name: "description", content: "Search for traffic fines using your NIC or Vehicle Registration Number." },
    ],
  }),
});

function SearchPortal() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"NIC" | "VEHICLE">("NIC");
  const [loading, setLoading] = useState(false);
  const [driverData, setDriverData] = useState<any | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);

    // Simulate API call to fetch driver history & merit score
    setTimeout(() => {
      // Mocking a driver who has lost some points
      setDriverData({
        nic: query,
        name: "D. L. Nawarathne",
        licenseStatus: "ACTIVE",
        meritScore: 75, // Out of 100
        records: [
          {
            id: `TF-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            date: new Date().toLocaleDateString(),
            violation: "Speeding (>20% over limit)",
            amount: 3500,
            pointsDeducted: 15,
            status: "PENDING"
          },
          {
            id: `TF-2025-${Math.floor(10000 + Math.random() * 90000)}`,
            date: "12/11/2025",
            violation: "Signal Violation",
            amount: 2500,
            pointsDeducted: 10,
            status: "PAID"
          },
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-noise">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--navy-deep)]/85 border-b-2 border-[var(--gold-primary)]/50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 text-[var(--gold-primary)]">
            <Shield size={32} />
            <div>
              <div className="font-display text-lg leading-tight">Record Lookup Portal</div>
              <div className="text-xs uppercase tracking-widest text-cream/70">Sri Lanka Police</div>
            </div>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12 pb-20">
        <div className="ornate-card p-8 md:p-12 fade-up">
          <h2 className="text-3xl font-display gold-gradient-text text-center">Driver & Vehicle Records</h2>
          <p className="text-center text-cream/70 text-sm mt-2 font-serif">Search by National Identity Card (NIC) or Vehicle Registration Number</p>
          <div className="ornate-divider"><span>❖</span></div>

          <form onSubmit={handleSearch} className="space-y-6 max-w-xl mx-auto">
            <div className="flex justify-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => { setType("NIC"); setQuery(""); setDriverData(null); }}
                className={`px-6 py-2 border transition-colors ${type === "NIC" ? "border-[var(--gold-primary)] bg-[var(--gold-primary)]/20 text-[var(--gold-primary)]" : "border-cream/20 text-cream/50 hover:border-cream/50"}`}
              >
                NIC Number
              </button>
              <button
                type="button"
                onClick={() => { setType("VEHICLE"); setQuery(""); setDriverData(null); }}
                className={`px-6 py-2 border transition-colors ${type === "VEHICLE" ? "border-[var(--gold-primary)] bg-[var(--gold-primary)]/20 text-[var(--gold-primary)]" : "border-cream/20 text-cream/50 hover:border-cream/50"}`}
              >
                Vehicle No.
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold-primary)]" size={20} />
              <input
                className="typewriter-input pl-12 text-lg uppercase"
                placeholder={type === "NIC" ? "e.g., 981234567V" : "e.g., WP CBA-1234"}
                value={query}
                onChange={(e) => setQuery(e.target.value.toUpperCase())}
                required
              />
            </div>

            <button disabled={loading} className="metallic-btn w-full flex justify-center items-center">
              {loading ? "Accessing National Database..." : "Lookup Records"}
            </button>
          </form>

          {driverData && (
            <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">

              {/* --- NEW: MERIT SCORECARD SECTION --- */}
              {type === "NIC" && (
                <div className="mb-8 grid md:grid-cols-2 gap-6 items-center bg-[var(--navy-mid)]/40 border border-[var(--gold-primary)]/30 p-6 rounded-md">
                  <div>
                    <h3 className="font-display text-2xl text-[var(--gold-light)] mb-1">{driverData.name}</h3>
                    <div className="text-cream/70 font-mono mb-4">NIC: {driverData.nic}</div>

                    <div className="flex gap-4">
                      <div className="bg-[var(--navy-deep)] px-4 py-2 border border-cream/10">
                        <div className="text-[10px] uppercase tracking-widest text-cream/50">License Status</div>
                        <div className="text-emerald-400 font-bold tracking-wider flex items-center gap-2">
                          <CheckCircle2 size={14}/> {driverData.licenseStatus}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Merit Gauge Chart */}
                  <div className="flex flex-col items-center justify-center relative h-[160px]">
                    <ScoreGauge score={driverData.meritScore} />
                    <div className="absolute top-[80px] text-center">
                      <div className="font-display text-4xl" style={{ color: getScoreColor(driverData.meritScore) }}>
                        {driverData.meritScore}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-cream/50">Merit Points</div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- FINE HISTORY SECTION --- */}
              <h3 className="font-display text-xl text-[var(--gold-light)] mb-4 flex items-center gap-2">
                <FileText size={20} />
                Violation History
              </h3>

              <div className="space-y-4">
                {driverData.records.map((r: any, i: number) => (
                  <div key={i} className="border border-[var(--gold-primary)]/30 bg-[var(--navy-mid)]/50 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-[var(--navy-mid)] transition-colors">
                    <div>
                      <div className="font-mono text-[var(--gold-primary)] text-lg mb-1">{r.id}</div>
                      <div className="text-cream/80 text-sm font-serif">{r.date} • {r.violation}</div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="font-display text-xl text-[var(--gold-light)]">{formatLKR(r.amount)}</div>
                        <div className="text-[var(--crimson)] text-xs font-bold bg-[var(--crimson)]/10 px-2 py-1 rounded flex items-center gap-1">
                          <AlertTriangle size={12}/> -{r.pointsDeducted} pts
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto text-right">
                      {r.status === "PENDING" ? (
                        <Link to={`/pay?ref=${r.id}`} className="metallic-btn crimson-btn text-xs px-6 py-3 w-full sm:w-auto inline-flex items-center justify-center gap-2">
                          <AlertCircle size={14}/> Pay Now
                        </Link>
                      ) : (
                        <span className="text-[var(--gold-light)] flex items-center justify-center sm:justify-end gap-2 text-sm border border-[var(--gold-light)]/30 px-4 py-2 rounded-sm bg-[var(--gold-primary)]/10">
                          <CheckCircle2 size={16}/> Settled
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-center text-cream/40 text-xs font-serif mt-6">
                Note: Reaching 0 Merit Points will result in automatic license suspension.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// =========================================================================
// Helper Component: Speedometer / Gauge Chart
// =========================================================================
function ScoreGauge({ score }: { score: number }) {
  const color = getScoreColor(score);

  const data = [
    { name: "Score", value: score, color: color },
    { name: "Lost", value: 100 - score, color: "rgba(255, 255, 255, 0.05)" } // Faded background track
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="100%"
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={0}
          dataKey="value"
          stroke="none"
          cornerRadius={4}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

// Determine color based on score health
function getScoreColor(score: number) {
  if (score >= 80) return "#10b981"; // Green/Safe
  if (score >= 50) return "#f59e0b"; // Yellow/Warning
  return "#ef4444"; // Red/Danger
}