import { useEffect, useState } from "react"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Link } from "react-router-dom"
import type { OrderStatus } from "../data/types"
import { cn } from "../lib/utils"

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title === "Home" ? "Aurora Diagnostics" : `${title} · Aurora Diagnostics`
  }, [title])
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1180px] px-5", className)}>{children}</div>
}

const buttonStyles = {
  coral: "bg-coral text-white hover:bg-[color-mix(in_srgb,var(--color-coral)_82%,black)]",
  ink: "bg-ink text-ivory hover:bg-pine",
  ghost: "border border-ink/15 bg-transparent text-ink hover:border-ink/30 hover:bg-paper",
  light: "bg-ivory text-ink hover:bg-white",
  foam: "bg-foam text-ink hover:bg-sand",
} as const

export function buttonClass(variant: keyof typeof buttonStyles = "coral", size: "sm" | "md" = "md") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
    size === "sm" ? "px-3.5 py-1.5 text-xs" : "px-5 py-2.5 text-sm",
    buttonStyles[variant],
  )
}

export function Button({
  variant = "coral",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonStyles
  size?: "sm" | "md"
}) {
  return <button className={cn(buttonClass(variant, size), className)} {...props} />
}

export function ButtonLink({
  to,
  variant = "coral",
  size = "md",
  className,
  children,
}: {
  to: string
  variant?: keyof typeof buttonStyles
  size?: "sm" | "md"
  className?: string
  children: ReactNode
}) {
  return (
    <Link to={to} className={cn(buttonClass(variant, size), className)}>
      {children}
    </Link>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 36 36" className="h-9 w-9 shrink-0" aria-hidden>
        <rect width="36" height="36" rx="11" fill={light ? "var(--color-paper)" : "var(--color-ink)"} />
        <path
          d="M7 23c3.6-7 7-9.2 11-9.2S25.4 16 29 23"
          fill="none"
          stroke={light ? "var(--color-ink)" : "var(--color-paper)"}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="18" cy="13.2" r="2.1" fill="var(--color-coral)" />
      </svg>
      <span className="leading-none">
        <span className={cn("block font-display text-[1.35rem] tracking-tight", light ? "text-ivory" : "text-ink")}>
          Aurora
        </span>
        <span
          className={cn(
            "mt-0.5 block text-[10px] uppercase tracking-[0.22em]",
            light ? "text-ivory/70" : "text-ink/50",
          )}
        >
          Diagnostics
        </span>
      </span>
    </span>
  )
}

export function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(true)
  return (
    <div className={cn("relative overflow-hidden bg-pine", className)}>
      {ok ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setOk(false)}
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--color-pine),transparent_42%),linear-gradient(160deg,var(--color-pine),var(--color-deep))]" />
      )}
    </div>
  )
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={cn("text-xs font-medium uppercase tracking-[0.18em]", light ? "text-ivory/70" : "text-brass")}>
      {children}
    </p>
  )
}

export function StatusPill({ status }: { status: OrderStatus | string }) {
  const tone =
    status === "Released" || status === "In control" || status === "Dropped at lab" || status === "On floor"
      ? "bg-foam text-ink"
      : status === "Review" || status === "Urgent" || status === "Warning" || status === "Leave"
        ? "bg-coral/10 text-coral"
        : status === "Processing" || status === "En route" || status === "Collected"
          ? "bg-sand text-ink"
          : "bg-sand/80 text-ink/70"
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium", tone)}>{status}</span>
}

export const inputClass =
  "w-full rounded-2xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-teal"

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ink/45">{label}</span>
      {children}
    </label>
  )
}

export function Flag({ flag }: { flag?: "H" | "L" }) {
  if (!flag) return null
  return (
    <span className={cn("ml-2 text-[11px] font-semibold", flag === "H" ? "text-coral" : "text-brass")}>
      {flag === "H" ? "HIGH" : "LOW"}
    </span>
  )
}
