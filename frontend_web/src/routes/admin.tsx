import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, ReferenceArea
} from "recharts";
import { districts, categories, monthlyTrend, transactions } from "@/data/mockData";
import { useCountUp, formatLKR } from "@/hooks/useCountUp";
import SriLankaMap3D from "@/components/admin/SriLankaMap3D";
import PoliceBadge3D from "@/components/common/PoliceBadge3D";
import { Coins, Calendar, Receipt, MapPin, LogOut, Search, Shield, Loader2, Download, Printer, Wand2, AlertTriangle, Activity, Lock, Eye } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Sri Lanka Police" },
      { name: "description", content: "Senior personnel monitoring portal for traffic fine collections." },
    ],
  }),
});

// Mock Auth Types
type Role = "ADMIN" | "SUPER_ADMIN";

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<Role>("ADMIN");

  useEffect(() => {
    const token = localStorage.getItem("slp_admin");
    const storedRole = localStorage.getItem("slp_role") as Role;
    if (token) {
      setAuthed(true);
      if (storedRole) setRole(storedRole);
    }
  }, []);

  if (!authed) return <Login onLogin={(r) => { setRole(r); setAuthed(true); }} />;

  return <Dashboard role={role} onLogout={() => {
    localStorage.removeItem("slp_admin");
    localStorage.removeItem("slp_role");
    setAuthed(false);
  }} />;
}

