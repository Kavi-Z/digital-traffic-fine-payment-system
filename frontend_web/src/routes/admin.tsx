// src/routes/admin.tsx
// REPLACED: All mock data imports removed. Uses real adminApi calls.

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { adminApi, authApi, saveAuthData, logout as doLogout } from "@/lib/api";
import { useCountUp, formatLKR } from "@/hooks/useCountUp";
import SriLankaMap3D from "@/components/admin/SriLankaMap3D";
import PoliceBadge3D from "@/components/common/PoliceBadge3D";
import {
  Coins, Calendar, Receipt, MapPin, LogOut, Search,
  Shield, Loader2, Download, Printer, AlertTriangle,
  Activity, Lock, Eye, Users, RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Sri Lanka Police" },
      { name: "description", content: "Senior personnel monitoring portal for traffic fine collections." },
    ],
  }),
});

type Role = "ADMIN" | "SUPER_ADMIN";

interface DashboardData {
  totalFinesIssued: number;
  totalPaid: number;
  totalUnpaid: number;
  totalOverdue: number;
  totalCollected: number;
  totalPending: number;
  districtStats: { district: string; count: number; totalAmount: number }[];
  categoryStats: { categoryIdentifier: string; categoryName: string; count: number; totalAmount: number }[];
  monthlyTrend: { month: string; count: number; amount: number }[];
}

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<Role>("ADMIN");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    const userInfo = localStorage.getItem("user_info");
    if (storedToken && userInfo) {
      const parsed = JSON.parse(userInfo);
      if (parsed.role === "ADMIN" || parsed.role === "SUPER_ADMIN") {
        setAuthed(true);
        setRole(parsed.role as Role);
        setToken(storedToken);
      }
    }
  }, []);

  const handleLogout = () => {
    doLogout();
    setAuthed(false);
    setToken(null);
  };

  if (!authed) return <Login onLogin={(r, t) => { setRole(r); setToken(t); setAuthed(true); }} />;
  return <Dashboard role={role} onLogout={handleLogout} />;
}

