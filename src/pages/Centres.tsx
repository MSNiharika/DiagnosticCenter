import { useState } from "react"
import { Link } from "react-router-dom"
import { centres, cities } from "../data/network"
import { useStore } from "../context/Store"
import { Container, Eyebrow, Photo, useTitle } from "../components/ui"

export function Centres() {
  useTitle("Centres")
  const { city, setCity } = useStore()
  const [filter, setFilter] = useState(city)
  const list = centres.filter((centre) => filter === "All" || centre.city === filter)

  return (
    <Container className="py-12">
      <Eyebrow>Yanam</Eyebrow>
      <h1 className="mt-2 font-display text-5xl tracking-tight">The Ferry Road lab, and a morning desk in Mettakuru.</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {["All", ...cities].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setFilter(item)
              if (item !== "All") setCity(item)
            }}
            className={`rounded-full px-3 py-1.5 text-xs ${filter === item ? "bg-ink text-ivory" : "bg-paper ring-1 ring-line"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {list.map((centre) => (
          <Link key={centre.id} to={`/centres/${centre.id}`} className="overflow-hidden rounded-[28px] border border-line bg-paper">
            <Photo src={centre.image} alt="" className="h-48" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-brass">{centre.city}</p>
              <h2 className="mt-1 font-display text-3xl">{centre.name}</h2>
              <p className="mt-2 text-sm text-ink/60">{centre.address}</p>
              <p className="mt-3 text-sm">{centre.hours}</p>
              <p className="mt-2 text-xs text-ink/50">{centre.services.join(" · ")}</p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}
