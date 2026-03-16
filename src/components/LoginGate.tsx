"use client";

import { useState } from "react";
import { useLoginWithEmail, usePrivy } from "@privy-io/react-auth";
import { TWITTER_URL } from "@/lib/constants";

type Step = "entry" | "otp";

export function LoginGate() {
  const { login } = usePrivy();
  const { sendCode, loginWithCode, state } = useLoginWithEmail();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("entry");
  const [error, setError] = useState("");

  const isLoading =
    state.status === "sending-code" || state.status === "submitting-code";

  async function handleSendCode() {
    setError("");
    if (!email.includes("@")) { setError("Enter a valid email address."); return; }
    try { await sendCode({ email }); setStep("otp"); }
    catch { setError("Failed to send code. Try again."); }
  }

  async function handleVerify() {
    setError("");
    if (otp.length < 6) { setError("Enter the 6-digit code."); return; }
    try { await loginWithCode({ code: otp }); }
    catch { setError("Invalid code. Check your inbox and try again."); }
  }

  return (
    <div
      className="min-h-screen flex flex-col px-5"
      style={{ background: "var(--color-n-bg)" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0, left: "50%", transform: "translateX(-50%)",
          width: "100vw", height: "50vh",
          background: "radial-gradient(ellipse 70% 60% at 50% -10%, var(--color-n-accent-glow) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="relative mb-8">
          <div
            style={{
              position: "absolute", inset: "-10px",
              borderRadius: "32px",
              background: "radial-gradient(circle, var(--color-n-accent-glow) 0%, transparent 70%)",
            }}
          />
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 72, height: 72,
              background: "linear-gradient(135deg, var(--color-n-accent) 0%, var(--color-n-accent-dim) 100%)",
              borderRadius: 20,
              boxShadow: "0 8px 32px var(--color-n-accent-glow)",
            }}
          >
            <span
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#000",
                letterSpacing: "-0.04em",
                fontStyle: "italic",
              }}
            >
              N
            </span>
          </div>
        </div>

        <h1
          className="text-4xl font-black tracking-tight mb-2"
          style={{ color: "var(--color-n-text)", letterSpacing: "-0.03em" }}
        >
          Notherc
        </h1>
        <p className="text-base mb-8 text-center" style={{ color: "var(--color-n-muted)" }}>
          Your on-chain savings account
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["Up to 8% APY", "No lock-up", "Non-custodial"].map((f) => (
            <span
              key={f}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{
                background: "var(--color-n-card)",
                border: "1px solid var(--color-n-border)",
                color: "var(--color-n-muted)",
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Auth card */}
        <div
          className="w-full rounded-3xl p-6"
          style={{
            background: "var(--color-n-surface)",
            border: "1px solid var(--color-n-border)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
          }}
        >
          {step === "entry" ? (
            <>
              <p className="text-lg font-bold mb-1" style={{ color: "var(--color-n-text)" }}>
                Get started
              </p>
              <p className="text-sm mb-5" style={{ color: "var(--color-n-muted)" }}>
                No seed phrase. No wallet required to begin.
              </p>

              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                className="w-full rounded-2xl px-4 py-3.5 text-base mb-3 outline-none"
                style={{
                  background: "var(--color-n-card)",
                  border: `1.5px solid ${error ? "#EF4444" : "var(--color-n-border)"}`,
                  color: "var(--color-n-text)",
                  fontFamily: "inherit",
                }}
              />
              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

              <button
                onClick={handleSendCode}
                disabled={isLoading || !email}
                className="w-full py-3.5 rounded-2xl font-bold text-base disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, var(--color-n-accent) 0%, var(--color-n-accent-dim) 100%)",
                  color: "#000",
                  boxShadow: "0 4px 20px var(--color-n-accent-glow)",
                }}
              >
                {isLoading ? "Sending…" : "Continue with Email"}
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px" style={{ background: "var(--color-n-border)" }} />
                <span className="text-xs" style={{ color: "var(--color-n-muted)" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "var(--color-n-border)" }} />
              </div>

              {/* Wallet login via Privy — wallet-only modal, no email shown */}
              <button
                onClick={() => login({ loginMethods: ["wallet"] })}
                className="w-full py-3.5 rounded-2xl font-semibold text-base border flex items-center justify-center gap-2.5"
                style={{
                  borderColor: "var(--color-n-border)",
                  color: "var(--color-n-text)",
                  background: "var(--color-n-card)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5" />
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
                Connect Wallet
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setStep("entry"); setOtp(""); setError(""); }}
                className="flex items-center gap-1.5 text-sm mb-5"
                style={{ color: "var(--color-n-muted)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back
              </button>
              <p className="text-lg font-bold mb-1" style={{ color: "var(--color-n-text)" }}>
                Check your inbox
              </p>
              <p className="text-sm mb-5" style={{ color: "var(--color-n-muted)" }}>
                We sent a 6-digit code to{" "}
                <span style={{ color: "var(--color-n-accent)" }}>{email}</span>
              </p>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                className="w-full rounded-2xl px-4 py-4 text-3xl text-center mb-3 outline-none"
                style={{
                  background: "var(--color-n-card)",
                  border: `1.5px solid ${error ? "#EF4444" : otp.length === 6 ? "var(--color-n-accent)" : "var(--color-n-border)"}`,
                  color: "var(--color-n-text)",
                  letterSpacing: "0.4em",
                  fontFamily: "monospace",
                  transition: "border-color 0.15s ease",
                }}
              />
              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

              <button
                onClick={handleVerify}
                disabled={isLoading || otp.length < 6}
                className="w-full py-3.5 rounded-2xl font-bold text-base disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, var(--color-n-accent) 0%, var(--color-n-accent-dim) 100%)",
                  color: "#000",
                  boxShadow: otp.length === 6 ? "0 4px 20px var(--color-n-accent-glow)" : "none",
                  transition: "box-shadow 0.2s ease",
                }}
              >
                {isLoading ? "Verifying…" : "Verify and Sign In"}
              </button>

              <button
                onClick={handleSendCode}
                className="w-full mt-3 py-2 text-sm text-center"
                style={{ color: "var(--color-n-muted)" }}
              >
                Resend code
              </button>
            </>
          )}
        </div>

        {/* Trust note */}
        <p className="text-xs text-center mt-5 px-2" style={{ color: "var(--color-n-muted)" }}>
          Non-custodial. ERC-4626 on Base.{" "}
          <span style={{ color: "var(--color-n-accent)" }}>Powered by YO Protocol SDK</span>
        </p>

        {/* Twitter */}
        <a
          href={TWITTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 mt-4 text-xs"
          style={{ color: "var(--color-n-muted)" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.622 5.905-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          @nothercxyz
        </a>
      </div>
    </div>
  );
}
