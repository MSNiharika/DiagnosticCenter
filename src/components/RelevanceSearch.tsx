import { useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Activity,
  Baby,
  Bone,
  ChevronRight,
  Droplet,
  FlaskConical,
  Heart,
  HeartPulse,
  Ribbon,
  SunMedium,
  TestTube,
  Thermometer,
  UserRound,
  Utensils,
  Venus,
  Wind,
} from "lucide-react"
import { Link } from "react-router-dom"
import { concerns, testsForConcern } from "../data/concerns"
import { inr } from "../lib/utils"
import { Container } from "./ui"

const icons: Record<string, LucideIcon> = {
  diabetes: Droplet,
  pregnancy: Baby,
  thyroid: Activity,
  liver: FlaskConical,
  prostate: UserRound,
  fertility: Heart,
  bone: Bone,
  gastro: Utensils,
  cervix: Venus,
  heart: HeartPulse,
  kidney: TestTube,
  cancer: Ribbon,
  breast: Heart,
  vitamins: SunMedium,
  anemia: Activity,
  lungs: Wind,
  fever: Thermometer,
}

export function RelevanceSearch() {
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const concern = concerns.find((item) => item.id === active)
  const needle = query.trim().toLowerCase()
  const tests = concern
    ? testsForConcern(concern.id).filter((test) => !needle || test.name.toLowerCase().includes(needle) || test.code.toLowerCase().includes(needle))
    : []

  return (
    <section id="search-by-relevance" className="bg-paper py-14">
      <Container>
        <h2 className="text-center font-display text-4xl tracking-tight">Search by relevance</h2>
        <div className="relative mt-8">
          <div ref={scroller} className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {concerns.map((item) => {
              const Icon = icons[item.id] ?? FlaskConical
              const on = item.id === active
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setActive(item.id)
                    setQuery("")
                  }}
                  className="w-[4.75rem] shrink-0 text-center"
                >
                  <span
                    className={`mx-auto grid h-16 w-16 place-items-center rounded-full bg-foam text-ink ${on ? "ring-2 ring-coral ring-offset-2 ring-offset-paper" : ""}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="mt-2 block text-xs text-ink/80">{item.label}</span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            aria-label="Show more groups"
            className="absolute -right-1 top-3 grid h-10 w-10 place-items-center rounded-full border border-line bg-paper shadow-sm"
            onClick={() => scroller.current?.scrollBy({ left: 320, behavior: "smooth" })}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {concern && (
          <div className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <h3 className="font-display text-3xl tracking-tight sm:w-40">{concern.label}</h3>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tests in this group"
                aria-label={`Search ${concern.label} tests`}
                className="w-full rounded-full border border-ink/20 bg-paper px-5 py-3 text-sm outline-none placeholder:text-ink/40 focus:border-ink"
              />
            </div>
            {tests.length === 0 ? (
              <p className="mt-6 text-sm text-ink/60">No test in {concern.label} matches that word.</p>
            ) : (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tests.map((test) => (
                  <li key={test.id}>
                    <Link
                      to={`/tests/${test.id}`}
                      className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-ink/15 px-4 py-6 text-center transition hover:border-ink"
                    >
                      <span className="text-sm font-medium uppercase tracking-wide">{test.name}</span>
                      <span className="mt-2 text-xs text-ink/50">{inr(test.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Container>
    </section>
  )
}
