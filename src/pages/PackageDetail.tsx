import { Link, useParams } from "react-router-dom"
import { packageById, packageWorth, testById } from "../data/catalog"
import { useStore } from "../context/Store"
import { inr } from "../lib/utils"
import { Button, ButtonLink, Container, Eyebrow, useTitle } from "../components/ui"

export function PackageDetail() {
  const { id } = useParams()
  const item = packageById(id ?? "")
  const { addPackage } = useStore()
  useTitle(item?.name ?? "Package")

  if (!item) {
    return (
      <Container className="py-20">
        <h1 className="font-display text-4xl">That package has been retired.</h1>
        <ButtonLink to="/packages" variant="ink" className="mt-6">
          All packages
        </ButtonLink>
      </Container>
    )
  }

  const worth = packageWorth(item)

  return (
    <Container className="py-12">
      <p className="text-sm text-ink/50">
        <Link to="/packages">Packages</Link> / {item.name}
      </p>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Eyebrow>{item.audience}</Eyebrow>
          <h1 className="mt-2 font-display text-5xl tracking-tight">{item.name}</h1>
          <p className="mt-4 max-w-xl leading-7 text-ink/70">{item.summary}</p>
          <ul className="mt-8 divide-y divide-line rounded-[24px] border border-line bg-paper">
            {item.testIds.map((testId) => {
              const test = testById(testId)
              if (!test) return null
              return (
                <li key={testId} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <Link to={`/tests/${test.id}`} className="text-sm font-medium hover:text-teal">
                      {test.name}
                    </Link>
                    <p className="text-xs text-ink/45">
                      {test.sample} · {test.tat}
                      {test.fasting ? " · fasting" : ""}
                    </p>
                  </div>
                  <span className="text-sm text-ink/50">{inr(test.price)}</span>
                </li>
              )
            })}
          </ul>
        </div>
        <aside className="h-fit rounded-[28px] border border-line bg-deep p-6 text-ink lg:sticky lg:top-28">
          <p className="text-xs uppercase tracking-[0.16em] text-ink/50">Package price</p>
          <p className="mt-2 font-display text-4xl">{inr(item.price)}</p>
          <p className="mt-1 text-sm text-ink/60">
            Tests alone would be {inr(worth)}. You keep {inr(worth - item.price)}.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-ink/75">
            <li>{item.testIds.length} reported tests</li>
            <li>{item.fasting ? "Come fasting" : "No fasting required"}</li>
            <li>Report in {item.tat.toLowerCase()}</li>
          </ul>
          <Button className="mt-6 w-full" variant="ink" onClick={() => addPackage(item.id)}>
            Add package
          </Button>
          <ButtonLink to="/book" variant="coral" className="mt-2 w-full">
            Pick a slot
          </ButtonLink>
        </aside>
      </div>
    </Container>
  )
}
