import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { tests } from "../data/catalog"
import type { Category } from "../data/types"
import { useStore } from "../context/Store"
import { inr, relevanceScore } from "../lib/utils"
import { Button, Container, Eyebrow, useTitle } from "../components/ui"

const categories: Array<"All" | Category> = ["All", "Pathology", "Radiology", "Cardiology", "Molecular"]
type Sort = "relevance" | "popular" | "price" | "name"

function initialSort(params: URLSearchParams): Sort {
  const value = params.get("sort")
  if (value === "relevance" || value === "popular" || value === "price" || value === "name") return value
  return params.get("q") ? "relevance" : "popular"
}

export function Tests({ preset }: { preset?: "scan" }) {
  useTitle(preset === "scan" ? "Scans & heart" : "Tests")
  const [params] = useSearchParams()
  const { addTest } = useStore()
  const [q, setQ] = useState(params.get("q") ?? "")
  const [category, setCategory] = useState<"All" | Category>(preset === "scan" ? "All" : "All")
  const [fasting, setFasting] = useState(false)
  const [homeOnly, setHomeOnly] = useState(false)
  const [sort, setSort] = useState<Sort>(initialSort(params))

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    let list = tests.filter((test) => {
      if (preset === "scan" && test.category !== "Radiology" && test.category !== "Cardiology") return false
      if (preset !== "scan" && category !== "All" && test.category !== category) return false
      if (fasting && !test.fasting) return false
      if (homeOnly && !test.home) return false
      if (!query) return true
      return (
        test.name.toLowerCase().includes(query) ||
        test.code.toLowerCase().includes(query) ||
        test.department.toLowerCase().includes(query)
      )
    })
    list = [...list].sort((a, b) => {
      if (sort === "price") return a.price - b.price
      if (sort === "name") return a.name.localeCompare(b.name)
      if (sort === "relevance") {
        const diff =
          relevanceScore([b.name, b.code, b.department, b.category], query, Boolean(b.popular)) -
          relevanceScore([a.name, a.code, a.department, a.category], query, Boolean(a.popular))
        return diff || a.name.localeCompare(b.name)
      }
      return Number(b.popular) - Number(a.popular) || a.name.localeCompare(b.name)
    })
    return list
  }, [category, fasting, homeOnly, preset, q, sort])

  return (
    <Container className="py-12">
      <Eyebrow>{preset === "scan" ? "Imaging & cardiology" : "Catalogue"}</Eyebrow>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="max-w-xl font-display text-5xl tracking-tight">
          {preset === "scan" ? "Scans and heart studies, with the prep written down." : "Every test we run, with a price you can see."}
        </h1>
        <p className="max-w-sm text-sm leading-6 text-ink/60">
          {rows.length} results. Home collection is offered only where a sealed kit can travel.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-[24px] border border-line bg-paper p-3 lg:flex-row lg:items-center">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search by name, code, or department"
          aria-label="Filter tests"
          className="w-full rounded-2xl bg-ivory px-4 py-3 text-sm outline-none"
        />
        <div className="flex flex-wrap gap-2">
          <FilterOn label="Fasting" on={fasting} set={setFasting} />
          <FilterOn label="Home visit" on={homeOnly} set={setHomeOnly} />
          {(
            [
              ["relevance", "Search by relevance"],
              ["popular", "Popular"],
              ["price", "Price"],
              ["name", "Name"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={sort === value}
              onClick={() => setSort(value)}
              className={`rounded-full px-3 py-2 text-xs ${sort === value ? "bg-ink text-ivory" : "bg-ivory text-ink/70"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {preset !== "scan" && (
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-3 py-1.5 text-xs ${category === item ? "bg-ink text-ivory" : "bg-paper text-ink/70 ring-1 ring-line"}`}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-[24px] border border-line bg-paper">
        {rows.length === 0 && <p className="p-8 text-sm text-ink/60">Nothing matches. Clear a filter or try a shorter word.</p>}
        <ul>
          {rows.map((test) => (
            <li key={test.id} className="grid gap-3 border-t border-line px-4 py-4 first:border-t-0 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/tests/${test.id}`} className="font-medium hover:text-teal">
                    {test.name}
                  </Link>
                  {test.fasting && <span className="rounded-full bg-sand px-2 py-0.5 text-[10px] uppercase tracking-wide">Fasting</span>}
                  {test.home && <span className="rounded-full bg-foam px-2 py-0.5 text-[10px] uppercase tracking-wide text-teal">Home</span>}
                </div>
                <p className="mt-1 text-sm text-ink/55">
                  {test.code} · {test.department} · {test.sample} · {test.tat}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 md:justify-end">
                <p className="text-right">
                  <span className="font-medium">{inr(test.price)}</span>
                  <span className="ml-2 text-xs text-ink/35 line-through">{inr(test.mrp)}</span>
                </p>
                <Button size="sm" variant="ink" onClick={() => addTest(test.id)}>
                  Add
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}

function FilterOn({ label, on, set }: { label: string; on: boolean; set: (value: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => set(!on)}
      className={`rounded-full px-3 py-2 text-xs ${on ? "bg-teal text-white" : "bg-ivory text-ink/70"}`}
      aria-pressed={on}
    >
      {label}
    </button>
  )
}
