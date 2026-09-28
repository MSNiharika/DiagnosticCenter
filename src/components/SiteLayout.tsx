import { useEffect, useState } from "react"
import { Menu, Phone, ShoppingBag, X } from "lucide-react"
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import { cities } from "../data/network"
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
]

export function SiteLayout() {
  const { city, setCity, cart, cartTotal, removeItem, toast, session, signOut } = useStore()
  const [open, setOpen] = useState(false)
  const [bag, setBag] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [menuLogin, setMenuLogin] = useState(false)
  const [progress, setProgress] = useState(0)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
    setBag(false)
    setCityOpen(false)
    setMenuLogin(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
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
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
        <div className="site-nav-bar">
          <Link to="/" className="site-logo" aria-label="Aurora Diagnostics home">
            <span className="site-logo-mark" aria-hidden>
              A
            </span>
            <span className="site-logo-name">Aurora</span>
          </Link>
          <span className="site-nav-split" aria-hidden />
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
          <div className="ml-auto hidden items-center gap-3 xl:flex">
            <div className="relative">
              <button type="button" className="nav-link" onClick={() => setCityOpen((value) => !value)}>
                {city}
              </button>
              {cityOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-2xl border border-line bg-paper p-1.5 text-ink shadow-xl">
                  {cities.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="block w-full rounded-xl px-3 py-2 text-left text-sm normal-case tracking-normal hover:bg-ivory"
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
            <a href="tel:18004202244" className="nav-link inline-flex items-center gap-1">
              <Phone className="h-3 w-3" /> 1800 420 2244
            </a>
            {session ? (
              <>
                <Link to={session.role === "staff" ? "/console" : "/reports"} className="nav-link">
                  {session.role === "staff" ? "Console" : session.name.split(" ")[0]}
                </Link>
                <button type="button" className="nav-link" onClick={signOut}>
                  Sign out
                </button>
              </>
            ) : (
              <div className="group relative">
                <button type="button" className="nav-link" aria-haspopup="menu">
                  Login
                </button>
                <div className="invisible absolute right-0 top-full z-50 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div role="menu" className="w-52 rounded-2xl border border-line bg-paper p-1.5 text-ink shadow-xl">
                    <Link role="menuitem" to="/login" className="block rounded-xl px-3 py-2 text-left text-sm normal-case tracking-normal hover:bg-ivory">
                      Patient
                    </Link>
                    <Link role="menuitem" to="/login?as=staff" className="block rounded-xl px-3 py-2 text-left text-sm normal-case tracking-normal hover:bg-ivory">
                      Staff
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            className="relative ml-2 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15"
            aria-label={`Booking list, ${cart.length} items`}
            onClick={() => setBag(true)}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-coral px-1 text-[9px] text-ivory">
                {cart.length}
              </span>
            )}
          </button>
          <Link to="/book" className="site-nav-enquire">
            Book
          </Link>
          <button type="button" className="site-nav-menu" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="mr-1 h-3.5 w-3.5" /> Menu
          </button>
          <span className="site-nav-progress" style={{ transform: `scaleX(${progress})` }} />
        </div>
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
      <footer className="bg-deep text-ink">
        <Container className="grid gap-10 py-14 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-ink/70">
              A diagnostic network for blood tests, scans, and heart studies — and the operating system the lab runs on.
            </p>
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
              ["/platform", "Aurora OS"],
              ["/login", "Patient login"],
              ["/login?as=staff", "Staff login"],
            ]}
          />
        </Container>
        <div className="border-t border-line">
          <Container className="flex flex-col gap-2 py-5 text-xs text-ink/50 sm:flex-row sm:justify-between">
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
              <Link key={link.to} to={link.to} className="font-display text-2xl">
                {link.label}
              </Link>
            ))}
            <Link to="/corporate" className="font-display text-2xl">
              Corporate
            </Link>
            <Link to="/about" className="font-display text-2xl">
              About
            </Link>
            <button type="button" className="text-left font-display text-2xl" aria-expanded={menuLogin} onClick={() => setMenuLogin((value) => !value)}>
              Login
            </button>
            {menuLogin && (
              <div className="grid gap-2 pl-1">
                <Link to="/login" className="text-lg text-ink/70">
                  Patient
                </Link>
                <Link to="/login?as=staff" className="text-lg text-ink/70">
                  Staff
                </Link>
              </div>
            )}
            <ButtonLink to="/book" variant="ink" className="mt-4 w-fit">
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

function FooterCol({ title, items }: { title: string; items: string[][] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-ink/45">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-ink/75">
        {items.map(([to, label]) => (
          <li key={label}>
            <Link to={to} className="hover:text-ink">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
