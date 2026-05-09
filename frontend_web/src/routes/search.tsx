// src/routes/search.tsx
// REPLACED: Mock data removed. Uses real fineApi.searchDriver().

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, FileText, AlertCircle, CheckCircle2, Shield, Award, AlertTriangle, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatLKR } from "@/hooks/useCountUp";
import { fineApi } from "@/lib/api";

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
  const [error, setError] = useState("");
  const [driverData, setDriverData] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setDriverData(null);

    try {
      const result = await fineApi.searchDriver(type, query.trim());
      setDriverData(result);
    } catch (err: any) {
      setError(err.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const meritColor = (score: number) =>
    score >= 75 ? "#4A7C59" : score >= 40 ? "#B5860D" : "#8B1A1A";

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
          <p className="text-center text-cream/70 text-sm mt-2 font-serif">
            Search by National Identity Card (NIC) or Vehicle Registration
          </p>
          <div className="ornate-divider"><span>❖</span></div>

          <form onSubmit={handleSearch} className="space-y-6 max-w-xl mx-auto">
            {/* Search type selector */}
            <div className="flex gap-2 bg-[var(--navy-deep)]/50 p-1 border border-[var(--gold-primary)]/20 rounded">
              {(["NIC", "VEHICLE"] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 text-xs uppercase tracking-widest transition-colors ${
                    type === t
                      ? "bg-[var(--gold-primary)] text-[var(--navy-deep)] font-bold"
                      : "text-[var(--gold-primary)] hover:bg-[var(--gold-primary)]/10"
                  }`}
                >
                  {t === "NIC" ? "By NIC" : "By Vehicle No."}
                </button>
              ))}
            </div>

            <div>
              <label className="block font-display tracking-widest text-xs uppercase text-[var(--gold-primary)] mb-1">
                {type === "NIC" ? "NIC Number" : "Vehicle Registration"}
              </label>
              <input
                className="typewriter-input w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={type === "NIC" ? "e.g. 199012345678" : "e.g. CAB-1234"}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-[var(--crimson)] text-sm font-serif">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-btn py-3 font-display tracking-widest uppercase text-sm flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              {loading ? "Searching..." : "Search Records"}
            </button>
          </form>
        </div>

        {/* Results */}
        {driverData && (
          <div className="mt-8 space-y-6 fade-up">
            {driverData.totalFines === 0 ? (
              <div className="ornate-card p-8 text-center">
                <CheckCircle2 size={40} className="mx-auto text-green-500 mb-3" />
                <h3 className="font-display gold-gradient-text text-xl">Clean Record</h3>
                <p className="text-cream/70 font-serif mt-2">No traffic fines found for this {type}.</p>
              </div>
            ) : (
              <>
                {/* Merit Score */}
                <div className="ornate-card p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { value: driverData.meritScore },
                            { value: 100 - driverData.meritScore },
                          ]}
                          dataKey="value" cx="50%" cy="50%"
                          innerRadius={40} outerRadius={55} startAngle={90} endAngle={-270}
                        >
                          <Cell fill={meritColor(driverData.meritScore)} />
                          <Cell fill="rgba(255,255,255,0.05)" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-display" style={{ color: meritColor(driverData.meritScore) }}>
                        {driverData.meritScore}
                      </span>
                      <span className="text-xs text-cream/60">/ 100</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display gold-gradient-text text-xl mb-1">Merit Score</h3>
                    <div className={`inline-block px-3 py-1 text-xs font-display uppercase tracking-widest rounded mb-2 ${
                      driverData.licenseStatus === "ACTIVE" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                    }`}>
                      License: {driverData.licenseStatus}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center mt-2">
                      <div>
                        <div className="text-lg font-display text-[var(--gold-primary)]">{driverData.totalFines}</div>
                        <div className="text-xs text-cream/60">Total Fines</div>
                      </div>
                      <div>
                        <div className="text-lg font-display text-green-400">{driverData.paidFines}</div>
                        <div className="text-xs text-cream/60">Paid</div>
                      </div>
                      <div>
                        <div className="text-lg font-display text-red-400">{driverData.unpaidFines}</div>
                        <div className="text-xs text-cream/60">Unpaid</div>
                      </div>
                    </div>
                    {driverData.totalAmountDue > 0 && (
                      <p className="text-[var(--crimson)] font-serif text-sm mt-2">
                        Total amount due: <strong>LKR {formatLKR(driverData.totalAmountDue)}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Fine Records */}
                <div className="ornate-card p-6">
                  <h3 className="font-display gold-gradient-text text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText size={16} /> Fine History
                  </h3>
                  <div className="space-y-3">
                    {driverData.records.map((record: any) => (
                      <div key={record.id} className="border border-[var(--gold-primary)]/20 rounded p-4 flex justify-between items-center">
                        <div>
                          <div className="font-mono text-xs text-[var(--gold-primary)]">{record.referenceNumber}</div>
                          <div className="font-display text-sm text-cream/90 mt-1">{record.categoryName}</div>
                          <div className="text-xs text-cream/50 mt-1">
                            {record.issuedAt ? new Date(record.issuedAt).toLocaleDateString() : "—"}
                            {record.district && ` · ${record.district}`}
                            {record.pointsDeducted ? ` · -${record.pointsDeducted} pts` : ""}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-[var(--gold-primary)]">LKR {record.amount?.toLocaleString()}</div>
                          <span className={`mt-1 inline-block px-2 py-0.5 text-xs rounded font-display uppercase ${
                            record.status === "PAID" ? "bg-green-900/50 text-green-400" :
                            record.status === "OVERDUE" ? "bg-red-900/50 text-red-400" :
                            "bg-yellow-900/50 text-yellow-400"
                          }`}>{record.status}</span>
                          {record.status !== "PAID" && (
                            <div>
                              <Link
                                to="/pay"
                                className="block mt-1 text-xs text-[var(--gold-primary)] underline font-display"
                              >
                                Pay Now →
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}