// ─── Login ──────────────────────────────────────────────────
function Login({ onLogin }: { onLogin: (role: Role, token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const response = await authApi.login(username, password);
      if (response.role !== "ADMIN" && response.role !== "SUPER_ADMIN") {
        setErr("Access denied. Admin credentials required.");
        return;
      }
      saveAuthData(response);
      onLogin(response.role as Role, response.token);
    } catch (error: any) {
      setErr(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-noise flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-50"><PoliceBadge3D minimal /></div>
      <div className="ornate-card relative z-10 p-10 max-w-md w-full">
        <div className="text-center mb-2 text-[var(--gold-primary)] flex justify-center"><Shield size={48} /></div>
        <h1 className="text-2xl font-display gold-gradient-text text-center">Official Access</h1>
        <p className="text-center text-cream/70 text-sm font-serif">Restricted Government Portal</p>
        <div className="ornate-divider"><span>❖</span></div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-left w-full">
            <span className="block font-display tracking-widest text-xs uppercase text-[var(--gold-primary)] mb-1">Officer ID / Username</span>
            <input
              className="typewriter-input w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label className="block text-left w-full">
            <span className="block font-display tracking-widest text-xs uppercase text-[var(--gold-primary)] mb-1">Password</span>
            <input
              type="password"
              required
              className="typewriter-input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {err && <div className="text-[var(--crimson)] text-sm text-center font-serif">{err}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-btn py-3 font-display tracking-widest uppercase text-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            {loading ? "Authenticating..." : "Authenticate"}
          </button>

          <p className="text-center text-cream/40 text-xs mt-4 font-serif">
            Default: <code>admin / Admin@123</code> &nbsp;|&nbsp; <code>superadmin / SuperAdmin@123</code>
          </p>
        </form>
      </div>
    </div>
  );
}

// Colour palette for charts
const CATEGORY_COLORS: Record<string, string> = {
  SPD: "#C9A84C", SIG: "#8B1A1A", LIC: "#1A3A5C",
  PKG: "#8C6A3C", DRK: "#B5860D", MOB: "#4A7C59",
  SBT: "#6B4FA0", OVL: "#B05A2F", OTH: "#918b8b",
};

// ─── Dashboard ──────────────────────────────────────────────
function Dashboard({ role, onLogout }: { role: Role; onLogout: () => void }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentFines, setRecentFines] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dash, fines] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getAllFines(),
      ]);
      setData(dash);
      // Show the most recent 10
      setRecentFines(
        (fines as any[]).sort(
          (a: any, b: any) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
        ).slice(0, 10)
      );
    } catch (e: any) {
      setError(e.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const collectedCount = useCountUp(data?.totalCollected ?? 0);

  if (loading) return (
    <div className="min-h-screen bg-noise flex items-center justify-center">
      <Loader2 size={48} className="animate-spin text-[var(--gold-primary)]" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-noise flex flex-col items-center justify-center gap-4">
      <AlertTriangle size={48} className="text-[var(--crimson)]" />
      <p className="text-cream/70 font-serif">{error}</p>
      <button onClick={fetchData} className="gold-btn px-6 py-2 text-sm font-display tracking-widest uppercase flex items-center gap-2">
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );

  if (!data) return null;

  const districtChartData = data.districtStats.slice(0, 10).map(d => ({
    name: d.district, amount: d.totalAmount, count: d.count,
  }));

  const categoryPieData = data.categoryStats.map(c => ({
    name: c.categoryName,
    value: c.totalAmount,
    identifier: c.categoryIdentifier,
  }));

  return (
    <div className="min-h-screen bg-noise text-cream">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--navy-deep)]/85 border-b-2 border-[var(--gold-primary)]/50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
          <Shield size={32} className="text-[var(--gold-primary)]" />
          <div>
            <div className="font-display text-lg leading-tight gold-gradient-text">Admin Dashboard</div>
            <div className="text-xs uppercase tracking-widest text-cream/70">Sri Lanka Police — {role.replace("_", " ")}</div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={fetchData} title="Refresh" className="text-cream/60 hover:text-[var(--gold-primary)] transition-colors">
              <RefreshCw size={18} />
            </button>
            <Link to="/" className="text-cream/60 hover:text-[var(--gold-primary)] transition-colors text-xs font-display tracking-widest uppercase">Home</Link>
            <button onClick={onLogout} className="flex items-center gap-2 text-cream/60 hover:text-[var(--crimson)] transition-colors text-xs font-display tracking-widest uppercase">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Collected", value: `LKR ${formatLKR(data.totalCollected)}`, icon: Coins, color: "var(--gold-primary)" },
            { label: "Fines Issued", value: data.totalFinesIssued.toString(), icon: Receipt, color: "var(--gold-primary)" },
            { label: "Paid", value: data.totalPaid.toString(), icon: Activity, color: "#4A7C59" },
            { label: "Unpaid / Overdue", value: `${data.totalUnpaid + data.totalOverdue}`, icon: AlertTriangle, color: "var(--crimson)" },
          ].map((kpi) => (
            <div key={kpi.label} className="ornate-card p-5 flex flex-col gap-2">
              <kpi.icon size={20} style={{ color: kpi.color }} />
              <div className="text-2xl font-display" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="text-xs uppercase tracking-widest text-cream/60 font-display">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <div className="ornate-card p-6">
            <h3 className="font-display gold-gradient-text text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <Calendar size={16} /> Monthly Collection Trend
            </h3>
            {data.monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "#c9a84c", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#c9a84c", fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => `LKR ${formatLKR(v)}`} contentStyle={{ background: "#0a1628", border: "1px solid #c9a84c" }} />
                  <Line type="monotone" dataKey="amount" stroke="#c9a84c" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-cream/40 font-serif text-sm text-center py-10">No data yet. Issue some fines to see trends.</p>
            )}
          </div>

          {/* Category Pie */}
          <div className="ornate-card p-6">
            <h3 className="font-display gold-gradient-text text-sm uppercase tracking-widest mb-4">By Fine Category</h3>
            {categoryPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {categoryPieData.map((entry, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[entry.identifier] || "#888"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `LKR ${formatLKR(v)}`} contentStyle={{ background: "#0a1628", border: "1px solid #c9a84c" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-cream/40 font-serif text-sm text-center py-10">No category data yet.</p>
            )}
          </div>
        </div>

        {/* District Bar Chart */}
        {districtChartData.length > 0 && (
          <div className="ornate-card p-6">
            <h3 className="font-display gold-gradient-text text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapPin size={16} /> District-wise Collection (LKR)
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={districtChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(12, 11, 11, 0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#c9a84c", fontSize: 11 }} />
                <YAxis tick={{ fill: "#c9a84c", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `LKR ${formatLKR(v)}`} contentStyle={{ background: "#0a1628", border: "1px solid #c9a84c" }} />
                <Bar dataKey="amount" fill="#c9a84c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Transactions Table */}
        <div className="ornate-card p-6">
          <h3 className="font-display gold-gradient-text text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <Receipt size={16} /> Recent Transactions
          </h3>
          {recentFines.length === 0 ? (
            <p className="text-cream/40 font-serif text-sm text-center py-8">
              No fines issued yet. Officer logins can issue fines via the Officer portal.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--gold-primary)]/20">
                    {["Reference", "Officer", "District", "Category", "Amount", "Status", "Date"].map(h => (
                      <th key={h} className="text-left py-2 pr-4 text-xs uppercase tracking-widest text-[var(--gold-primary)] font-display">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentFines.map((f: any) => (
                    <tr key={f.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-2 pr-4 font-mono text-xs text-[var(--gold-primary)]">{f.referenceNumber}</td>
                      <td className="py-2 pr-4 text-cream/80">{f.issuedByOfficerName || "—"}</td>
                      <td className="py-2 pr-4 text-cream/80">{f.district || "—"}</td>
                      <td className="py-2 pr-4 text-cream/80">{f.categoryName}</td>
                      <td className="py-2 pr-4 text-cream/80">LKR {f.amount?.toLocaleString()}</td>
                      <td className="py-2 pr-4">
                        <span className={`px-2 py-0.5 text-xs rounded font-display uppercase tracking-widest ${
                          f.status === "PAID" ? "bg-green-900/50 text-green-400" :
                          f.status === "OVERDUE" ? "bg-red-900/50 text-red-400" :
                          "bg-yellow-900/50 text-yellow-400"
                        }`}>{f.status}</span>
                      </td>
                      <td className="py-2 pr-4 text-cream/60 text-xs">
                        {f.issuedAt ? new Date(f.issuedAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}