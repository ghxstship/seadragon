import { type ReactNode, type CSSProperties } from "react"

const authThemeVars: CSSProperties & Record<`--${string}`, string> = {
  // Align auth surfaces with landing page palette
  "--background": "#fafafa",
  "--foreground": "#1a1a1a",
  "--text-primary": "#1a1a1a",
  "--text-secondary": "#4a4a4a",
  "--text-muted": "#6b7280",
  "--surface-default": "#ffffff",
  "--surface-hover": "#f5f5f5",
  "--surface-active": "#ececec",
  "--border-default": "#e5e7eb",
  "--border-strong": "#d1d5db",
  "--color-accent-primary": "#e53935",
  "--color-accent-secondary": "#1e88e5",
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="auth-shell min-h-screen bg-[--background] text-[--foreground]"
      style={{
        ...authThemeVars,
        fontFamily: "Share Tech, sans-serif",
      }}
    >
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fff4f3] via-[#f6f7ff] to-[#f1f5ff]" />
        <div className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(229, 57, 53, 0.06), transparent 40%), radial-gradient(circle at 80% 0%, rgba(30, 136, 229, 0.05), transparent 36%)" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
