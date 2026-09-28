import { Link, useParams } from "react-router-dom"
import { tests } from "../data/catalog"
import { centreById } from "../data/network"
import { ButtonLink, Container, Eyebrow, Photo, useTitle } from "../components/ui"

export function CentreDetail() {
  const { id } = useParams()
  const centre = centreById(id ?? "")
  useTitle(centre ? centre.name : "Centre")
  if (!centre) {
    return (
      <Container className="py-20">
        <h1 className="font-display text-4xl">We could not find that centre.</h1>
        <ButtonLink to="/centres" className="mt-4" variant="ink">
          All centres
        </ButtonLink>
      </Container>
    )
  }
  const offers = tests.filter((test) => {
    if (test.category === "Radiology") return centre.services.includes("Radiology")
    if (test.category === "Cardiology") return centre.services.includes("Cardiology")
    return centre.services.includes("Pathology")
  })

  return (
    <Container className="py-12">
      <p className="text-sm text-ink/50">
        <Link to="/centres">Centres</Link> / {centre.city}
      </p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Photo src={centre.image} alt={`${centre.name} centre`} className="h-[360px] rounded-[28px]" />
        <div>
          <Eyebrow>{centre.city}</Eyebrow>
          <h1 className="mt-2 font-display text-5xl">{centre.name}</h1>
          <p className="mt-3 text-sm leading-6 text-ink/70">{centre.note}</p>
          <dl className="mt-6 space-y-2 text-sm">
            <div><dt className="text-ink/45">Address</dt><dd>{centre.address}</dd></div>
            <div><dt className="text-ink/45">Hours</dt><dd>{centre.hours}</dd></div>
            <div><dt className="text-ink/45">Phone</dt><dd>{centre.phone}</dd></div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {centre.services.map((service) => (
              <span key={service} className="rounded-full bg-foam px-3 py-1 text-xs text-teal">{service}</span>
            ))}
          </div>
          <ButtonLink to="/book" className="mt-6">
            Book at this centre
          </ButtonLink>
        </div>
      </div>
      <h2 className="mt-12 font-display text-3xl">Available here</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {offers.map((test) => (
          <li key={test.id}>
            <Link to={`/tests/${test.id}`} className="flex justify-between rounded-2xl border border-line bg-paper px-4 py-3 text-sm hover:border-ink/20">
              <span>{test.name}</span>
              <span className="text-ink/45">{test.tat}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}
