import { Link } from "react-router-dom"
import { awards, equipment, journey, networkStats, qualityMarks } from "../data/company"
import { doctors, photos } from "../data/network"
import { ButtonLink, Container, Eyebrow, Photo, useTitle } from "../components/ui"

const jumps = [
  ["#overview", "Overview"],
  ["#journey", "Our journey"],
  ["#people", "Our people"],
  ["#equipment", "Equipment"],
  ["#quality", "Quality"],
  ["#awards", "Awards"],
]

export function About() {
  useTitle("About")
  return (
    <div>
      <section id="overview" className="scroll-mt-32 sm:scroll-mt-40 border-b border-line bg-white">
        <Container className="grid items-center gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          <div>
            <Eyebrow>About Aurora</Eyebrow>
            <h1 className="mt-2 max-w-xl">A new diagnostic centre on Ferry Road, Yanam.</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-ink/70">
              Aurora opened in Yanam in 2026. Blood tests, ultrasound, digital X-ray, and ECG are in one building. Home collection covers the town, Mettakuru, Dariyalatippa, and Farampeta. A report stays hidden until a doctor releases it.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <ButtonLink to="/tests">Book a test</ButtonLink>
              <ButtonLink to="/centres" variant="ghost">Find a centre</ButtonLink>
            </div>
          </div>
          <Photo src={photos.corridor} alt="Reception desk at the Yanam centre" className="h-64 rounded-md sm:h-80" />
        </Container>
        <Container className="grid grid-cols-2 gap-3 pb-10 sm:grid-cols-3 lg:grid-cols-6">
          {networkStats.map((item) => (
            <article key={item.label} className="rounded-md border border-line bg-foam px-3 py-4">
              <p className="text-2xl font-bold text-teal">{item.value}</p>
              <p className="mt-1 text-sm font-semibold">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-ink/60">{item.note}</p>
            </article>
          ))}
        </Container>
      </section>

      <nav aria-label="About sections" className="sticky top-16 z-30 border-b border-line bg-white sm:top-[6.4rem]">
        <Container className="flex gap-1 overflow-x-auto py-2">
          {jumps.map(([href, label]) => (
            <a key={href} href={href} className="shrink-0 rounded-md px-3 py-2 text-sm font-semibold text-ink hover:bg-foam hover:text-teal">
              {label}
            </a>
          ))}
        </Container>
      </nav>

      <section id="journey" className="scroll-mt-32 sm:scroll-mt-40 py-14">
        <Container>
          <Eyebrow>Our journey</Eyebrow>
          <h2 className="mt-2 max-w-2xl">Opened in Yanam, with home collection from the first month.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/70">
            Each step added a machine or a city only after the report path was clear: who draws the sample, which analyser runs it, and which doctor signs it.
          </p>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {journey.map((item) => (
              <li key={item.era} className="rounded-md border border-line bg-white p-5">
                <p className="text-sm font-bold text-coral">{item.era}</p>
                <h3 className="mt-2 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/70">{item.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="people" className="scroll-mt-32 sm:scroll-mt-40 border-y border-line bg-foam py-14">
        <Container>
          <Eyebrow>Our people</Eyebrow>
          <h2 className="mt-2 max-w-2xl">A report is a person&apos;s result, read by a named doctor.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/70">
            The Yanam team is the pathologist, the radiologist, the front desk, and the phlebotomists on the morning routes. Automation files the tube. A doctor files the opinion.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((doctor) => (
              <Link key={doctor.id} to="/doctors" className="overflow-hidden rounded-md border border-line bg-white">
                <Photo src={doctor.photo} alt={doctor.name} face className="h-72" />
                <div className="p-4">
                  <h3 className="text-base">{doctor.name}</h3>
                  <p className="text-sm text-teal">{doctor.role}</p>
                  <p className="mt-1 text-xs text-ink/55">{doctor.centre}</p>
                </div>
              </Link>
            ))}
          </div>
          <ButtonLink to="/doctors" variant="ghost" className="mt-6">
            All consultants
          </ButtonLink>
        </Container>
      </section>

      <section id="equipment" className="scroll-mt-32 sm:scroll-mt-40 py-14">
        <Container>
          <Eyebrow>Equipment</Eyebrow>
          <h2 className="mt-2 max-w-2xl">The machines behind the menu.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/70">
            These are the machines on Ferry Road and the boxes that travel with a home draw. Book the test, or ask the desk which slot is free today.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {equipment.map((item) => (
              <article key={item.name} className="grid overflow-hidden rounded-md border border-line bg-white sm:grid-cols-[180px_1fr]">
                <Photo src={item.image} alt="" className="h-36 sm:h-full" />
                <div className="p-5">
                  <h3 className="text-lg">{item.name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-teal">{item.where}</p>
                  <p className="mt-2 text-sm leading-6 text-ink/70">{item.detail}</p>
                  <Link to={item.to} className="mt-3 inline-flex text-sm font-semibold text-coral">
                    Book this study
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-white py-14">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>Easy access</Eyebrow>
            <h2 className="mt-2">Walk into Ferry Road, or book a draw at home in Yanam.</h2>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              The centre opens at 7:00 AM. The Mettakuru desk takes samples until 1:00 PM. Reports open in the portal after a doctor releases them.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["/centres", "Yanam centre", "Ferry Road lab, and a morning desk in Mettakuru."],
              ["/collection", "Home collection", "Yanam town, Mettakuru, Dariyalatippa, and Farampeta."],
              ["/reports", "Reports", "Track the sample, then open the PDF once a doctor signs."],
            ].map(([to, title, copy]) => (
              <Link key={to} to={to} className="rounded-md border border-line bg-foam p-4 hover:border-teal">
                <h3 className="text-base">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{copy}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section id="quality" className="scroll-mt-32 sm:scroll-mt-40 py-14">
        <Container>
          <Eyebrow>Quality</Eyebrow>
          <h2 className="mt-2 max-w-2xl">Standards the lab is built to meet.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {qualityMarks.map((item) => (
              <article key={item.name} className="rounded-md border border-line bg-white p-5">
                <h3 className="text-xl text-teal">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/70">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-deep py-14">
        <Container className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <Eyebrow>Workplaces</Eyebrow>
            <h2 className="mt-2">Health camps for teams, with a private report for each person.</h2>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              HR receives a de-identified summary. A named report goes to the company only when the employee opts in.
            </p>
          </div>
          <ButtonLink to="/corporate">Plan a camp</ButtonLink>
        </Container>
      </section>

      <section id="awards" className="scroll-mt-32 sm:scroll-mt-40 py-14">
        <Container>
          <Eyebrow>Awards</Eyebrow>
          <h2 className="mt-2">What this centre opened with.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/70">
            Aurora is new in Yanam. These lines are the promises on the door, not awards from earlier years.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {awards.map((item) => (
              <article key={item.title} className="rounded-md border border-line bg-white p-5">
                <p className="text-sm font-bold text-coral">{item.year}</p>
                <h3 className="mt-2 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/70">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
