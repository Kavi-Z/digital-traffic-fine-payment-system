import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Shield, Wifi, WifiOff, Send, Database, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatLKR } from "@/hooks/useCountUp";

export const Route = createFileRoute("/officer")({
  component: OfficerPortal,
  head: () => ({
    meta: [{ title: "Officer App — Sri Lanka Police" }],
  }),
});

function OfficerPortal() {
  // Offline-First State Management
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);

  // Form State
  const [nic, setNic] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [category, setCategory] = useState("Speeding");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Listen for internet connection changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Load offline queue from local storage
    const savedQueue = localStorage.getItem("slp_offline_tickets");
    if (savedQueue) setSyncQueue(JSON.parse(savedQueue));

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const issueTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newTicket = {
      id: `TF-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      nic: nic.toUpperCase(),
      vehicleNo: vehicleNo.toUpperCase(),
      category,
      amount: category === "Speeding" ? 3500 : 2500,
      timestamp: new Date().toISOString()
    };

    setTimeout(() => {
      if (isOnline) {
        // ONLINE: Send directly to backend (Simulated)
        setSuccessMsg(`Ticket ${newTicket.id} issued and uploaded to national database.`);
      } else {
        // OFFLINE: Save to local device storage
        const updatedQueue = [...syncQueue, newTicket];
        setSyncQueue(updatedQueue);
        localStorage.setItem("slp_offline_tickets", JSON.stringify(updatedQueue));
        setSuccessMsg(`You are offline. Ticket ${newTicket.id} saved locally to device.`);
      }

      // Reset form
      setNic("");
      setVehicleNo("");
      setLoading(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 800);
  };

  const syncData = () => {
    setLoading(true);
    // Simulate pushing the queue to the Spring Boot Backend
    setTimeout(() => {
      setSyncQueue([]);
      localStorage.removeItem("slp_offline_tickets");
      setSuccessMsg("All offline tickets successfully synced to the national database.");
      setLoading(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--navy-deep)] pb-20 font-serif text-cream">
      {/* Mobile-Friendly Header */}
      <header className="bg-[var(--navy-mid)] border-b-2 border-[var(--gold-primary)]/50 p-4 sticky top-0 z-10 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <Shield className="text-[var(--gold-primary)]" size={28} />
          <div>
            <div className="font-display text-lg gold-gradient-text leading-none">Officer App</div>
            <div className="text-[10px] uppercase tracking-widest text-cream/50">Field Operations</div>
          </div>
        </div>

        {/* Dynamic Network Status Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider ${isOnline ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
          {isOnline ? <Wifi size={14}/> : <WifiOff size={14}/>}
          {isOnline ? "ONLINE" : "OFFLINE"}
        </div>
      </header>

      <main className="p-4 space-y-6 max-w-md mx-auto mt-4">

        {/* Offline Queue Warning */}
        {syncQueue.length > 0 && (
          <div className="bg-[var(--navy-mid)] border border-[var(--gold-primary)]/50 p-4 rounded-lg flex flex-col gap-3 shadow-lg">
            <div className="flex items-center gap-2 text-[var(--gold-primary)]">
              <Database size={20} />
              <span className="font-display text-lg">Pending Sync: {syncQueue.length}</span>
            </div>
            <p className="text-xs text-cream/70">You have tickets saved locally. Connect to the internet to sync them to the database.</p>
            <button
              onClick={syncData}
              disabled={!isOnline || loading}
              className="metallic-btn !py-2 !px-4 text-xs flex justify-center items-center gap-2 disabled:opacity-50 disabled:grayscale"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
              Sync Now
            </button>
          </div>
        )}

        {/* Success Message Toast */}
        {successMsg && (
          <div className="bg-emerald-400/20 border border-emerald-400/50 text-emerald-400 p-3 rounded-lg flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={18} className="shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Issue Ticket Form */}
        <form onSubmit={issueTicket} className="ornate-card p-6 flex flex-col gap-4">
          <h2 className="font-display text-2xl gold-gradient-text border-b border-[var(--gold-primary)]/20 pb-2">Issue Citation</h2>

          <label className="block">
            <span className="block text-[10px] uppercase tracking-widest text-[var(--gold-primary)] mb-1">Driver NIC</span>
            <input className="typewriter-input w-full" value={nic} onChange={(e) => setNic(e.target.value)} placeholder="e.g. 981234567V" required />
          </label>

          <label className="block">
            <span className="block text-[10px] uppercase tracking-widest text-[var(--gold-primary)] mb-1">Vehicle Registration</span>
            <input className="typewriter-input w-full uppercase" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} placeholder="e.g. WP CBA-1234" required />
          </label>

          <label className="block">
            <span className="block text-[10px] uppercase tracking-widest text-[var(--gold-primary)] mb-1">Violation Category</span>
            <select className="typewriter-input w-full" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Speeding</option>
              <option>Signal Violation</option>
              <option>Illegal Parking</option>
              <option>No License</option>
            </select>
          </label>

          <div className="bg-[var(--navy-deep)] p-3 rounded border border-cream/10 flex justify-between items-center mt-2">
            <span className="text-xs uppercase tracking-widest text-cream/50">Penalty Amount</span>
            <span className="font-display text-xl text-[var(--crimson)]">{formatLKR(category === "Speeding" ? 3500 : 2500)}</span>
          </div>

          <button disabled={loading} className="metallic-btn crimson-btn w-full mt-2 flex justify-center items-center">
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Issue Ticket"}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link to="/" className="text-[var(--gold-primary)] hover:underline text-xs uppercase tracking-widest">Return to Citizen Portal</Link>
        </div>
      </main>
    </div>
  );
}