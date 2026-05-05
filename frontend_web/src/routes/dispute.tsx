import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { formatLKR } from "@/hooks/useCountUp";
import {
  Shield, Scale, FileUp, CheckCircle2, AlertCircle,
  UploadCloud, X, Loader2, Camera
} from "lucide-react";
import StepIndicator from "@/components/common/StepIndicator";

export const Route = createFileRoute("/dispute")({
  component: DisputePortal,
  head: () => ({
    meta: [
      { title: "Dispute a Fine — Sri Lanka Police" },
      { name: "description", content: "Submit a formal dispute with digital evidence." },
    ],
  }),
});

function DisputePortal() {
  const [step, setStep] = useState(0);
  const [ticketDetails, setTicketDetails] = useState<any>(null);

  // Dispute State
  const [reason, setReason] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [ticketId, setTicketId] = useState("");

  return (
    <div className="min-h-screen bg-noise pb-20">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--navy-deep)]/85 border-b-2 border-[var(--gold-primary)]/50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 text-[var(--gold-primary)]">
            <Shield size={32} />
            <div>
              <div className="font-display text-lg leading-tight">Ticket Dispute Tribunal</div>
              <div className="text-xs uppercase tracking-widest text-cream/70">Sri Lanka Police</div>
            </div>
          </Link>
        </div>
      </header>

      {/* Reusing your existing Step Indicator, just mapping step numbers visually */}
      <div className="pt-8 pb-4">
        <StepIndicator current={step} />
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-6">
        {step === 0 && (
          <FindTicketStep
            ticketId={ticketId}
            setTicketId={setTicketId}
            onNext={(data) => { setTicketDetails(data); setStep(1); }}
          />
        )}
        {step === 1 && (
          <UploadEvidenceStep
            ticketDetails={ticketDetails}
            reason={reason}
            setReason={setReason}
            file={evidenceFile}
            setFile={setEvidenceFile}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <SubmitDisputeStep
            ticketDetails={ticketDetails}
            reason={reason}
            file={evidenceFile}
            onSuccess={() => setStep(3)}
          />
        )}
        {step === 3 && <SuccessStep ticketId={ticketDetails.reference} />}
      </main>
    </div>
  );
}

function FindTicketStep({ ticketId, setTicketId, onNext }: { ticketId: string, setTicketId: (v: string) => void, onNext: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId) return setError("Please enter a valid Reference Number.");

    setLoading(true);
    setError("");

    // Simulate DB Lookup
    setTimeout(() => {
      setLoading(false);
      onNext({
        reference: ticketId.toUpperCase(),
        violation: "Illegal Parking",
        amount: 1500,
        officerName: "Officer W. Perera",
        date: new Date().toLocaleDateString(),
        location: "Hospital Road, Kandy"
      });
    }, 1200);
  };

  return (
    <div className="ornate-card p-8 md:p-12 fade-up">
      <div className="flex justify-center mb-4 text-[var(--gold-primary)]">
        <Scale size={48} />
      </div>
      <h2 className="text-3xl font-display gold-gradient-text text-center">Contest a Citation</h2>
      <p className="text-center text-cream/70 text-sm mt-2 font-serif">Enter the reference number of the fine you wish to dispute.</p>
      <div className="ornate-divider"><span>❖</span></div>

      <form onSubmit={handleSearch} className="max-w-md mx-auto space-y-6 mt-8">
        <label className="block text-left w-full">
          <span className="block font-display tracking-widest text-xs uppercase text-[var(--gold-primary)] mb-1">Fine Reference Number</span>
          <input
            className="typewriter-input w-full uppercase"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="e.g., TF-2026-12345"
            required
          />
        </label>

        {error && <div className="text-[var(--crimson)] text-sm text-center font-serif bg-[var(--crimson)]/10 p-3 rounded border border-[var(--crimson)]/30">{error}</div>}

        <button disabled={loading} className="metallic-btn w-full">
          {loading ? "Locating Record..." : "Verify & Continue"}
        </button>
      </form>
    </div>
  );
}

