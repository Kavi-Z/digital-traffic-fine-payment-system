import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import { apiClient } from "@/lib/api";
import StepIndicator from "@/components/common/StepIndicator";
import CreditCard3D from "@/components/common/CreditCard3D";
import { formatLKR } from "@/hooks/useCountUp";
import { Loader2, Smartphone, Download, Home, Shield, Camera, X, ScanLine } from "lucide-react";

export const Route = createFileRoute("/pay")({
  component: PaymentPortal,
  head: () => ({
    meta: [
      { title: "Pay Traffic Fine — Sri Lanka Police" },
      { name: "description", content: "Securely pay your Sri Lanka Police traffic fine online." },
    ],
  }),
});

function PaymentPortal() {
  const [step, setStep] = useState(0);
  const [fineDetails, setFineDetails] = useState<any>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<any>(null);

  return (
    <div className="min-h-screen bg-noise">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--navy-deep)]/85 border-b-2 border-[var(--gold-primary)]/50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 text-[var(--gold-primary)]">
            <Shield size={32} />
            <div>
              <div className="font-display text-lg leading-tight">Traffic Fine Payment Portal</div>
              <div className="text-xs uppercase tracking-widest text-cream/70">Sri Lanka Police</div>
            </div>
          </Link>
          <div className="ml-auto flex gap-3 text-xs font-display tracking-widest text-[var(--gold-primary)]">
            <span className="border border-[var(--gold-primary)]/50 px-2 py-1">EN</span>
            <span className="px-2 py-1 opacity-60">සිං</span>
            <span className="px-2 py-1 opacity-60">தமி</span>
          </div>
        </div>
      </header>

      <StepIndicator current={step} />

      <main className="max-w-4xl mx-auto px-6 pb-20">
        {step === 0 && (
          <VerifyStep
            onNext={(data) => {
              setFineDetails(data);
              setStep(1);
            }}
          />
        )}
        {step === 1 && (
          <PayStep
            fineDetails={fineDetails}
            onNext={(receipt) => {
              setPaymentReceipt(receipt);
              setStep(2);
            }}
          />
        )}
        {step === 2 && paymentReceipt && (
          <ConfirmStep receipt={paymentReceipt} />
        )}
      </main>
    </div>
  );
}

