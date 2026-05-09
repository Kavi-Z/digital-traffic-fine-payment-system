// src/routes/officer.tsx
// Officer portal - login, issue fines, view issued fines history

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, LogOut, Plus, Loader2, AlertCircle, CheckCircle2, FileText, RefreshCw } from "lucide-react";
import { authApi, officerApi, fineApi, saveAuthData, logout as doLogout } from "@/lib/api";

export const Route = createFileRoute("/officer")({
  component: OfficerPortal,
  head: () => ({
    meta: [
      { title: "Officer Portal — Sri Lanka Police" },
      { name: "description", content: "Issue and manage traffic fines." },
    ],
  }),
});

function OfficerPortal() {
  const [authed, setAuthed] = useState(false);
  const [officer, setOfficer] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const userInfo = localStorage.getItem("user_info");
    if (token && userInfo) {
      const parsed = JSON.parse(userInfo);
      if (parsed.role === "OFFICER") {
        setAuthed(true);
        setOfficer(parsed);
      }
    }
  }, []);

  const handleLogout = () => {
    doLogout();
    setAuthed(false);
    setOfficer(null);
  };

  if (!authed) return <OfficerLogin onLogin={(info) => { setOfficer(info); setAuthed(true); }} />;
  return <OfficerDashboard officer={officer} onLogout={handleLogout} />;
}

function OfficerLogin({ onLogin }: { onLogin: (info: any) => void }) {
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
      if (response.role !== "OFFICER") {
        setErr("Access denied. Officer credentials required.");
        return;
      }
      saveAuthData(response);
      onLogin(response);
    } catch (error: any) {
      setErr(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-noise flex items-center justify-center px-4">
      <div className="ornate-card p-10 max-w-md w-full">
        <div className="text-center mb-4 text-[var(--gold-primary)] flex justify-center"><Shield size={48} /></div>
        <h1 className="text-2xl font-display gold-gradient-text text-center">Officer Login</h1>
        <p className="text-center text-cream/70 text-sm font-serif mt-1">Traffic Fine Issuance System</p>
        <div className="ornate-divider"><span>❖</span></div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="block font-display tracking-widest text-xs uppercase text-[var(--gold-primary)] mb-1">Username / Badge ID</span>
            <input className="typewriter-input w-full" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label className="block">
            <span className="block font-display tracking-widest text-xs uppercase text-[var(--gold-primary)] mb-1">Password</span>
            <input type="password" className="typewriter-input w-full" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {err && <div className="text-[var(--crimson)] text-sm font-serif flex items-center gap-2"><AlertCircle size={14} />{err}</div>}
          <button type="submit" disabled={loading} className="w-full gold-btn py-3 font-display tracking-widest uppercase text-sm flex items-center justify-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
            {loading ? "Authenticating..." : "Login"}
          </button>
          <p className="text-center text-cream/40 text-xs mt-2 font-serif">Default: <code>officer001 / Officer@123</code></p>
        </form>
      </div>
    </div>
  );
}

