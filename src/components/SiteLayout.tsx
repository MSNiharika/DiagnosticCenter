import { useEffect, useState } from "react"
import { ChevronDown, Menu, Phone, ShoppingBag, X } from "lucide-react"
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import { centrePhone, centrePhoneTel, cities } from "../data/network"
import { useStore } from "../context/Store"
import { inr } from "../lib/utils"
import { SocialLinks } from "./SocialLinks"
import { ButtonLink, Container, Logo, buttonClass } from "./ui"

const links = [
  { to: "/tests", label: "Tests" },
  { to: "/packages", label: "Packages" },
  { to: "/imaging", label: "Scans" },
  { to: "/collection", label: "Home collection" },
  { to: "/centres", label: "Centres" },
  { to: "/reports", label: "Reports" },
  { to: "/about", label: "About" },
]

export function SiteLayout() {
  const { city, setCity, cart, cartTotal, removeItem, toast, session, signOut } = useStore()
  const [open, setOpen] = useState(false)
  const [bag, setBag] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [menuLogin, setMenuLogin] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
    setBag(false)
    setCityOpen(false)
    setMenuLogin(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open || bag ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open, bag])

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-white shadow-[0_1px_0_rgba(18,38,58,0.04)]">
        <div className="hidden border-b border-line bg-foam sm:block">
          <Container className="flex h-9 items-center justify-end gap-5">
            <div className="relative">
              <button type="button" className="nav-link inline-flex items-center gap-1" onClick={() => setCityOpen((value) => !value)}>
                {city}
                <ChevronDown className="h-3 w-3" />
              </button>
              {cityOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-md border border-line bg-paper p-1 text-ink shadow-lg">
                  {cities.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-foam"
                      onClick={() => {
                        setCity(item)
                        setCityOpen(false)
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a href={`tel:${centrePhoneTel}`} className="nav-link inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-teal" /> {centrePhone}
            </a>
            <SessionLinks session={session} signOut={signOut} />
          </Container>
        </div>
        <Container className="flex h-16 items-center gap-2">
          <Link to="/" aria-label="Aurora Diagnostics home" className="shrink-0">
            <Logo />
          </Link>
          <nav className="site-nav-desktop" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `site-nav-item${isActive ? " is-active" : ""}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-md border border-line bg-white"
              aria-label={`Booking list, ${cart.length} items`}
              onClick={() => setBag(true)}
            >
              <ShoppingBag className="h-4 w-4" />
              {cart.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-coral px-1 text-[9px] font-bold text-white">
                  {cart.length}
                </span>
              )}
            </button>
            <Link to="/book" className={`${buttonClass("coral", "sm")} hidden sm:inline-flex`}>
              Book a test
            </Link>
            <button type="button" className="grid h-10 w-10 place-items-center rounded-md border border-line lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </Container>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <div className="mt-16 border-t border-line bg-white">
        <Container className="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <p className="text-sm text-ink/70">Follow Aurora</p>
          <SocialLinks />
        </Container>
      </div>
      <footer className="bg-ink text-white">
        <Container className="grid gap-10 py-14 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">
              A new diagnostic centre in Yanam. Blood tests, ultrasound, X-ray, and ECG, with home collection across town.
            </p>
            <a href={`tel:${centrePhoneTel}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
              <Phone className="h-4 w-4" /> {centrePhone}
            </a>
          </div>
          <FooterCol
            title="Book"
            items={[
              ["/tests", "Lab tests"],
              ["/packages", "Health packages"],
              ["/imaging", "Scans & heart"],
              ["/collection", "Home collection"],
              ["/prescription", "Upload a prescription"],
            ]}
          />
          <FooterCol
            title="Care"
            items={[
              ["/reports", "Report portal"],
              ["/centres", "Centres"],
              ["/doctors", "Doctors"],
              ["/corporate", "Corporate wellness"],
              ["/contact", "Contact"],
            ]}
          />
          <FooterCol
            title="The lab"
            items={[
              ["/about", "About Aurora"],
              ["/about#journey", "Our journey"],
              ["/about#equipment", "Equipment"],
              ["/about#quality", "Quality"],
              ["/about#awards", "Awards"],
              ["/platform", "Aurora OS"],
              ["/register", "Register"],
              ["/login", "Patient login"],
              ["/login?as=staff", "Staff login"],
            ]}
          />
        </Container>
        <div className="border-t border-white/15">
          <Container className="flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:justify-between">
            <p>Demonstration interface. Sample patients, prices, and reports. Not a medical service.</p>
            <p>© {new Date().getFullYear()} Aurora Diagnostics</p>
          </Container>
        </div>
      </footer>

      {open && (
        <div className="fixed inset-0 z-[60] bg-ivory text-ink lg:hidden">
          <Container className="flex h-16 items-center justify-between">
            <Logo />
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X />
            </button>
          </Container>
          <Container className="grid gap-3 pt-6">
            <div className="flex flex-wrap gap-2">
              {cities.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`rounded-full px-3 py-1 text-xs ${city === item ? "bg-ink text-ivory" : "bg-sand text-ink"}`}
                  onClick={() => setCity(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="border-b border-line py-2 text-base font-semibold">
                {link.label}
              </Link>
            ))}
            <Link to="/corporate" className="border-b border-line py-2 text-base font-semibold">
              Corporate
            </Link>
            <Link to="/about#journey" className="border-b border-line py-2 text-base font-semibold">
              Our journey
            </Link>
            <Link to="/about#equipment" className="border-b border-line py-2 text-base font-semibold">
              Equipment
            </Link>
            <a href={`tel:${centrePhoneTel}`} className="border-b border-line py-2 text-base font-semibold">
              {centrePhone}
            </a>
            <button type="button" className="border-b border-line py-2 text-left text-base font-semibold" aria-expanded={menuLogin} onClick={() => setMenuLogin((value) => !value)}>
              Login
            </button>
            {menuLogin && (
              <div className="grid gap-2 pl-1">
                <Link to="/login" className="text-lg text-ink/70">
                  Patient
                </Link>
                <Link to="/register" className="text-lg text-ink/70">
                  Register
                </Link>
                <Link to="/login?as=staff" className="text-lg text-ink/70">
                  Staff
                </Link>
              </div>
            )}
            <ButtonLink to="/book" className="mt-4 w-fit">
              Book a test
            </ButtonLink>
          </Container>
        </div>
      )}

      {bag && (
        <div className="fixed inset-0 z-[60]">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close booking list" onClick={() => setBag(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-2xl">Your booking</h2>
              <button type="button" aria-label="Close" onClick={() => setBag(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-auto px-5 py-4">
              {cart.length === 0 && <p className="text-sm text-ink/60">Nothing here yet. Add a test or a package.</p>}
              {cart.map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-3 rounded-2xl border border-line bg-paper p-3">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-ink/50">{item.kind === "package" ? "Package" : "Test"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{inr(item.price)}</p>
                    <button type="button" className="text-xs text-coral" onClick={() => removeItem(item.key)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-line px-5 py-4">
              <div className="mb-3 flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{inr(cartTotal)}</span>
              </div>
              <Link to="/book" className={buttonClass("coral")} onClick={() => setBag(false)}>
                Continue to slots
              </Link>
            </div>
          </aside>
        </div>
      )}

      {toast && (
        <div role="status" className="no-print fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-ivory shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

function SessionLinks({
  session,
  signOut,
}: {
  session: { role: "patient"; name: string; phone: string } | { role: "staff"; name: string } | null
  signOut: () => void
}) {
  if (session) {
    return (
      <>
        <Link to={session.role === "staff" ? "/console" : "/profile"} className="nav-link">
          {session.role === "staff" ? "Console" : session.name.split(" ")[0]}
        </Link>
        <button type="button" className="nav-link" onClick={signOut}>
          Sign out
        </button>
      </>
    )
  }
  return (
    <div className="group relative">
      <button type="button" className="nav-link" aria-haspopup="menu">
        Login
      </button>
      <div className="invisible absolute right-0 top-full z-50 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div role="menu" className="w-52 rounded-md border border-line bg-paper p-1 text-ink shadow-lg">
          <Link role="menuitem" to="/login" className="block rounded px-3 py-2 text-left text-sm hover:bg-foam">
            Patient login
          </Link>
          <Link role="menuitem" to="/register" className="block rounded px-3 py-2 text-left text-sm hover:bg-foam">
            Register
          </Link>
          <Link role="menuitem" to="/login?as=staff" className="block rounded px-3 py-2 text-left text-sm hover:bg-foam">
            Staff login
          </Link>
        </div>
      </div>
    </div>
  )
}

function FooterCol({ title, items }: { title: string; items: string[][] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-white/80">
        {items.map(([to, label]) => (
          <li key={label}>
            <Link to={to} className="hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
