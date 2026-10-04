import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Activity,
  Baby,
  Bone,
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
        <h2>Find tests by health concern</h2>
        <p className="mt-1 text-sm text-ink/60">Choose a concern to see the tests we run for it, with the price on each card.</p>
        <div className="relative mt-6">
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
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
                  className="text-center"
                >
                  <span
                    className={`mx-auto grid h-14 w-14 place-items-center rounded-md border bg-white text-teal ${on ? "border-teal bg-foam" : "border-line"}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="mt-2 block text-xs text-ink/80">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {concern && (
          <div className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <h3 className="text-lg sm:w-40">{concern.label}</h3>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter tests in this group"
                aria-label={`Search ${concern.label} tests`}
                className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm outline-none placeholder:text-ink/40 focus:border-teal"
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
                      className="flex items-center justify-between gap-3 rounded-md border border-line bg-white px-4 py-3 hover:border-teal"
                    >
                      <span className="text-left text-sm font-semibold">{test.name}</span>
                      <span className="shrink-0 text-sm font-bold text-teal">{inr(test.price)}</span>
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
