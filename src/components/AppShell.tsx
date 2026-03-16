"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { LoginGate } from "./LoginGate";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (ready) return;
    const id = setTimeout(() => setTimedOut(true), 5000);
    return () => clearTimeout(id);
  }, [ready]);

  if (!ready && !timedOut) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-n-bg)" }}
      >
        <div aria-hidden style={{
          position: "fixed",
          top: 0, left: "50%", transform: "translateX(-50%)",
          width: "100vw", height: "50vh",
          background: "radial-gradient(ellipse 70% 60% at 50% -10%, var(--color-n-accent-glow) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="flex flex-col items-center gap-6">
          <img src="/logo.svg" alt="Notherc" width={64} height={64} style={{ borderRadius: 18 }} />

          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  background: "var(--color-n-accent)",
                  opacity: 0.7,
                  animationDelay: `${i * 0.18}s`,
                  animationDuration: "0.9s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated) return <LoginGate />;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-n-bg)" }}>
      <main className="max-w-md mx-auto min-h-screen">
        <div className="min-h-screen animate-page">
          {children}
        </div>
      </main>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  if (!PRIVY_APP_ID) {
    return (
      <div className="min-h-screen" style={{ background: "var(--color-n-bg)" }}>
        <main className="max-w-md mx-auto min-h-screen">
          <div className="min-h-screen animate-page">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return <AppShellInner>{children}</AppShellInner>;
}