function OfficerDashboard({ officer, onLogout }: { officer: any; onLogout: () => void }) {
  const [view, setView] = useState<"issue" | "history">("issue");
  const [categories, setCategories] = useState<any[]>([]);
  const [myFines, setMyFines] = useState<any[]>([]);
  const [loadingFines, setLoadingFines] = useState(false);

  // Issue form state
  const [form, setForm] = useState({
    categoryIdentifier: "",
    driverLicenseNumber: "",
    driverNic: "",
    driverName: "",
    vehicleNumber: "",
    location: "",
    notes: "",
  });
  const [issuing, setIssuing] = useState(false);
  const [issueResult, setIssueResult] = useState<any>(null);
  const [issueError, setIssueError] = useState("");

  useEffect(() => {
    fineApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  const loadHistory = async () => {
    setLoadingFines(true);
    try {
      const fines = await officerApi.getMyFines();
      setMyFines(fines);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoadingFines(false);
    }
  };

  useEffect(() => {
    if (view === "history") loadHistory();
  }, [view]);

  const handleIssueFine = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssuing(true);
    setIssueError("");
    setIssueResult(null);
    try {
      const result = await officerApi.issueFine({
        ...form,
        vehicleNumber: form.vehicleNumber.toUpperCase(),
      });
      setIssueResult(result);
      // Reset form
      setForm({ categoryIdentifier: "", driverLicenseNumber: "", driverNic: "", driverName: "", vehicleNumber: "", location: "", notes: "" });
    } catch (e: any) {
      setIssueError(e.message || "Failed to issue fine.");
    } finally {
      setIssuing(false);
    }
  };

  const selectedCategory = categories.find(c => c.identifier === form.categoryIdentifier);

  return (
    <div className="min-h-screen bg-noise text-cream">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--navy-deep)]/85 border-b-2 border-[var(--gold-primary)]/50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4">
          <Shield size={28} className="text-[var(--gold-primary)]" />
          <div>
            <div className="font-display text-base leading-tight gold-gradient-text">Officer Portal</div>
            <div className="text-xs text-cream/60">{officer.fullName} · {officer.district}</div>
          </div>
          <nav className="ml-auto flex items-center gap-4 text-xs font-display tracking-widest uppercase">
            <button onClick={() => setView("issue")} className={view === "issue" ? "text-[var(--gold-primary)]" : "text-cream/50 hover:text-cream"}>Issue Fine</button>
            <button onClick={() => setView("history")} className={view === "history" ? "text-[var(--gold-primary)]" : "text-cream/50 hover:text-cream"}>My Fines</button>
            <Link to="/" className="text-cream/50 hover:text-cream">Home</Link>
            <button onClick={onLogout} className="text-cream/50 hover:text-[var(--crimson)] flex items-center gap-1"><LogOut size={14} /> Logout</button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {view === "issue" && (
          <div className="ornate-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-display gold-gradient-text mb-1">Issue Traffic Fine</h2>
            <p className="text-cream/60 text-sm font-serif mb-6">Fill in the violator's details to generate a fine reference number.</p>

            {issueResult && (
              <div className="mb-6 border border-green-500/40 bg-green-900/20 rounded p-5">
                <div className="flex items-center gap-2 text-green-400 font-display mb-2"><CheckCircle2 size={20} /> Fine Issued Successfully</div>
                <div className="font-mono text-2xl text-[var(--gold-primary)] mb-1">{issueResult.referenceNumber}</div>
                <div className="text-xs text-cream/60 font-serif">Category: {issueResult.categoryName} · Amount: LKR {issueResult.amount?.toLocaleString()}</div>
                <div className="text-xs text-cream/60 mt-1">Give the driver: Reference <strong>{issueResult.referenceNumber}</strong> + Category Code <strong>{issueResult.categoryIdentifier}</strong></div>
              </div>
            )}

            {issueError && (
              <div className="mb-4 text-[var(--crimson)] text-sm font-serif flex items-center gap-2">
                <AlertCircle size={14} /> {issueError}
              </div>
            )}

            <form onSubmit={handleIssueFine} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block font-display text-xs uppercase tracking-widest text-[var(--gold-primary)] mb-1">Fine Category *</span>
                  <select
                    required
                    className="typewriter-input w-full bg-[var(--navy-deep)]"
                    value={form.categoryIdentifier}
                    onChange={(e) => setForm(f => ({ ...f, categoryIdentifier: e.target.value }))}
                  >
                    <option value="">Select category...</option>
                    {categories.map(c => (
                      <option key={c.identifier} value={c.identifier}>
                        [{c.identifier}] {c.name} — LKR {c.amount?.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  {selectedCategory && (
                    <p className="text-xs text-cream/50 mt-1">Fine: LKR {selectedCategory.amount?.toLocaleString()} · -{selectedCategory.pointsDeducted} merit pts</p>
                  )}
                </label>

                <label className="block">
                  <span className="block font-display text-xs uppercase tracking-widest text-[var(--gold-primary)] mb-1">Driver License No. *</span>
                  <input required className="typewriter-input w-full" value={form.driverLicenseNumber} onChange={(e) => setForm(f => ({ ...f, driverLicenseNumber: e.target.value }))} placeholder="e.g. B1234567" />
                </label>

                <label className="block">
                  <span className="block font-display text-xs uppercase tracking-widest text-[var(--gold-primary)] mb-1">Driver NIC</span>
                  <input className="typewriter-input w-full" value={form.driverNic} onChange={(e) => setForm(f => ({ ...f, driverNic: e.target.value }))} placeholder="e.g. 199012345678" />
                </label>

                <label className="block">
                  <span className="block font-display text-xs uppercase tracking-widest text-[var(--gold-primary)] mb-1">Driver Name</span>
                  <input className="typewriter-input w-full" value={form.driverName} onChange={(e) => setForm(f => ({ ...f, driverName: e.target.value }))} placeholder="Full name" />
                </label>

                <label className="block">
                  <span className="block font-display text-xs uppercase tracking-widest text-[var(--gold-primary)] mb-1">Vehicle Number</span>
                  <input className="typewriter-input w-full" value={form.vehicleNumber} onChange={(e) => setForm(f => ({ ...f, vehicleNumber: e.target.value.toUpperCase() }))} placeholder="e.g. CAB-1234" />
                </label>

                <label className="block">
                  <span className="block font-display text-xs uppercase tracking-widest text-[var(--gold-primary)] mb-1">Location</span>
                  <input className="typewriter-input w-full" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Galle Road, Colombo 03" />
                </label>
              </div>

              <label className="block">
                <span className="block font-display text-xs uppercase tracking-widest text-[var(--gold-primary)] mb-1">Notes</span>
                <textarea className="typewriter-input w-full" rows={2} value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes..." />
              </label>

              <button type="submit" disabled={issuing} className="w-full gold-btn py-3 font-display tracking-widest uppercase text-sm flex items-center justify-center gap-2">
                {issuing ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                {issuing ? "Issuing..." : "Issue Fine"}
              </button>
            </form>
          </div>
        )}

        {view === "history" && (
          <div className="ornate-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display gold-gradient-text">My Issued Fines</h2>
              <button onClick={loadHistory} className="text-cream/50 hover:text-[var(--gold-primary)] flex items-center gap-1 text-xs font-display uppercase tracking-widest">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            {loadingFines ? (
              <div className="flex justify-center py-12"><Loader2 size={32} className="animate-spin text-[var(--gold-primary)]" /></div>
            ) : myFines.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={40} className="mx-auto text-cream/20 mb-3" />
                <p className="text-cream/40 font-serif">No fines issued yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--gold-primary)]/20">
                      {["Reference", "Category", "Amount", "Driver", "Vehicle", "Status", "Date"].map(h => (
                        <th key={h} className="text-left py-2 pr-4 text-xs uppercase tracking-widest text-[var(--gold-primary)] font-display">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {myFines.map((f: any) => (
                      <tr key={f.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 pr-4 font-mono text-xs text-[var(--gold-primary)]">{f.referenceNumber}</td>
                        <td className="py-2 pr-4 text-cream/80">{f.categoryName}</td>
                        <td className="py-2 pr-4 text-cream/80">LKR {f.amount?.toLocaleString()}</td>
                        <td className="py-2 pr-4 text-cream/70">{f.driverName || f.driverLicenseNumber}</td>
                        <td className="py-2 pr-4 text-cream/70">{f.vehicleNumber || "—"}</td>
                        <td className="py-2 pr-4">
                          <span className={`px-2 py-0.5 text-xs rounded font-display uppercase tracking-widest ${
                            f.status === "PAID" ? "bg-green-900/50 text-green-400" :
                            f.status === "OVERDUE" ? "bg-red-900/50 text-red-400" :
                            "bg-yellow-900/50 text-yellow-400"
                          }`}>{f.status}</span>
                        </td>
                        <td className="py-2 pr-4 text-cream/50 text-xs">
                          {f.issuedAt ? new Date(f.issuedAt).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}