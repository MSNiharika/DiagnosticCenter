import { useEffect, useState } from "react"
import { ArrowRight, Clock3, FileText, FlaskConical, House, MapPin, ScanLine, ShieldCheck, Stethoscope } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { packages, tests } from "../data/catalog"
import { packageWorth } from "../data/catalog"
import { modules } from "../data/modules"
import { centres, doctors, photos } from "../data/network"
import { useStore } from "../context/Store"
import { inr, relevanceScore, slotPassed, SLOT_TIMES, upcomingDays } from "../lib/utils"
import { RelevanceSearch } from "../components/RelevanceSearch"
import { ButtonLink, Container, Eyebrow, Photo, StatusPill, buttonClass, useTitle } from "../components/ui"

const homeServices = [
  { to: "/tests", icon: FlaskConical, label: "Lab tests" },
  { to: "/packages", icon: Stethoscope, label: "Checkups" },
  { to: "/imaging", icon: ScanLine, label: "Scans" },
  { to: "/collection", icon: House, label: "Home collection" },
  { to: "/reports", icon: FileText, label: "Reports" },
  { to: "/centres", icon: MapPin, label: "Centres" },
]

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
      <section className="border-b border-line bg-white">
        <Container className="grid items-center gap-8 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-10">
          <div>
            <p className="text-sm font-semibold text-teal">Lab tests, scans, and health checkups in {city}</p>
            <h1 className="mt-2 max-w-xl">Book a test. Get the report the same day.</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-ink/70">
              Home collection from 7:00 AM. NABL and ISO 15189 processing. A pathologist releases every report before you can open it.
            </p>
            <HeroSearch />
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ["CBC", "/tests?q=Complete%20Blood"],
                ["Thyroid", "/tests?q=Thyroid"],
                ["Vitamin D", "/tests?q=Vitamin"],
                ["Full body checkup", "/packages"],
                ["MRI", "/imaging"],
              ].map(([label, to]) => (
                <Link key={label} to={to} className="rounded-md border border-line bg-foam px-3 py-1.5 text-xs font-semibold text-ink hover:border-teal hover:text-teal">
                  {label}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-xs font-medium text-ink/60">Offer AURORA20 · 20% off · Next slot {nextSlotLabel()}</p>
          </div>
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            <Photo src={photos.lab} alt="Scientist at a laboratory bench" className="h-52 sm:h-64" />
            <div className="grid grid-cols-3 divide-x divide-line border-t border-line text-center">
              {[
                ["6 hrs", "Routine reports"],
                ["₹150", "Home visit under ₹500"],
                ["NABL", "ISO 15189"],
              ].map(([value, label]) => (
                <div key={label} className="px-2 py-3">
                  <p className="text-sm font-bold text-teal">{value}</p>
                  <p className="mt-0.5 text-[11px] leading-4 text-ink/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-foam">
        <Container className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-3 lg:grid-cols-6">
          {homeServices.map((item) => (
            <Link key={item.label} to={item.to} className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-3 text-sm font-semibold hover:border-teal">
              <item.icon className="h-4 w-4 shrink-0 text-teal" />
              {item.label}
            </Link>
          ))}
        </Container>
      </section>

      <LiveSlip />

      <RelevanceSearch />

      <section className="py-16">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <Eyebrow>Book in a minute</Eyebrow>
              <h2 className="mt-2">Popular tests</h2>
            </div>
            <Link to="/tests" className="hidden items-center gap-1 text-sm text-teal sm:inline-flex">
              Full catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tests.filter((test) => test.popular).slice(0, 4).map((test) => (
              <Link key={test.id} to={`/tests/${test.id}`} className="flex flex-col rounded-md border border-line bg-white p-4 hover:border-teal">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-teal">{test.department}</p>
                <h3 className="mt-2 text-base">{test.name}</h3>
                <p className="mt-1 text-sm text-ink/60">{test.tat} · {test.sample}</p>
                <div className="mt-4 flex items-end justify-between">
                  <p>
                    <span className="text-lg font-bold text-ink">{inr(test.price)}</span>
                    <span className="ml-2 text-xs text-ink/40 line-through">{inr(test.mrp)}</span>
                  </p>
                  <span className="rounded-md bg-coral px-2.5 py-1 text-xs font-semibold text-white">Book</span>
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
              <h2 className="mt-2">Health checkup packages</h2>
            </div>
            <Link to="/packages" className="hidden text-sm text-teal sm:inline">
              Compare all
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {packages.slice(0, 3).map((item) => {
              const save = packageWorth(item) - item.price
              return (
                <article key={item.id} className="relative flex flex-col rounded-md border border-line bg-white p-5">
                  {item.badge && (
                    <span className="absolute right-4 top-4 rounded bg-teal px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      {item.badge}
                    </span>
                  )}
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal">{item.audience}</p>
                  <h3 className="mt-2 text-xl">{item.name}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-ink/65">{item.summary}</p>
                  <div className="my-4 border-t border-dashed border-line" />
                  <p className="text-sm text-ink/55">{item.testIds.length} tests included · {item.tat}</p>
                  <div className="mt-2 flex items-end justify-between">
                    <p>
                      <span className="text-2xl font-bold">{inr(item.price)}</span>
                      <span className="ml-2 text-xs text-ink/40 line-through">{inr(item.mrp)}</span>
                    </p>
                    <p className="text-xs font-semibold text-teal">Save {inr(save)}</p>
                  </div>
                  <Link to={`/packages/${item.id}`} className={`${buttonClass("coral", "sm")} mt-4`}>
                    View package
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
          <h2 className="mt-2 max-w-xl">Pathology, radiology, and cardiology</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-4 md:grid-rows-2">
            <Dept href="/tests" image={photos.vials} title="Pathology" copy="Haematology, biochemistry, serology, and the counters that never close at lunch." className="md:col-span-2 md:row-span-2 min-h-72" />
            <Dept href="/imaging" image={photos.mri} title="Radiology" copy="MRI, CT, ultrasound, mammography." className="min-h-44 md:col-span-2" />
            <Dept href="/imaging" image={photos.consult} title="Cardiology" copy="ECG, echo, treadmill." className="min-h-44 md:col-span-2" />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <Photo src={photos.bench} alt="Sample tubes in a laboratory rack" className="h-[320px] rounded-md" />
          <div>
            <Eyebrow>Home collection</Eyebrow>
            <h2 className="mt-2">Home sample collection</h2>
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
              <article key={title} className="rounded-md border border-line bg-white p-5">
                <ShieldCheck className="h-5 w-5 text-teal" />
                <h3 className="mt-3 text-lg">{title}</h3>
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
              <h2 className="mt-2">Centres in {city}</h2>
            </div>
            <Link to="/centres" className="text-sm text-teal">
              All cities
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {nearby.map((centre) => (
              <Link key={centre.id} to={`/centres/${centre.id}`} className="grid overflow-hidden rounded-md border border-line bg-white sm:grid-cols-[180px_1fr]">
                <Photo src={centre.image} alt="" className="h-36 sm:h-full" />
                <div className="p-5">
                  <h3 className="text-lg">{centre.name}</h3>
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
              <Eyebrow>For lab staff</Eyebrow>
              <h2 className="mt-2">Front desk, samples, reports, and billing in one console.</h2>
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
          <h2 className="mt-2">Our doctors</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((doctor) => (
              <Link key={doctor.id} to="/doctors" className="overflow-hidden rounded-md border border-line bg-white">
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
            <h2 className="mt-2">Common questions</h2>
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
    <section className="border-b border-line bg-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Container className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-teal">Live queue</p>
        <Link key={order.id} to={`/reports?order=${order.id}`} className="slip-in text-sm font-medium">
          <span className="font-mono">{order.id}</span>
          <span className="text-ink/70"> · {order.patient} · {visit}</span>
        </Link>
        <StatusPill status={order.status} />
        <span className="text-xs text-ink/55">{flags > 0 ? `${flags} flagged` : order.slot}</span>
        <div className="ml-auto flex gap-1.5">
          {list.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Show ${item.id}`}
              onClick={() => setIndex(itemIndex)}
              className={`h-1.5 rounded-full ${itemIndex === index ? "w-5 bg-teal" : "w-1.5 bg-sand"}`}
            />
          ))}
        </div>
      </Container>
    </section>
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
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search tests, scans, or packages"
          aria-label="Search tests"
          className="w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-teal"
        />
        <button type="submit" className={`${buttonClass("coral")} shrink-0`}>
          Search tests
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
    <Link to={href} className={`group relative overflow-hidden rounded-md ${className ?? ""}`}>
      <Photo src={image} alt="" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
      <div className="absolute bottom-0 p-5 text-ivory">
        <h3 className="text-xl text-white">{title}</h3>
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
