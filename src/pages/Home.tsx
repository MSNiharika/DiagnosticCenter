import { useEffect, useState } from "react"
import { ArrowRight, Clock3, FlaskConical, House, ShieldCheck } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { packages, tests } from "../data/catalog"
import { packageWorth } from "../data/catalog"
import { modules } from "../data/modules"
import { centres, doctors, photos } from "../data/network"
import { useStore } from "../context/Store"
import { inr, relevanceScore, slotPassed, SLOT_TIMES, upcomingDays } from "../lib/utils"
import { RelevanceSearch } from "../components/RelevanceSearch"
import { ButtonLink, Container, Eyebrow, Photo, StatusPill, buttonClass, useTitle } from "../components/ui"

const faqs = [
  {
    q: "Do I need to fast?",
    a: "Only if the test says so. Lipid profiles and abdominal ultrasound need fasting. A blood count, thyroid profile, and vitamin D do not. Each test page spells out the preparation.",
  },
  {
    q: "How does home collection work?",
    a: "A phlebotomist arrives in the slot you pick, draws with a sealed kit, and the sample is logged into the same queue as a centre visit. You can watch it move from collected to released.",
  },
  {
    q: "When is the report ready?",
    a: "Routine blood work is reported the same day, often inside six hours of reaching the analyser. MRI, HPV, and vitamin D take longer — the turnaround is on the test.",
  },
  {
    q: "Who signs the report?",
    a: "A pathologist, radiologist, or cardiologist releases it from Aurora OS. Until that release, the patient portal shows tracking, not half a result.",
  },
]

