import {
  BadgeCheck,
  BarChart3,
  Boxes,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  ListChecks,
  Receipt,
  ShieldCheck,
  Stethoscope,
  Truck,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useStore } from "../context/Store"
import { modules } from "../data/modules"
import type { ModuleIcon } from "../data/modules"
import { Logo } from "./ui"

const icons: Record<ModuleIcon, LucideIcon> = {
  layout: LayoutDashboard,
  desk: ClipboardList,
  tubes: FlaskConical,
  list: ListChecks,
  badge: BadgeCheck,
  bill: Receipt,
  boxes: Boxes,
  truck: Truck,
  steth: Stethoscope,
  shield: ShieldCheck,
  users: Users,
  chart: BarChart3,
}

export function ConsoleLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { orders, toast, resetDemo, session, signOut } = useStore()
  const review = orders.filter((order) => order.status === "Review").length

  if (session?.role !== "staff") {
    return <Navigate to={`/login?as=staff&next=${encodeURIComponent(pathname)}`} replace />
  }

  return (
    <div className="min-h-screen bg-ivory md:grid md:grid-cols-[250px_1fr]">
      <aside className="border-line bg-foam text-ink md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-r">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/" aria-label="Back to the website">
            <Logo />
          </Link>
        </div>
        <p className="px-5 pb-3 text-[11px] uppercase tracking-[0.16em] text-ink/45">Aurora OS</p>
        <label className="px-4 md:hidden">
          <span className="sr-only">Module</span>
          <select
            className="mb-3 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
            value={modules.some((item) => item.to === pathname) ? pathname : "/console"}
            onChange={(event) => navigate(event.target.value)}
          >
            {modules.map((item) => (
              <option key={item.to} value={item.to}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <nav className="hidden flex-1 space-y-0.5 overflow-auto px-3 pb-4 md:block">
          {modules.map((item) => {
            const Icon = icons[item.icon]
            const active = item.to === "/console" ? pathname === "/console" : pathname.startsWith(item.to)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/console"}
                className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm ${
                  active ? "bg-paper text-ink" : "text-ink/70 hover:bg-paper hover:text-ink"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                {item.to === "/console/validate" && review > 0 && (
                  <span className="rounded-full bg-coral px-1.5 text-[10px] text-white">{review}</span>
                )}
              </NavLink>
            )
          })}
        </nav>
        <div className="hidden border-t border-line px-4 py-4 text-xs text-ink/55 md:block">
          <p>{session.name} · Yanam</p>
          <button type="button" className="mt-2 text-ink/80 underline-offset-2 hover:underline" onClick={resetDemo}>
            Restore sample day
          </button>
          <button type="button" className="mt-2 block text-ink/80 underline-offset-2 hover:underline" onClick={signOut}>
            Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="flex items-center justify-between border-b border-line bg-ivory/70 px-5 py-3 text-sm">
          <p className="text-ink/60">Demonstration data · nothing here is a real patient</p>
          <Link to="/" className="text-teal">
            Patient site
          </Link>
        </div>
        <div className="px-4 py-6 md:px-8">
          <Outlet />
        </div>
      </div>
      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-ivory">
          {toast}
        </div>
      )}
    </div>
  )
}
