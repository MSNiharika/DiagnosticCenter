import { Clock3, MapPin, ShieldCheck, Thermometer } from "lucide-react"
import { centres } from "../data/network"
import { photos } from "../data/network"
import { ButtonLink, Container, Eyebrow, Photo, useTitle } from "../components/ui"

export function Collection() {
  useTitle("Home collection")
  return (
    <div>
      <Container className="grid items-center gap-10 py-12 lg:grid-cols-2">
        <div>
          <Eyebrow>Home collection</Eyebrow>
          <h1 className="mt-2 font-display text-5xl tracking-tight">A person with a name, a sealed kit, and a slot you picked.</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-ink/70">
            Home visits cover blood and urine in Yanam town, Mettakuru, Dariyalatippa, and Farampeta. The sample joins the same queue as a draw at Ferry Road.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink to="/book?mode=home">Book a home slot</ButtonLink>
            <ButtonLink to="/tests" variant="ghost">
              See what can travel
            </ButtonLink>
          </div>
        </div>
        <Photo src={photos.vials} alt="Phlebotomist holding a rack of sample tubes" className="h-[380px] rounded-[28px]" />
      </Container>
      <Container className="grid gap-4 pb-8 md:grid-cols-3">
        {[
          [Clock3, "7:00 AM start", "Morning routes leave from Ferry Road. The last home slot is 5:30 PM."],
          [Thermometer, "Logged cold chain", "Each box records temperature. A warm tube is rejected and redrawn."],
          [ShieldCheck, "Free over ₹500", "Shorter bills add ₹150 for the visit. Packages clear that easily."],
        ].map(([Icon, title, copy]) => (
          <article key={String(title)} className="rounded-3xl border border-line bg-paper p-5">
            <Icon className="h-5 w-5 text-coral" />
            <h2 className="mt-3 font-display text-2xl">{String(title)}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">{String(copy)}</p>
          </article>
        ))}
      </Container>
      <Container className="grid gap-8 py-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl">What we collect at home</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink/75">
            <li>Blood for pathology, hormones, and vitamin D</li>
            <li>Urine in a sterile cup we bring</li>
            <li>Fever panels, including dengue NS1</li>
          </ul>
          <h2 className="mt-8 font-display text-3xl">What stays at the centre</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink/75">
            <li>Ultrasound, digital X-ray, and ECG</li>
            <li>ECG, echo, and treadmill tests</li>
            <li>HPV swabs, which need a clinician's room</li>
          </ul>
        </div>
        <div className="rounded-[28px] border border-line bg-paper p-5">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-brass">
            <MapPin className="h-3.5 w-3.5" /> Yanam desks
          </p>
          <ul className="mt-4 divide-y divide-line">
            {centres.map((centre) => (
              <li key={centre.id} className="flex items-center justify-between py-3 text-sm">
                <span>
                  {centre.city}
                  <span className="text-ink/45"> · {centre.name}</span>
                </span>
                <span className="text-xs text-ink/45">{centre.hours.split("–")[0]} start</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  )
}
