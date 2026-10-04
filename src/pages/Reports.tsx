import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { seedOrders } from "../data/ops"
import { FLOW } from "../data/types"
import type { Order } from "../data/types"
import { useStore } from "../context/Store"
import { inr, phonePretty } from "../lib/utils"
import { ButtonLink, Container, Eyebrow, Flag, StatusPill, useTitle } from "../components/ui"

export function Reports() {
  useTitle("Reports")
  const [params] = useSearchParams()
  const { orders, session, accountFor } = useStore()
  const account = session?.role === "patient" ? accountFor(session.phone) : null
  const mine = session?.role === "patient" ? orders.filter((order) => order.phone === session.phone) : []
  const sample = session?.role === "patient" ? sampleReport(session.name, session.phone, account) : null
  const list = sample ? [...mine, sample] : mine
  const requested = params.get("order")?.trim().toUpperCase()
  const [picked, setPicked] = useState(requested && mine.some((order) => order.id.toUpperCase() === requested) ? requested : "")
  const match = (picked ? list.find((order) => order.id === picked) : null) ?? sample ?? list[0] ?? null

  if (session?.role !== "patient") {
    return (
      <Container className="py-12">
        <Eyebrow>Patient portal</Eyebrow>
        <h1 className="mt-2 max-w-xl">Sign in to see your reports.</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-ink/65">
          Reports open only for the mobile number on the account. Register once, then sign in. You will not see another patient's bookings.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink to="/login?next=/reports">Sign in</ButtonLink>
          <ButtonLink to="/register" variant="ghost">
            Register
          </ButtonLink>
        </div>
        {session?.role === "staff" && (
          <p className="mt-4 text-sm text-ink/60">
            The lab queue is in the console. This page is the patient view.
          </p>
        )}
      </Container>
    )
  }

  const groups = match ? [...new Set(match.results.map((row) => row.group))] : []
  const flags = match?.results.filter((row) => row.flag).length ?? 0

  return (
    <Container className="py-12">
      <Eyebrow>Patient portal</Eyebrow>
      <h1 className="mt-2 max-w-xl">Your reports</h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-ink/65">
        Signed in as {session.name}. These are the bookings on {phonePretty(session.phone)}. A result appears after a doctor releases it.
      </p>
      {sample && (
        <p className="mt-4 max-w-lg rounded-md border border-line bg-white px-4 py-3 text-sm leading-6 text-ink/70">
          Sample report on this account, so you can open a finished result before the lab system is connected. Your own bookings stay in this list.
        </p>
      )}
      <div className="no-print mt-6 flex flex-wrap gap-2">
        {list.map((order) => (
          <button
            key={order.id}
            type="button"
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ring-1 ${match?.id === order.id ? "bg-teal text-white ring-teal" : "bg-white ring-line"}`}
            onClick={() => setPicked(order.id)}
          >
            {order.id} · {order.id === "AR-SAMPLE" ? "Sample" : order.status}
          </button>
        ))}
      </div>

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
                {match.id === "AR-SAMPLE"
                  ? "Sample values for this demonstration. Not a medical result, and not stored as your lab record."
                  : "Demonstration report. It is not medical advice."}
              </p>
            </div>
          )}
        </article>
      )}
    </Container>
  )
}

function sampleReport(name: string, phone: string, account: { dob: string; gender: Order["gender"] } | null): Order {
  const base = seedOrders.find((order) => order.status === "Released") ?? seedOrders[0]
  return {
    ...base,
    id: "AR-SAMPLE",
    patient: name,
    phone,
    age: account ? ageFromDob(account.dob) : base.age,
    gender: account?.gender ?? base.gender,
    centre: "Yanam",
    mode: "Centre visit",
    address: undefined,
    note: "Sample report shown until the lab system is connected.",
  }
}

function ageFromDob(dob: string) {
  const born = new Date(dob)
  if (Number.isNaN(born.getTime())) return 0
  const now = new Date()
  let age = now.getFullYear() - born.getFullYear()
  const month = now.getMonth() - born.getMonth()
  if (month < 0 || (month === 0 && now.getDate() < born.getDate())) age -= 1
  return Math.max(0, age)
}