function UploadEvidenceStep({ ticketDetails, reason, setReason, file, setFile, onBack, onNext }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="ornate-card p-8 md:p-12 fade-up">
      <h2 className="text-3xl font-display gold-gradient-text text-center">Provide Evidence</h2>
      <div className="ornate-divider"><span>❖</span></div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side: The Ticket Context */}
        <div className="bg-[var(--navy-deep)]/50 border border-[var(--gold-primary)]/30 p-6 rounded h-fit">
          <div className="text-[var(--gold-primary)] font-display text-lg mb-4 border-b border-[var(--gold-primary)]/20 pb-2">Contested Record</div>
          <div className="space-y-3 font-serif text-cream/80 text-sm">
            <div className="flex justify-between"><span>Reference:</span> <span className="text-[var(--gold-light)] font-mono">{ticketDetails.reference}</span></div>
            <div className="flex justify-between"><span>Violation:</span> <span>{ticketDetails.violation}</span></div>
            <div className="flex justify-between"><span>Location:</span> <span>{ticketDetails.location}</span></div>
            <div className="flex justify-between border-t border-cream/10 pt-2 mt-2">
              <span>Penalty:</span> <span className="text-[var(--crimson)] font-bold">{formatLKR(ticketDetails.amount)}</span>
            </div>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="space-y-6">
          <label className="block text-left w-full">
            <span className="block font-display tracking-widest text-xs uppercase text-[var(--gold-primary)] mb-1">Reason for Dispute</span>
            <textarea
              className="typewriter-input w-full min-h-[100px] resize-none text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this fine is incorrect..."
              required
            />
          </label>

          <div>
            <span className="block font-display tracking-widest text-xs uppercase text-[var(--gold-primary)] mb-1">Supporting Media (Optional)</span>

            {/* Custom File Dropzone */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/mp4" />

            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[var(--gold-primary)]/40 hover:border-[var(--gold-primary)] hover:bg-[var(--gold-primary)]/5 transition-colors rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer text-center"
              >
                <UploadCloud className="text-[var(--gold-primary)] mb-2" size={32} />
                <span className="text-sm font-serif text-cream/80">Click to upload dashcam photo/video</span>
                <span className="text-xs text-cream/40 mt-1">PNG, JPG or MP4 (Max 10MB)</span>
              </div>
            ) : (
              <div className="border border-emerald-400/30 bg-emerald-400/10 p-4 rounded flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Camera className="text-emerald-400 shrink-0" size={20} />
                  <div className="truncate text-sm text-cream/90">{file.name}</div>
                </div>
                <button onClick={() => setFile(null)} className="text-cream/50 hover:text-[var(--crimson)] transition-colors p-1">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-[var(--gold-primary)]/20">
        <button onClick={onBack} className="px-6 py-2 text-[var(--gold-primary)] hover:underline font-display tracking-widest text-sm uppercase">← Back</button>
        <button
          onClick={onNext}
          disabled={!reason.trim()}
          className="metallic-btn"
        >
          Review & Submit →
        </button>
      </div>
    </div>
  );
}

function SubmitDisputeStep({ ticketDetails, reason, file, onSuccess }: any) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);

    // In a real app, this is where you'd use a FormData object:
    // const formData = new FormData();
    // formData.append("reference", ticketDetails.reference);
    // formData.append("reason", reason);
    // if (file) formData.append("evidence", file);
    // await apiClient('/disputes/submit', { method: 'POST', body: formData, headers: {'Content-Type': 'multipart/form-data'} })

    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="ornate-card p-8 md:p-12 fade-up">
      <h2 className="text-3xl font-display gold-gradient-text text-center mb-6">Confirm Submission</h2>

      <div className="bg-[var(--navy-deep)] p-6 border border-cream/10 rounded mb-8">
        <div className="text-xs uppercase tracking-widest text-[var(--gold-primary)] mb-1">Your Statement</div>
        <p className="text-cream font-serif italic border-l-2 border-[var(--gold-primary)] pl-4 py-1">"{reason}"</p>

        <div className="flex items-center gap-2 mt-4 text-sm text-cream/70">
          <FileUp size={16} className={file ? "text-emerald-400" : "text-cream/30"} />
          {file ? `Attached: ${file.name}` : "No evidence attached"}
        </div>
      </div>

      <div className="bg-[var(--crimson)]/10 border border-[var(--crimson)]/30 p-4 rounded flex gap-3 text-sm text-cream/80 font-serif mb-8">
        <AlertCircle className="text-[var(--crimson)] shrink-0" size={20} />
        <p>By submitting this dispute, I declare that the information provided is true and accurate. False declarations may result in additional legal penalties under the Motor Traffic Act.</p>
      </div>

      <button onClick={handleSubmit} disabled={loading} className="metallic-btn crimson-btn w-full">
        {loading ? <Loader2 className="inline animate-spin mr-2" size={18} /> : null}
        {loading ? "Transmitting to Tribunal..." : "Submit Formal Dispute"}
      </button>
    </div>
  );
}

function SuccessStep({ ticketId }: { ticketId: string }) {
  return (
    <div className="ornate-card p-8 md:p-12 text-center fade-up">
      <CheckCircle2 size={64} className="text-emerald-400 mx-auto mb-6" />
      <h2 className="text-4xl font-display gold-gradient-text">Dispute Submitted</h2>
      <div className="ornate-divider max-w-md mx-auto"><span>✦</span></div>

      <p className="text-cream/80 mt-4 font-serif text-lg">
        Your case regarding ticket <strong className="text-[var(--gold-light)] font-mono">{ticketId}</strong> has been forwarded to the Traffic Tribunal.
      </p>

      <div className="bg-[var(--navy-deep)]/50 p-6 border border-[var(--gold-primary)]/20 mt-6 inline-block mx-auto text-left rounded">
        <div className="text-sm font-serif text-cream/70 mb-2">Tracking ID:</div>
        <div className="font-mono text-2xl tracking-widest text-[var(--gold-primary)]">DISP-{Math.floor(Math.random() * 900000)}</div>
      </div>

      <p className="text-cream/50 mt-6 text-sm font-serif max-w-md mx-auto">
        You will receive an SMS update regarding the status of your review within 3-5 business days. Please retain your Tracking ID.
      </p>

      <div className="mt-8">
        <Link to="/" className="metallic-btn">Return to Home Dashboard</Link>
      </div>
    </div>
  );
}