function VerifyStep({ onNext }: { onNext: (data: any) => void }) {
  const [ref, setRef] = useState("");
  const [cat, setCat] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifiedData, setVerifiedData] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false); // Controls the AI Scanner

  const verify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ref || !cat) {
      setError("Please enter both Reference Number and Category.");
      return;
    }

    setLoading(true);
    setError("");

    // Simulated API call for the demo
    setTimeout(() => {
      setVerifiedData({
        reference: ref.toUpperCase(),
        violation: "Speeding (Category " + cat.toUpperCase() + ")",
        amount: cat.toUpperCase() === 'A' ? 5000 : 3500,
        officerName: "Officer P. Karunaratne",
        date: new Date().toLocaleDateString(),
        location: "Galle Road, Colombo 03"
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="ornate-card p-8 md:p-12 fade-up relative">
      <h2 className="text-3xl font-display gold-gradient-text text-center">Fine Verification</h2>
      <div className="ornate-divider"><span>❖</span></div>

      {showScanner && (
        <TicketScannerModal
          onClose={() => setShowScanner(false)}
          onScanSuccess={(scannedRef) => {
            setRef(scannedRef);
            setShowScanner(false);
          }}
        />
      )}

      {!verifiedData ? (
        <form onSubmit={verify} className="max-w-lg mx-auto space-y-5">
          <div className="relative">
            <Field label="Fine Reference Number" value={ref} onChange={setRef} placeholder="e.g., TF-2026-00000" />

            {/* The Magic AI Scan Button */}
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="absolute right-2 top-8 p-2 text-[var(--gold-primary)] hover:bg-[var(--gold-primary)]/20 rounded-md transition-colors flex items-center gap-2"
              title="Scan physical ticket"
            >
              <Camera size={20} />
              <span className="text-xs font-display tracking-widest uppercase">Smart Scan</span>
            </button>
          </div>

          <Field label="Fine Category Identifier" value={cat} onChange={setCat} placeholder="A / B / C" />

          {error && (
            <div className="text-[var(--crimson)] text-sm text-center font-serif bg-[var(--crimson)]/10 p-3 border border-[var(--crimson)]/30 rounded">
              {error}
            </div>
          )}

          <div className="text-center pt-4">
            <button className="metallic-btn w-full" disabled={loading}>
              {loading ? <Loader2 className="inline animate-spin mr-2" size={18} /> : null}
              {loading ? "Verifying…" : "Verify Fine"}
            </button>
          </div>
        </form>
      ) : (
        <div className="relative max-w-lg mx-auto fade-up">
          <div className="absolute -top-2 right-2 z-10">
            <span className="stamp stamp-verified">Verified</span>
          </div>
          <div className="border-2 border-[var(--gold-primary)]/50 p-6 bg-[var(--navy-deep)]/60">
            <div className="font-display text-xl text-[var(--gold-primary)] mb-3">Fine Details</div>
            <Detail k="Reference #" v={verifiedData.reference} />
            <Detail k="Violation" v={verifiedData.violation} />
            <Detail k="Amount Due" v={formatLKR(verifiedData.amount)} highlight />
            <Detail k="Issued By" v={verifiedData.officerName} />
            <Detail k="Date" v={verifiedData.date} />
            <Detail k="Location" v={verifiedData.location} />
          </div>
          <div className="text-center mt-8 flex justify-center gap-4">
            <button
              type="button"
              className="px-6 py-2 border border-[var(--gold-primary)]/50 text-[var(--gold-primary)] hover:bg-[var(--gold-primary)]/10 transition-colors uppercase tracking-widest text-xs font-display"
              onClick={() => setVerifiedData(null)}
            >
              Cancel
            </button>
            <button className="metallic-btn" onClick={() => onNext(verifiedData)}>
              Proceed to Payment →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// NEW: AI Smart Scanner Component
// =========================================================================
function TicketScannerModal({ onClose, onScanSuccess }: { onClose: () => void, onScanSuccess: (ref: string) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [scanning, setScanning] = useState(false);
  const [statusText, setStatusText] = useState("Align the ticket in the frame and capture.");

  const captureAndScan = useCallback(async () => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) return;

      setScanning(true);
      setStatusText("AI Engine reading text...");

      try {
        // 1. Run Tesseract OCR on the captured image
        const result = await Tesseract.recognize(imageSrc, 'eng', {
          logger: m => {
            if (m.status === "recognizing text") {
              setStatusText(`Processing: ${Math.round(m.progress * 100)}%`);
            }
          }
        });

        const text = result.data.text;
        console.log("OCR Actually Saw:", text); // Check your browser console to see raw output!

        // 2. Relaxed Regex: Looks for 'TF' followed by numbers, even if there are spaces or missing dashes
        const match = text.match(/TF[-\s]*\d{2,4}[-\s]*\d{4,5}/i);

        if (match) {
          // Clean up the scanned text to format it properly as TF-XXXX-XXXXX
          const cleanedMatch = match[0].replace(/\s+/g, '-').toUpperCase();
          setStatusText(`Ticket Found! Extracting ${cleanedMatch}...`);
          setTimeout(() => onScanSuccess(cleanedMatch), 1000);
        } else {
          // 3. Show the user what the AI thought it saw so they can adjust
          const cleanText = text.replace(/[^a-zA-Z0-9]/g, ' ').trim();
          if (cleanText.length > 0) {
            setStatusText(`Format unrecognized. AI saw: "${cleanText.substring(0, 15)}..."`);
          } else {
            setStatusText("No text detected. Please ensure good lighting and focus.");
          }
          setScanning(false);
        }
      } catch (err) {
        setStatusText("Scanner error. Please enter manually.");
        setScanning(false);
      }
    }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-[var(--navy-deep)] border-2 border-[var(--gold-primary)] p-6 rounded-lg max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-cream/50 hover:text-[var(--crimson)] transition-colors">
          <X size={24} />
        </button>

        <h3 className="text-2xl font-display gold-gradient-text flex items-center gap-3 mb-2">
          <ScanLine size={24} className="text-[var(--gold-primary)]" />
          AI Ticket Scanner
        </h3>
        <p className="text-cream/70 text-sm font-serif mb-6">{statusText}</p>

        <div className="relative rounded-md overflow-hidden border border-[var(--gold-primary)]/30 bg-black aspect-video flex items-center justify-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }} // Tries to use rear camera on mobile
            className="w-full h-full object-cover"
          />

          {/* Scanning Overlay Animation */}
          {scanning && (
            <div className="absolute inset-0 bg-[var(--gold-primary)]/20">
              <div className="w-full h-1 bg-[var(--gold-primary)] shadow-[0_0_15px_var(--gold-primary)] animate-[scan_2s_ease-in-out_infinite]" />
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={captureAndScan}
            disabled={scanning}
            className="metallic-btn w-full"
          >
            {scanning ? <Loader2 className="inline animate-spin" size={20} /> : "Capture & Scan Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}




// =========================================================================
// Existing Pay & Confirm Steps
// =========================================================================

function PayStep({ fineDetails, onNext }: { fineDetails: any, onNext: (receipt: any) => void }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [phone, setPhone] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  const formatExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const processPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || number.length < 19 || exp.length < 5 || cvv.length < 3 || !phone) {
      setError("Please complete all payment details.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      const generatedReceipt = {
        receiptNumber: `RCP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        referenceNumber: fineDetails.reference,
        amountPaid: fineDetails.amount,
        transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        timestamp: new Date().toISOString()
      };
      setLoading(false);
      onNext(generatedReceipt);
    }, 2500);
  };

  return (
    <div className="ornate-card p-8 md:p-12 fade-up">
      <h2 className="text-3xl font-display gold-gradient-text text-center">Payment Information</h2>
      <p className="text-center text-cream/70 text-sm mt-2 font-serif">Enter Your Card Details</p>
      <div className="ornate-divider"><span>❖</span></div>

      <CreditCard3D name={name} number={number} expiry={exp} cvv={cvv} flipped={flipped} />

      <form onSubmit={processPayment} className="max-w-xl mx-auto space-y-4 mt-6">
        <Field label="Cardholder Name" value={name} onChange={setName} placeholder="As printed on card" />
        <Field label="Card Number" value={number} onChange={(v) => setNumber(formatNumber(v))} placeholder="0000 0000 0000 0000" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Expiry (MM/YY)" value={exp} onChange={(v) => setExp(formatExp(v))} placeholder="MM/YY" />
          <Field label="CVV" value={cvv} onChange={(v) => setCvv(v.replace(/\D/g, "").slice(0, 3))} placeholder="•••" onFocus={() => setFlipped(true)} onBlur={() => setFlipped(false)} />
        </div>
        <Field label="Mobile Number for Receipt & SMS" value={phone} onChange={setPhone} placeholder="07X XXX XXXX" />

        {error && <div className="text-[var(--crimson)] text-sm text-center font-serif mt-4">{error}</div>}

        <div className="text-center pt-6 flex justify-between items-center">
          <div className="text-left">
            <span className="block text-xs uppercase tracking-widest text-cream/50">Total Amount</span>
            <span className="font-display text-xl gold-gradient-text">{formatLKR(fineDetails?.amount || 0)}</span>
          </div>
          <button disabled={loading} className="metallic-btn crimson-btn">
            {loading ? <Loader2 className="inline animate-spin mr-2" size={18} /> : null}
            {loading ? "Processing..." : "Authorize Payment"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ConfirmStep({ receipt }: { receipt: any }) {
  const receiptTime = new Date(receipt.timestamp).toLocaleString();

  return (
    <div className="ornate-card p-8 md:p-12 text-center fade-up">
      <div className="flex justify-center mb-4">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#C9A84C" strokeWidth="4" />
          <path d="M28 52 L44 68 L72 36" fill="none" stroke="#E8C96C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="80" strokeDashoffset="80" style={{ animation: "drawCheck 0.9s ease 0.2s forwards" }} />
        </svg>
      </div>
      <h2 className="text-4xl font-display gold-gradient-text">Payment Successful</h2>
      <div className="ornate-divider max-w-md mx-auto"><span>✦</span></div>

      <div className="relative max-w-md mx-auto p-6 bg-[var(--cream)] text-[var(--navy-deep)] border-2 border-dashed border-[var(--gold-dark)]">
        <div className="absolute top-4 right-4"><span className="stamp stamp-paid">Paid</span></div>
        <div className="font-display text-lg uppercase tracking-widest mb-4 text-[var(--navy-deep)]">Official Receipt</div>
        <ReceiptRow k="Receipt #" v={receipt.receiptNumber} />
        <ReceiptRow k="Reference" v={receipt.referenceNumber} />
        <ReceiptRow k="Amount Paid" v={formatLKR(receipt.amountPaid)} />
        <ReceiptRow k="Date & Time" v={receiptTime} />
        <ReceiptRow k="Transaction ID" v={receipt.transactionId} />
        <div className="mt-4 text-xs italic">─── ❖ Sri Lanka Police • Traffic Division ❖ ───</div>
      </div>

      <SmsAnim />

      <p className="text-cream/80 mt-6 font-serif max-w-md mx-auto">
        An SMS notification has been successfully dispatched to the issuing traffic officer. You may now proceed to collect your driving licence.
      </p>

      <div className="flex gap-4 justify-center mt-6 flex-wrap">
        <button className="metallic-btn" onClick={() => window.print()}>
          <Download size={16} className="inline mr-2" /> Download Receipt
        </button>
        <Link to="/" className="metallic-btn crimson-btn">
          <Home size={16} className="inline mr-2" /> Return Home
        </Link>
      </div>
    </div>
  );
}

function SmsAnim() {
  return (
    <div className="flex justify-center items-center gap-3 mt-6">
      <div className="relative">
        <Smartphone className="text-[var(--gold-primary)]" size={32} style={{ animation: "phoneShake 0.6s ease 0.3s 2" }} />
        <span className="absolute inset-0 rounded-full border-2 border-[var(--gold-primary)]" style={{ animation: "rippleOut 1.5s ease-out 1.2s infinite" }} />
      </div>
      <span className="font-display tracking-widest text-[var(--gold-light)]">SMS DISPATCHED ✓</span>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, onFocus, onBlur }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; onFocus?: () => void; onBlur?: () => void; }) {
  return (
    <label className="block text-left w-full">
      <span className="block font-display tracking-widest text-xs uppercase text-[var(--gold-primary)] mb-1">{label}</span>
      <input className="typewriter-input w-full" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} onFocus={onFocus} onBlur={onBlur} required />
    </label>
  );
}

function Detail({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between py-2 border-b border-[var(--gold-primary)]/15 last:border-none">
      <span className="font-display tracking-wider text-cream/70 text-sm uppercase">{k}</span>
      <span className={`font-serif ${highlight ? "text-[var(--gold-light)] text-xl font-bold" : "text-cream"}`}>{v}</span>
    </div>
  );
}

function ReceiptRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="font-display uppercase tracking-wider text-[var(--navy-mid)]">{k}</span>
      <span className="font-serif">{v}</span>
    </div>
  );
}