function Login({ onLogin }: { onLogin: (role: Role) => void }) {
  const [u, setU] = useState("admin");
  const [p, setP] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("ADMIN");
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(false);

    // Simulate API Auth & JWT Decoding
    setTimeout(() => {
      if (p !== "") { // Accept any password for the demo
        localStorage.setItem("slp_admin", "1");
        localStorage.setItem("slp_role", selectedRole);
        onLogin(selectedRole);
      } else {
        setErr(true);
        setTimeout(() => setErr(false), 600);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen relative bg-noise flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-50"><PoliceBadge3D minimal /></div>
      <div className={`ornate-card relative z-10 p-10 max-w-md w-full ${err ? "shake" : ""}`}>
        <div className="text-center mb-2 text-[var(--gold-primary)] flex justify-center"><Shield size={48} /></div>
        <h1 className="text-2xl font-display gold-gradient-text text-center">Official Access</h1>
        <p className="text-center text-cream/70 text-sm font-serif">Restricted Government Portal</p>
        <div className="ornate-divider"><span>❖</span></div>

        <form onSubmit={submit} className="space-y-4">
          {/* DEMO FEATURE: Role Selector to easily show professors RBAC */}
          <div className="flex gap-2 mb-4 bg-[var(--navy-deep)]/50 p-1 border border-[var(--gold-primary)]/20 rounded">
            <button type="button" onClick={() => { setSelectedRole("ADMIN"); setU("regional_admin"); }} className={`flex-1 py-2 text-xs uppercase tracking-widest transition-colors ${selectedRole === "ADMIN" ? "bg-[var(--gold-primary)] text-[var(--navy-deep)] font-bold" : "text-[var(--gold-primary)] hover:bg-[var(--gold-primary)]/10"}`}>Admin</button>
            <button type="button" onClick={() => { setSelectedRole("SUPER_ADMIN"); setU("hq_superadmin"); }} className={`flex-1 py-2 text-xs uppercase tracking-widest transition-colors ${selectedRole === "SUPER_ADMIN" ? "bg-[var(--crimson)] text-cream font-bold" : "text-[var(--crimson)] hover:bg-[var(--crimson)]/10"}`}>Super Admin</button>
          </div>

          <label className="block text-left w-full">
            <span className="block font-display tracking-widest text-xs uppercase text-[var(--gold-primary)] mb-1">Officer ID</span>
            <input className="typewriter-input w-full" value={u} onChange={(e) => setU(e.target.value)} />
          </label>
          <label className="block text-left w-full">
            <span className="block font-display tracking-widest text-xs uppercase text-[var(--gold-primary)] mb-1">Password</span>
            <input type="password" required className="typewriter-input w-full" value={p} onChange={(e) => setP(e.target.value)} placeholder="Enter any password for demo" />
          </label>

          {err && <div className="text-[var(--crimson)] text-sm text-center font-serif">Authentication Failed</div>}

          <div className="text-center pt-2">
            <button disabled={loading} className={`metallic-btn w-full flex justify-center ${selectedRole === "SUPER_ADMIN" ? "crimson-btn" : ""}`}>
               {loading ? <Loader2 className="animate-spin" size={18} /> : "Authenticate Identity"}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <Link to="/" className="text-[var(--gold-primary)]/80 text-xs uppercase tracking-widest">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ role, onLogout }: { role: Role, onLogout: () => void }) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "AUDIT">("OVERVIEW");
  const [forecastMode, setForecastMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-noise flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[var(--gold-primary)] mb-4" size={48} />
        <div className="font-display text-xl text-[var(--gold-primary)] tracking-widest uppercase">Verifying Clearance...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noise animate-in fade-in duration-500">
      <TopBar role={role} onLogout={onLogout} />

      {/* RBAC Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 mt-6 no-print">
        <div className="flex gap-4 border-b border-[var(--gold-primary)]/20 pb-px">
          <button
            onClick={() => setActiveTab("OVERVIEW")}
            className={`px-4 py-2 font-display tracking-widest uppercase text-sm border-b-2 transition-colors ${activeTab === "OVERVIEW" ? "border-[var(--gold-primary)] text-[var(--gold-light)]" : "border-transparent text-cream/50 hover:text-cream/80"}`}
          >
            National Overview
          </button>

          {/* This tab only exists for Super Admins */}
          {role === "SUPER_ADMIN" && (
            <button
              onClick={() => setActiveTab("AUDIT")}
              className={`flex items-center gap-2 px-4 py-2 font-display tracking-widest uppercase text-sm border-b-2 transition-colors ${activeTab === "AUDIT" ? "border-[var(--crimson)] text-[var(--crimson)]" : "border-transparent text-cream/50 hover:text-[var(--crimson)]"}`}
            >
              <Lock size={14} /> Security & Audit Logs
            </button>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {activeTab === "OVERVIEW" ? (
          <>
            <KpiRow />
            <div className="grid lg:grid-cols-2 gap-6">
              <ChartCard title="District-wise Collection">
                <DistrictBars />
              </ChartCard>
              <ChartCard title="Fine Category Breakdown">
                <CategoryDonut />
              </ChartCard>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 ornate-card p-6 border-[var(--gold-primary)]/50 relative overflow-hidden flex flex-col">
                {forecastMode && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--gold-primary)] via-emerald-400 to-[var(--gold-primary)] animate-[pulse_2s_infinite]" />}

                <div className="flex justify-between items-center mb-6 border-b border-[var(--gold-primary)]/20 pb-4">
                  <div>
                    <h3 className="font-display text-2xl gold-gradient-text flex items-center gap-2">Monthly Collection & Forecast</h3>
                    <p className="text-xs text-cream/60 uppercase tracking-widest mt-1">{forecastMode ? "AI Projected Revenue (Q1 2027)" : "Historical Data (2026)"}</p>
                  </div>
                  <button onClick={() => setForecastMode(!forecastMode)} className={`flex items-center gap-2 px-4 py-2 border transition-all duration-300 ${forecastMode ? 'bg-[var(--navy-deep)] border-emerald-400/50 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]' : 'border-[var(--gold-primary)]/50 text-[var(--gold-primary)] hover:bg-[var(--gold-primary)]/10'}`}>
                    <Wand2 size={16} className={forecastMode ? "animate-pulse" : ""} />
                    <span className="text-xs font-display tracking-widest uppercase">{forecastMode ? "AI Active" : "Predict Revenue"}</span>
                  </button>
                </div>

                <div className="flex-1 min-h-[300px]"><TrendLine forecastMode={forecastMode} /></div>
              </div>
              <div className="lg:col-span-1 h-full"><LiveTicketFeed /></div>
            </div>

            <ChartCard title="District Collection Heatmap — 3D View">
              <SriLankaMap3D />
            </ChartCard>

            <ChartCard title="Recent Transactions">
              <TxTable />
            </ChartCard>
          </>
        ) : (
          <AuditLogView />
        )}

        <footer className="text-center text-cream/60 font-serif text-sm py-6 no-print">
          ❖ Sri Lanka Police Department • Traffic Management Division • 2026 ❖
        </footer>
      </main>
    </div>
  );
}

// =========================================================================
// NEW: System Audit Log Component (SUPER ADMIN ONLY)
// =========================================================================
function AuditLogView() {
  // Mock Audit Log Data representing what a backend interceptor would capture
  const logs = [
    { id: "AUD-9912", time: "10:42:15 AM", actor: "OP-4412 (W. Perera)", action: "CSV_EXPORT", target: "National_Fines_Q1", severity: "INFO" },
    { id: "AUD-9911", time: "10:15:02 AM", actor: "SYS-AUTO", action: "BATCH_SYNC", target: "Offline_App_Queue", severity: "INFO" },
    { id: "AUD-9910", time: "09:55:18 AM", actor: "OP-8821 (K. Silva)", action: "TICKET_VOID", target: "TF-2026-00441", severity: "HIGH" },
    { id: "AUD-9909", time: "09:12:44 AM", actor: "HQ-ADMIN", action: "LOGIN_SUCCESS", target: "Admin_Portal", severity: "INFO" },
    { id: "AUD-9908", time: "08:45:01 AM", actor: "UNKNOWN_IP", action: "LOGIN_FAILED", target: "Admin_Portal", severity: "CRITICAL" },
    { id: "AUD-9907", time: "08:30:22 AM", actor: "OP-1102 (D. Bandara)", action: "ISSUE_TICKET", target: "TF-2026-00850", severity: "INFO" },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-3xl font-display text-[var(--crimson)] flex items-center gap-3">
          <Shield size={32} /> Security & Audit Trail
        </h2>
        <p className="text-cream/70 font-serif mt-2">Immutable cryptographic log of all system actions. Classified Level 3 Access.</p>
      </div>

      <div className="ornate-card p-6 border-[var(--crimson)]/50">
        <div className="overflow-x-auto">
          <table className="gov-table w-full">
            <thead>
              <tr>
                <th className="!bg-[var(--crimson)]/20 !border-[var(--crimson)] !text-[var(--crimson)]">Event ID</th>
                <th className="!bg-[var(--crimson)]/20 !border-[var(--crimson)] !text-[var(--crimson)]">Timestamp</th>
                <th className="!bg-[var(--crimson)]/20 !border-[var(--crimson)] !text-[var(--crimson)]">Actor ID</th>
                <th className="!bg-[var(--crimson)]/20 !border-[var(--crimson)] !text-[var(--crimson)]">Action</th>
                <th className="!bg-[var(--crimson)]/20 !border-[var(--crimson)] !text-[var(--crimson)]">Target Object</th>
                <th className="!bg-[var(--crimson)]/20 !border-[var(--crimson)] !text-[var(--crimson)]">Severity</th>
                <th className="!bg-[var(--crimson)]/20 !border-[var(--crimson)] !text-[var(--crimson)]">Inspect</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--crimson)]/5">
                  <td className="font-mono text-cream/60 text-xs">{log.id}</td>
                  <td className="text-sm">{log.time}</td>
                  <td className="font-mono text-[var(--gold-primary)] text-sm">{log.actor}</td>
                  <td className="font-display tracking-wider text-xs">{log.action}</td>
                  <td className="text-cream/80 text-sm">{log.target}</td>
                  <td>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${
                      log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                      log.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' :
                      'bg-blue-500/20 text-blue-400 border-blue-500/50'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td>
                    <button className="text-cream/50 hover:text-[var(--gold-primary)] transition-colors p-1">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ... [Keep TopBar, KpiRow, Kpi, ChartCard, DistrictBars, CategoryDonut, TrendLine, TxTable, LiveTicketFeed exactly as they were] ...
function TopBar({ role, onLogout }: { role: Role, onLogout: () => void }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <header className="sticky top-0 z-30 bg-[var(--navy-deep)]/90 backdrop-blur-md border-b-2 border-[var(--gold-primary)]/50 shadow-xl no-print">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
        <Shield className="text-[var(--gold-primary)]" size={32} />
        <div>
          <div className="font-display text-lg leading-tight gold-gradient-text">Traffic Fine Administration</div>
          <div className="text-xs uppercase tracking-widest text-cream/70">National Overview</div>
        </div>
        <div className="ml-auto flex items-center gap-6">
          <div className="font-mono text-2xl text-[var(--gold-light)] tracking-wider">
            {now.toLocaleTimeString()}
          </div>
          <div className="text-right hidden sm:block">
            {/* Display the active Role dynamically */}
            <div className={`font-display text-sm tracking-widest uppercase ${role === "SUPER_ADMIN" ? "text-[var(--crimson)]" : "text-[var(--gold-primary)]"}`}>
              {role.replace("_", " ")}
            </div>
            <button onClick={onLogout} className="text-xs text-cream/70 uppercase tracking-widest hover:text-[var(--crimson)] transition-colors">
              <LogOut size={12} className="inline mr-1" />Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Ensure you paste KpiRow, Kpi, ChartCard, DistrictBars, CategoryDonut, TrendLine, TxTable, LiveTicketFeed functions below here from your previous code.

function KpiRow() {
  const total = useCountUp(48294500);
  const month = useCountUp(4182200);
  const tx = useCountUp(12847);
  const dist = useCountUp(25);
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Kpi icon={<Coins />} label="Total Collected" value={formatLKR(total)} />
      <Kpi icon={<Calendar />} label="This Month" value={formatLKR(month)} />
      <Kpi icon={<Receipt />} label="Total Transactions" value={tx.toLocaleString()} />
      <Kpi icon={<MapPin />} label="Active Districts" value={dist.toString()} />
    </div>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="ornate-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="font-display uppercase tracking-widest text-xs text-[var(--gold-primary)]">{label}</div>
        <div className="text-[var(--gold-light)]">{icon}</div>
      </div>
      <div className="font-display text-2xl gold-gradient-text">{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ornate-card p-6">
      <h3 className="font-display text-xl gold-gradient-text">{title}</h3>
      <div className="ornate-divider"><span>✦</span></div>
      {children}
    </div>
  );
}

function DistrictBars() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={districts}>
        <defs>
          <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8C96C" />
            <stop offset="100%" stopColor="#9A7A32" />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(201,168,76,0.15)" />
        <XAxis dataKey="name" stroke="#C9A84C" tick={{ fontSize: 11, fontFamily: "Crimson Text" }} />
        <YAxis stroke="#C9A84C" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1_000_000}M`} />
        <Tooltip contentStyle={{ background: "#0A1628", border: "2px solid #C9A84C", fontFamily: "Crimson Text" }} labelStyle={{ color: "#E8C96C", fontFamily: "Playfair Display" }} formatter={(v: any) => formatLKR(v)} />
        <Bar dataKey="amount" fill="url(#goldBar)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CategoryDonut() {
  const total = categories.reduce((s, c) => s + c.value, 0);
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie data={categories} dataKey="value" nameKey="name" innerRadius={70} outerRadius={120} paddingAngle={3}>
            {categories.map((c, i) => <Cell key={i} fill={c.color} stroke="#0A1628" strokeWidth={2} />)}
          </Pie>
          <Tooltip contentStyle={{ background: "#0A1628", border: "2px solid #C9A84C" }} formatter={(v: any) => formatLKR(v)} />
          <Legend wrapperStyle={{ fontFamily: "Crimson Text", color: "#F5F0E8" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-8">
        <div className="text-xs uppercase tracking-widest text-cream/60">Total</div>
        <div className="font-display text-lg gold-gradient-text">{formatLKR(total)}</div>
      </div>
    </div>
  );
}

function TrendLine({ forecastMode = false }: { forecastMode?: boolean }) {
  const extendedData = useMemo(() => {
    const historical = monthlyTrend.map(d => ({ ...d, historical: d.amount, forecast: null }));
    const lastValue = historical[historical.length - 1].amount;
    historical[historical.length - 1].forecast = lastValue;

    if (!forecastMode) return historical;

    const projected = [
      { month: "Jan '27", historical: null, forecast: 5100000 },
      { month: "Feb '27", historical: null, forecast: 5400000 },
      { month: "Mar '27", historical: null, forecast: 5800000 },
    ];

    return [...historical, ...projected];
  }, [forecastMode]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={extendedData}>
        <CartesianGrid stroke="rgba(201,168,76,0.12)" />
        <XAxis dataKey="month" stroke="#C9A84C" tick={{fontSize: 12}} />
        <YAxis stroke="#C9A84C" tick={{fontSize: 12}} tickFormatter={(v) => `${v / 1_000_000}M`} />

        {forecastMode && <ReferenceArea x1="Dec" x2="Mar '27" fill="rgba(52, 211, 153, 0.05)" />}

        <Tooltip
          contentStyle={{ background: "#0A1628", border: "2px solid #C9A84C", fontFamily: "Crimson Text" }}
          formatter={(v: any, name: string) => [formatLKR(v), name === "historical" ? "Actual" : "AI Forecast"]}
        />

        <Line
          type="monotone" dataKey="historical" stroke="#E8C96C" strokeWidth={3}
          dot={{ fill: "#C9A84C", r: 5 }} activeDot={{ r: 8 }}
          style={{ filter: "drop-shadow(0 0 6px rgba(201,168,76,0.8))" }}
          connectNulls
        />

        {forecastMode && (
          <Line
            type="monotone" dataKey="forecast" stroke="#34d399" strokeWidth={3} strokeDasharray="6 6"
            dot={{ fill: "#0A1628", stroke: "#34d399", strokeWidth: 2, r: 5 }} activeDot={{ r: 8 }}
            style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.6))" }}
            connectNulls
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

function TxTable() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => transactions.filter((t) =>
    (!filter || t.district === filter) &&
    (!q || `${t.id} ${t.officer} ${t.category}`.toLowerCase().includes(q.toLowerCase()))
  ), [q, filter]);

  const exportToCSV = () => {
    let csvContent = "Reference No,Officer,District,Category,Amount(LKR),Date,Status\n";
    filtered.forEach(row => {
      csvContent += `"${row.id}","${row.officer}","${row.district}","${row.category}",${row.amount},"${row.date}","${row.status}"\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Traffic_Fines_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center no-print">
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--navy-deep)]/60" />
            <input className="typewriter-input pl-9" placeholder="Search reference, officer..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="typewriter-input md:max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Districts</option>
            {districts.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={exportToCSV} className="metallic-btn !py-2 !px-4 text-xs flex-1 md:flex-none flex justify-center items-center gap-2">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={() => window.print()} className="metallic-btn crimson-btn !py-2 !px-4 text-xs flex-1 md:flex-none flex justify-center items-center gap-2">
            <Printer size={14} /> Print Report
          </button>
        </div>
      </div>

      <div className="overflow-x-auto print-friendly-table">
        <table className="gov-table">
          <thead>
            <tr>
              <th>Ref #</th><th>Officer</th><th>District</th><th>Category</th>
              <th>Amount</th><th>Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td className="font-mono text-[var(--gold-light)]">{t.id}</td>
                <td>{t.officer}</td>
                <td>{t.district}</td>
                <td>{t.category}</td>
                <td className="font-bold">{formatLKR(t.amount)}</td>
                <td>{t.date}</td>
                <td>
                  <span className={`status-badge status-${t.status.toLowerCase()}`}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================================================================
// NEW: Event-Driven Live Ticket Feed
// =========================================================================
function LiveTicketFeed() {
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    // Initial state
    setFeed([
      { id: "TF-2026-00850", location: "Kandy Road", time: "1 min ago", amount: 2500, type: "Signal Violation" },
      { id: "TF-2026-00849", location: "Colombo 03", time: "2 min ago", amount: 3500, type: "Speeding" }
    ]);

    // Simulate WebSocket connection pushing a new ticket
    const interval = setInterval(() => {
      const locations = ["Galle Face", "Negombo Town", "Jaffna Central", "Kurunegala", "Matara", "Kottawa"];
      const types = ["Speeding", "Signal Violation", "Illegal Parking", "No License", "Drunk Driving"];
      const amounts = [1500, 2500, 3500, 5000, 25000];

      const randomIdx = Math.floor(Math.random() * 5);

      const newTicket = {
        id: `TF-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        time: "Just now",
        amount: amounts[randomIdx],
        type: types[randomIdx]
      };

      setFeed(prev => [newTicket, ...prev].slice(0, 5));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ornate-card p-5 h-full flex flex-col border-[var(--gold-primary)]/50 relative overflow-hidden bg-gradient-to-b from-[var(--navy-mid)] to-[var(--navy-deep)]">

      <div className="flex items-center gap-2 mb-4 border-b border-[var(--gold-primary)]/20 pb-4">
        <Activity className="text-emerald-400 animate-pulse" size={20} />
        <h3 className="font-display text-xl gold-gradient-text">Live National Feed</h3>
        <span className="ml-auto text-[10px] uppercase tracking-widest text-emerald-400 border border-emerald-400/30 px-2 py-1 rounded bg-emerald-400/10 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-hidden">
        {feed.map((ticket) => (
          <div
            key={ticket.id}
            className="flex justify-between items-center bg-[var(--navy-deep)]/60 p-3 rounded border-l-2 border-[var(--gold-primary)] animate-in fade-in slide-in-from-left-4 duration-500 shadow-sm"
          >
            <div>
              <div className="text-[var(--gold-light)] font-mono text-sm">{ticket.id}</div>
              <div className="text-cream/70 text-xs font-serif mt-1">{ticket.type} • {ticket.location}</div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 text-xs mb-1">{ticket.time}</div>
              <div className="font-bold text-sm text-[var(--cream)]">{formatLKR(ticket.amount)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--gold-primary)]/10 text-center">
         <span className="text-[10px] text-cream/40 uppercase tracking-widest font-serif">Listening to secure socket wss://slp-fines.lk</span>
      </div>
    </div>
  );
}