import { useState } from "react"
import { Link } from "react-router-dom"
import { packageById, packages, packageWorth } from "../data/catalog"
import { useStore } from "../context/Store"
import { inr } from "../lib/utils"
import { Button, Container, Eyebrow, useTitle } from "../components/ui"

const ages = ["Under 30", "30–45", "46–60", "60+"]
const goals = ["Routine", "Diabetes", "Heart", "Women", "Executive"]

function recommend(age: string, goal: string) {
  if (goal === "Heart") return "heart"
  if (goal === "Diabetes") return "diabetes"
  if (goal === "Women") return "women"
  if (goal === "Executive") return "executive"
  if (age === "60+") return "senior"
  return "essential"
}

export function Packages() {
  useTitle("Health packages")
  const { addPackage } = useStore()
  const [age, setAge] = useState(ages[1])
  const [goal, setGoal] = useState(goals[0])
  const pick = packageById(recommend(age, goal))

  return (
    <Container className="py-12">
      <Eyebrow>Health checkups</Eyebrow>
      <h1 className="mt-2 max-w-2xl font-display text-5xl tracking-tight">A package should name the tests, not hide them.</h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-ink/65">
        Prices are the package price. The crossed figure is the sum of booking each test alone. Fasting is marked when any included test needs it.
      </p>

      <div className="mt-8 rounded-[28px] border border-line bg-deep p-6 text-ink md:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-ink/50">Not sure where to start</p>
        <h2 className="mt-2 font-display text-3xl">Three taps, one suggestion.</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Chooser label="Age" options={ages} value={age} onChange={setAge} />
          <Chooser label="What you want watched" options={goals} value={goal} onChange={setGoal} />
        </div>
        {pick && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-paper p-4">
            <div>
              <p className="text-xs text-ink/50">We would book</p>
              <p className="font-display text-2xl">{pick.name}</p>
              <p className="text-sm text-ink/70">{pick.summary}</p>
            </div>
            <Link to={`/packages/${pick.id}`} className="rounded-full bg-ink px-4 py-2 text-sm text-paper">
              {inr(pick.price)} · open
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {packages.map((item) => {
          const save = packageWorth(item) - item.price
          return (
            <article key={item.id} className="flex flex-col rounded-[28px] border border-line bg-paper p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-brass">{item.audience}</p>
                  <h2 className="mt-1 font-display text-3xl">{item.name}</h2>
                </div>
                {item.badge && <span className="rounded-full bg-sand px-2.5 py-1 text-[10px] uppercase tracking-wider">{item.badge}</span>}
              </div>
              <p className="mt-3 text-sm leading-6 text-ink/65">{item.summary}</p>
              <p className="mt-4 text-sm text-ink/55">
                {item.testIds.length} tests · {item.tat}
                {item.fasting ? " · fasting" : " · no fasting"}
              </p>
              <div className="mt-auto flex items-end justify-between pt-5">
                <div>
                  <p className="font-display text-4xl">{inr(item.price)}</p>
                  <p className="text-xs text-ink/40">
                    <span className="line-through">{inr(item.mrp)}</span>
                    <span className="ml-2 text-teal">Save {inr(save)}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => addPackage(item.id)}>
                    Add
                  </Button>
                  <Link to={`/packages/${item.id}`} className="rounded-full bg-ink px-3.5 py-1.5 text-xs text-ivory">
                    Details
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </Container>
  )
}

function Chooser({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <p className="text-xs text-ink/50">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full px-3 py-1.5 text-xs ${value === option ? "bg-ink text-paper" : "bg-paper text-ink"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