export function Home() {
  useTitle("Home")
  const { city } = useStore()
  const nearby = centres.filter((centre) => centre.city === city)

  return (
    <div>
      <section className="relative overflow-hidden bg-deep text-ink">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_85%_-10%,rgba(196,101,74,0.12),transparent_55%)]" />
        <Container className="relative grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <Eyebrow>Diagnostic network · {city}</Eyebrow>
            <h1 className="mt-4 max-w-xl font-display tracking-tight">
              Same-day answers, from a lab that shows its work.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-ink/70">
              Book blood tests, scans, and full-body checkups. Track the tube from your door to the pathologist. Routine reports land the same day.
            </p>
            <HeroSearch />
            <div className="mt-6 flex flex-wrap gap-2">
              {["Complete Blood Count", "Thyroid Profile", "Vitamin D", "Full body", "MRI"].map((label) => (
                <Link
                  key={label}
                  to={label === "Full body" ? "/packages/executive" : `/tests?q=${encodeURIComponent(label.replace(" Profile", "").replace(" (25-OH)", ""))}`}
                  className="rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink/75 hover:border-ink/40 hover:text-ink"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative">
            <Photo src={photos.lab} alt="Scientist at a brightly lit laboratory bench" className="h-[460px] rounded-[28px] sm:h-[520px]" />
            <LiveSlip />
            <div className="absolute right-3 top-4 rounded-2xl bg-coral px-3 py-2 text-xs text-white shadow-lg">
              Next open slot · {nextSlotLabel()}
            </div>
          </div>
        </Container>
      </section>

      <div className="overflow-hidden border-b border-line bg-paper">
        <div className="animate-marquee flex w-max gap-10 py-3 text-xs uppercase tracking-[0.18em] text-ink/55">
          {Array.from({ length: 2 }).map((_, copy) => (
            <div key={copy} className="flex gap-10 px-5">
              {["NABL", "ISO 15189", "42 centres", "1,200+ tests", "Pathologist on every report", "Home collection before 11", "Critical values called out", "Cold-chain transport"].map((item) => (
                <span key={`${copy}-${item}`}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <RelevanceSearch />

      <section className="py-16">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <Eyebrow>Book in a minute</Eyebrow>
              <h2 className="mt-2 font-display text-4xl tracking-tight">Tests people ask for by name.</h2>
            </div>
            <Link to="/tests" className="hidden items-center gap-1 text-sm text-teal sm:inline-flex">
              Full catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tests.filter((test) => test.popular).slice(0, 4).map((test) => (
              <Link key={test.id} to={`/tests/${test.id}`} className="group rounded-3xl border border-line bg-paper p-5 transition hover:-translate-y-0.5 hover:border-ink/20">
                <p className="text-[11px] uppercase tracking-[0.16em] text-ink/40">{test.department}</p>
                <h3 className="mt-3 font-display text-2xl leading-tight group-hover:text-teal">{test.name}</h3>
                <p className="mt-2 text-sm text-ink/60">{test.tat} · {test.sample}</p>
                <div className="mt-5 flex items-end justify-between">
                  <p>
                    <span className="text-lg font-medium">{inr(test.price)}</span>
                    <span className="ml-2 text-xs text-ink/40 line-through">{inr(test.mrp)}</span>
                  </p>
                  <span className="text-xs text-coral">View</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>Health checkups</Eyebrow>
              <h2 className="mt-2 font-display text-4xl tracking-tight">Packages with the padding taken out.</h2>
            </div>
            <Link to="/packages" className="hidden text-sm text-teal sm:inline">
              Compare all
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {packages.slice(0, 3).map((item) => {
              const save = packageWorth(item) - item.price
              return (
                <article key={item.id} className="relative rounded-[24px] border border-line bg-paper p-5">
                  {item.badge && (
                    <span className="absolute right-4 top-4 rounded-full bg-ink px-2.5 py-1 text-[10px] uppercase tracking-wider text-paper">
                      {item.badge}
                    </span>
                  )}
                  <p className="text-xs uppercase tracking-[0.16em] text-brass">{item.audience}</p>
                  <h3 className="mt-2 font-display text-3xl">{item.name}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-ink/65">{item.summary}</p>
                  <div className="my-4 border-t border-dashed border-sand" />
                  <p className="text-sm text-ink/55">{item.testIds.length} tests · {item.tat}</p>
                  <div className="mt-2 flex items-end justify-between">
                    <p>
                      <span className="font-display text-3xl">{inr(item.price)}</span>
                      <span className="ml-2 text-xs text-ink/40 line-through">{inr(item.mrp)}</span>
                    </p>
                    <p className="text-xs text-teal">Save {inr(save)}</p>
                  </div>
                  <Link to={`/packages/${item.id}`} className={`${buttonClass("ink", "sm")} mt-4`}>
                    See what is included
                  </Link>
                </article>
              )
            })}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-16">
        <Container>
          <Eyebrow>Departments</Eyebrow>
          <h2 className="mt-2 max-w-xl font-display text-4xl tracking-tight">One building. Separate rooms for blood, pictures, and the heart.</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-4 md:grid-rows-2">
            <Dept href="/tests" image={photos.vials} title="Pathology" copy="Haematology, biochemistry, serology, and the counters that never close at lunch." className="md:col-span-2 md:row-span-2 min-h-72" />
            <Dept href="/imaging" image={photos.mri} title="Radiology" copy="MRI, CT, ultrasound, mammography." className="min-h-44 md:col-span-2" />
            <Dept href="/imaging" image={photos.consult} title="Cardiology" copy="ECG, echo, treadmill." className="min-h-44 md:col-span-2" />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <Photo src={photos.bench} alt="Sample tubes in a laboratory rack" className="h-[380px] rounded-[28px]" />
          <div>
            <Eyebrow>Home collection</Eyebrow>
            <h2 className="mt-2 font-display text-4xl tracking-tight">The draw happens at the kitchen table. The lab still sees a barcode.</h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-ink/75">
              <li className="flex gap-3"><House className="mt-0.5 h-4 w-4 shrink-0 text-coral" /> Slots from 7:00 AM. A named phlebotomist, not a pooled cab.</li>
              <li className="flex gap-3"><FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-coral" /> Sealed kit, temperature logger, and the same accession number as a walk-in.</li>
              <li className="flex gap-3"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-coral" /> Free above {inr(500)}. Scans and treadmill tests stay at the centre.</li>
            </ul>
            <ButtonLink to="/collection" className="mt-6">
              Plan a home visit
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="pb-4">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["A name on the report", "Every release is signed by the duty pathologist, radiologist, or cardiologist. Automation files the tube. A person files the opinion."],
              ["Called, not buried", "Critical values are phoned to the referring doctor before the PDF goes out. The portal shows that the call happened."],
              ["Cold chain you can ask about", "Home samples ride in logged boxes. If a tube is warm, it is rejected and redrawn — not quietly run."],
            ].map(([title, copy]) => (
              <article key={title} className="rounded-3xl border border-line bg-paper p-6">
                <ShieldCheck className="h-5 w-5 text-teal" />
                <h3 className="mt-4 font-display text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{copy}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>{city}</Eyebrow>
              <h2 className="mt-2 font-display text-4xl tracking-tight">Centres open this morning.</h2>
            </div>
            <Link to="/centres" className="text-sm text-teal">
              All cities
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {nearby.map((centre) => (
              <Link key={centre.id} to={`/centres/${centre.id}`} className="grid overflow-hidden rounded-3xl border border-line bg-paper sm:grid-cols-[180px_1fr]">
                <Photo src={centre.image} alt="" className="h-36 sm:h-full" />
                <div className="p-5">
                  <h3 className="font-display text-2xl">{centre.name}</h3>
                  <p className="mt-1 text-sm text-ink/60">{centre.address}</p>
                  <p className="mt-3 text-sm">{centre.hours}</p>
                  <p className="mt-2 text-xs text-ink/50">{centre.services.join(" · ")}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-deep py-16 text-ink">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <Eyebrow>Aurora OS</Eyebrow>
              <h2 className="mt-2 font-display tracking-tight">The operating system behind the counter, the cooler, and the centrifuge.</h2>
            </div>
            <ButtonLink to="/console" variant="ink">
              Open today's queue
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {modules.slice(0, 4).map((item, index) => (
              <Link key={item.to} to={item.to} className="rounded-2xl border border-line bg-paper p-4 hover:border-ink/20">
                <p className="text-[11px] text-ink/40">0{index + 1}</p>
                <h3 className="mt-2 font-medium">{item.label}</h3>
                <p className="mt-1 text-sm leading-6 text-ink/65">{item.blurb}</p>
              </Link>
            ))}
          </div>
          <Link to="/platform" className="mt-5 inline-flex text-sm text-ink/70 hover:text-ink">
            All 12 modules
          </Link>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Eyebrow>The people who sign</Eyebrow>
          <h2 className="mt-2 font-display text-4xl">Duty consultants</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((doctor) => (
              <Link key={doctor.id} to="/doctors" className="overflow-hidden rounded-3xl border border-line bg-paper">
                <Photo src={doctor.photo} alt="" className="h-56" />
                <div className="p-4">
                  <h3 className="font-medium">{doctor.name}</h3>
                  <p className="text-sm text-teal">{doctor.role}</p>
                  <p className="mt-1 text-xs text-ink/50">{doctor.centre}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-8">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Before you book</Eyebrow>
            <h2 className="mt-2 font-display text-4xl">Short answers.</h2>
          </div>
          <Faq />
        </Container>
      </section>
    </div>
  )
}

function nextSlotLabel() {
  const day = SLOT_TIMES.every((time) => slotPassed(0, time)) ? 1 : 0
  const time = SLOT_TIMES.find((slot) => !slotPassed(day, slot)) ?? SLOT_TIMES[0]
  return `${upcomingDays(2)[day]} ${time}`
}

function LiveSlip() {
  const { orders } = useStore()
  const list = orders.slice(0, 5)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const order = list[index] ?? list[0]

  useEffect(() => {
    if (paused || list.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % list.length)
    }, 3400)
    return () => window.clearInterval(timer)
  }, [list.length, paused])

  if (!order) return null
  const flags = order.results.filter((row) => row.flag).length
  const visit = order.mode === "Home collection" ? "home draw" : "centre visit"

  return (
    <div
      className="absolute -left-2 bottom-6 w-[min(100%,300px)] sm:-left-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Link
        key={order.id}
        to={`/reports?order=${order.id}`}
        className="slip-in block rounded-2xl border border-white/10 bg-ivory p-4 text-ink shadow-2xl"
      >
        <p className="text-[11px] uppercase tracking-[0.16em] text-brass">Live queue</p>
        <p className="mt-1 font-mono text-sm">{order.id}</p>
        <p className="mt-2 text-sm">
          {order.patient} · {visit}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2 text-xs">
          <StatusPill status={order.status} />
          <span>{flags > 0 ? `${flags} value${flags === 1 ? "" : "s"} to discuss` : order.slot}</span>
        </div>
      </Link>
      <div className="mt-2 flex gap-1.5 px-1">
        {list.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show ${item.id}`}
            onClick={() => setIndex(itemIndex)}
            className={`h-1.5 rounded-full ${itemIndex === index ? "w-5 bg-ink" : "w-1.5 bg-ink/30"}`}
          />
        ))}
      </div>
    </div>
  )
}

function HeroSearch() {
  const [q, setQ] = useState("")
  const navigate = useNavigate()
  const query = q.trim().toLowerCase()
  const matches =
    query.length < 1
      ? []
      : [
          ...tests
            .map((test) => ({
              to: `/tests/${test.id}`,
              label: test.name,
              hint: inr(test.price),
              score: relevanceScore([test.name, test.code, test.department, test.category], query, Boolean(test.popular)),
            }))
            .filter((item) => item.score > 0),
          ...packages
            .map((item) => ({
              to: `/packages/${item.id}`,
              label: item.name,
              hint: "Package",
              score: relevanceScore([item.name, item.audience, item.summary], query),
            }))
            .filter((item) => item.score > 0),
        ]
          .sort((a, b) => b.score - a.score)
          .slice(0, 6)

  return (
    <form
      className="relative mt-8"
      onSubmit={(event) => {
        event.preventDefault()
        navigate(`/tests?q=${encodeURIComponent(q.trim())}&sort=relevance`)
      }}
    >
      <div className="flex flex-col gap-2 rounded-[28px] bg-ivory p-1.5 sm:flex-row sm:items-center sm:rounded-full">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search a test, scan, or package"
          aria-label="Search tests"
          className="w-full bg-transparent px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink/40"
        />
        <button type="submit" className={buttonClass("coral")}>
          Search by relevance
        </button>
      </div>
      {matches.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-paper text-ink shadow-xl">
          {matches.map((match) => (
            <Link key={match.to} to={match.to} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-ivory">
              <span>{match.label}</span>
              <span className="text-xs text-ink/45">{match.hint}</span>
            </Link>
          ))}
        </div>
      )}
    </form>
  )
}

function Dept({
  href,
  image,
  title,
  copy,
  className,
}: {
  href: string
  image: string
  title: string
  copy: string
  className?: string
}) {
  return (
    <Link to={href} className={`group relative overflow-hidden rounded-[24px] ${className ?? ""}`}>
      <Photo src={image} alt="" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
      <div className="absolute bottom-0 p-5 text-ivory">
        <h3 className="font-display text-3xl">{title}</h3>
        <p className="mt-1 max-w-xs text-sm text-ivory/75">{copy}</p>
      </div>
    </Link>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((item, index) => {
        const active = open === index
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between py-4 text-left"
              aria-expanded={active}
              onClick={() => setOpen(active ? -1 : index)}
            >
              <span className="font-medium">{item.q}</span>
              <span className="text-coral">{active ? "–" : "+"}</span>
            </button>
            {active && <p className="pb-4 text-sm leading-6 text-ink/70">{item.a}</p>}
          </div>
        )
      })}
    </div>
  )
}
