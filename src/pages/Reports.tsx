import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { FLOW } from "../data/types"
import type { Order } from "../data/types"
import { useStore } from "../context/Store"
import { digits, inr, phonePretty } from "../lib/utils"
import { Button, Container, Eyebrow, Field, Flag, StatusPill, inputClass, useTitle } from "../components/ui"

export function Reports() {
  useTitle("Reports")
  const [params] = useSearchParams()
  const { orders, session } = useStore()
  const [orderId, setOrderId] = useState(params.get("order") ?? "")
  const [phone, setPhone] = useState(session?.role === "patient" ? session.phone : "")
  const [match, setMatch] = useState<Order | null>(null)
  const [miss, setMiss] = useState(false)

  function lookup(event?: { preventDefault: () => void }, preset?: { id: string; phone: string }) {
    event?.preventDefault()
    const id = (preset?.id ?? orderId).trim().toUpperCase()
    const mobile = digits(preset?.phone ?? phone)
    if (preset) {
      setOrderId(preset.id)
      setPhone(preset.phone)
    }
    const found = orders.find((order) => order.id.toUpperCase() === id && order.phone === mobile) ?? null
    setMatch(found)
    setMiss(!found)
  }

  const groups = match
    ? [...new Set(match.results.map((row) => row.group))]
    : []
  const flags = match?.results.filter((row) => row.flag).length ?? 0

  return (
    <Container className="py-12">
      <Eyebrow>Patient portal</Eyebrow>
      <h1 className="mt-2 max-w-xl font-display text-5xl tracking-tight">The report, once a doctor has released it.</h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-ink/65">
        Look up with the booking id and the mobile used at the desk. Until validation, you will see the sample moving — not a half-written result.
      </p>
      {session?.role === "patient" && (
        <div className="no-print mt-6">
          <p className="text-sm">
            Signed in as <span className="font-medium">{session.name}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {orders.filter((order) => order.phone === session.phone).map((order) => (
              <button
                key={order.id}
                type="button"
                className="rounded-full bg-paper px-3 py-1.5 text-xs ring-1 ring-line"
                onClick={() => lookup(undefined, { id: order.id, phone: order.phone })}
              >
                {order.id} · {order.status}
              </button>
            ))}
            {orders.every((order) => order.phone !== session.phone) && (
              <p className="text-sm text-ink/55">No bookings on this mobile yet.</p>
            )}
          </div>
        </div>
      )}

      <form className="no-print mt-8 grid gap-3 rounded-[28px] border border-line bg-paper p-5 md:grid-cols-[1fr_1fr_auto] md:items-end" onSubmit={(event) => lookup(event)}>
        <Field label="Booking id">
          <input className={inputClass} value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="AR-48291" />
        </Field>
        <Field label="Mobile">
          <input className={inputClass} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="98480 12345" />
        </Field>
        <Button type="submit">Open</Button>
      </form>
      <button
        type="button"
        className="no-print mt-3 text-sm text-teal"
        onClick={() => lookup(undefined, { id: "AR-48291", phone: "9848012345" })}
      >
        Open the sample released report
      </button>
      {miss && <p className="mt-4 text-sm text-coral">No report for that pair. Check the id and the 10-digit mobile.</p>}

      {match && (
        <article className="mt-8 rounded-[28px] border border-line bg-paper p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-ink/50">{match.id}</p>
              <h2 className="font-display text-4xl">{match.patient}</h2>
              <p className="mt-1 text-sm text-ink/60">
                {match.age} · {match.gender} · {phonePretty(match.phone)}
              </p>
              <p className="mt-1 text-sm text-ink/60">
                {match.centre} · {match.slot} · {match.mode}
              </p>
            </div>
            <div className="text-right">
              <StatusPill status={match.status} />
              <p className="mt-2 text-sm">{inr(match.total)}</p>
              <button type="button" className="no-print mt-2 text-xs text-teal" onClick={() => window.print()}>
                Print / save PDF
              </button>
            </div>
          </div>

          <ol className="mt-6 grid gap-2 sm:grid-cols-6">
            {FLOW.map((status) => {
              const reached = FLOW.indexOf(status) <= FLOW.indexOf(match.status)
              return (
                <li key={status} className={`rounded-xl px-2 py-2 text-center text-[11px] ${reached ? "bg-ink text-paper" : "bg-ivory text-ink/40"}`}>
                  {status}
                </li>
              )
            })}
          </ol>

          {match.status !== "Released" && (
            <p className="mt-6 rounded-2xl bg-ivory px-4 py-3 text-sm text-ink/70">
              Results stay on the worklist until a consultant releases them. Track the steps above, or ask the lab console to move this order forward.
            </p>
          )}

          {match.status === "Released" && (
            <div className="mt-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h3 className="font-display text-2xl">Findings</h3>
                <p className="text-sm text-ink/55">
                  {flags === 0 ? "Nothing outside the reference range." : `${flags} value${flags === 1 ? "" : "s"} outside the reference range.`}
                </p>
              </div>
              {groups.map((group) => (
                <section key={group} className="mt-5">
                  <h4 className="text-xs uppercase tracking-[0.16em] text-brass">{group}</h4>
                  <table className="mt-2 w-full text-left text-sm">
                    <thead className="text-[11px] uppercase tracking-wide text-ink/40">
                      <tr>
                        <th className="py-2 font-medium">Analyte</th>
                        <th className="py-2 font-medium">Result</th>
                        <th className="hidden py-2 font-medium sm:table-cell">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.results
                        .filter((row) => row.group === group)
                        .map((row) => (
                          <tr key={row.name} className="border-t border-line">
                            <td className="py-2.5">{row.name}</td>
                            <td className="py-2.5">
                              {row.value || "—"} {row.unit !== "—" ? row.unit : ""}
                              <Flag flag={row.flag} />
                            </td>
                            <td className="hidden py-2.5 text-ink/50 sm:table-cell">{row.ref}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </section>
              ))}
              {match.note && <p className="mt-4 text-sm text-ink/70">Note: {match.note}</p>}
              <p className="mt-6 text-sm">Authorised by {match.authorisedBy ?? "the duty consultant"}.</p>
              <p className="mt-2 text-xs leading-5 text-ink/45">
                Sample report for demonstration. It is not medical advice and it is not your record.
              </p>
            </div>
          )}
        </article>
      )}
    </Container>
  )
}
