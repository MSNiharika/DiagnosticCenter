import { Link, useParams } from "react-router-dom"
import { packages, testById } from "../data/catalog"
import { useStore } from "../context/Store"
import { inr } from "../lib/utils"
import { Button, ButtonLink, Container, Eyebrow, useTitle } from "../components/ui"

export function TestDetail() {
  const { id } = useParams()
  const test = testById(id ?? "")
  const { addTest } = useStore()
  useTitle(test?.name ?? "Test")

  if (!test) {
    return (
      <Container className="py-20">
        <h1 className="font-display text-4xl">That test is not on the menu.</h1>
        <ButtonLink to="/tests" className="mt-6" variant="ink">
          Back to tests
        </ButtonLink>
      </Container>
    )
  }

  const related = packages.filter((item) => item.testIds.includes(test.id)).slice(0, 3)

  return (
    <Container className="py-12">
      <p className="text-sm text-ink/50">
        <Link to="/tests" className="hover:text-ink">Tests</Link> / {test.category}
      </p>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Eyebrow>{test.department}</Eyebrow>
          <h1 className="mt-2 font-display text-5xl tracking-tight">{test.name}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink/70">{test.about}</p>
          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Sample", test.sample],
              ["Report", test.tat],
              ["Code", test.code],
              ["Visit", test.home ? "Home or centre" : "Centre only"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-line bg-paper p-3">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-ink/40">{label}</dt>
                <dd className="mt-1 text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <h2 className="mt-10 font-display text-2xl">Preparation</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink/70">{test.prep}</p>
          <h2 className="mt-8 font-display text-2xl">What is reported</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {test.params.map((param) => (
              <li key={param} className="rounded-full bg-paper px-3 py-1.5 text-sm ring-1 ring-line">
                {param}
              </li>
            ))}
          </ul>
          {related.length > 0 && (
            <>
              <h2 className="mt-10 font-display text-2xl">Often booked inside</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {related.map((item) => (
                  <Link key={item.id} to={`/packages/${item.id}`} className="rounded-2xl border border-line bg-paper p-4 hover:border-ink/20">
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-ink/55">{inr(item.price)}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        <aside className="h-fit rounded-[28px] border border-line bg-paper p-6 lg:sticky lg:top-28">
          <p className="text-xs uppercase tracking-[0.16em] text-ink/40">Price</p>
          <p className="mt-2 font-display text-5xl">{inr(test.price)}</p>
          <p className="text-sm text-ink/40 line-through">{inr(test.mrp)}</p>
          {test.fasting && <p className="mt-4 rounded-2xl bg-sand/70 px-3 py-2 text-sm">Fasting sample.</p>}
          <div className="mt-5 grid gap-2">
            <Button
              onClick={() => {
                addTest(test.id)
              }}
            >
              Add to booking
            </Button>
            <ButtonLink to="/book" variant="ghost">
              Choose a slot
            </ButtonLink>
          </div>
          <p className="mt-4 text-xs leading-5 text-ink/45">
            Adding a test does not reserve a phlebotomist until you confirm a slot. This is a demonstration booking.
          </p>
        </aside>
      </div>
    </Container>
  )
}
