import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import { referrals, staff } from "../../data/network"
import { revenueDays, revenueSeries } from "../../data/ops"
import type { Gender, OrderStatus } from "../../data/types"
import { FLOW } from "../../data/types"
import { useStore } from "../../context/Store"
import { inr, phonePretty } from "../../lib/utils"
import { Button, Field, StatusPill, inputClass } from "../../components/ui"

export function CommandScreen() {
  const { orders } = useStore()
  const [q, setQ] = useState("")
  const [status, setStatus] = useState<"All" | OrderStatus>("All")
  const due = orders.filter((order) => !order.paid).reduce((sum, order) => sum + order.total, 0)
  const review = orders.filter((order) => order.status === "Review").length
  const urgent = orders.filter((order) => order.priority === "Urgent" && order.status !== "Released").length
  const released = orders.filter((order) => order.status === "Released").length
  const rows = orders.filter((order) => {
    const hit = `${order.patient} ${order.id} ${order.centre}`.toLowerCase().includes(q.toLowerCase())
    return hit && (status === "All" || order.status === status)
  })

  return (
    <div>
      <Header kicker="Monday floor" title="Command centre" copy="Today's samples at the Yanam centre and the Mettakuru desk." />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Orders on the board" value={String(orders.length)} hint="Including yesterday's released TSH" />
        <Kpi label="Waiting on a signature" value={String(review)} hint="Validation queue" />
        <Kpi label="Urgent, still open" value={String(urgent)} hint="Fever panel is flagged" />
        <Kpi label="Unpaid" value={inr(due)} hint={`${released} already released`} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Patient, id, centre" className={`${inputClass} max-w-xs`} aria-label="Search orders" />
        <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className={`${inputClass} max-w-[180px]`} aria-label="Status">
          <option>All</option>
          {FLOW.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="mt-4 overflow-x-auto rounded-3xl border border-line bg-paper">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-[11px] uppercase tracking-wide text-ink/40">
            <tr>
              {["Order", "Patient", "Centre", "Status", "Pay"].map((column) => (
                <th key={column} className="px-4 py-3 font-medium">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id} className="border-t border-line">
                <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                <td className="px-4 py-3">
                  {order.patient}
                  {order.priority === "Urgent" && <span className="ml-2"><StatusPill status="Urgent" /></span>}
                </td>
                <td className="px-4 py-3 text-ink/70">{order.centre}</td>
                <td className="px-4 py-3"><StatusPill status={order.status} /></td>
                <td className="px-4 py-3">{order.paid ? "Paid" : inr(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function DeskScreen() {
  const { patients, orders, addPatient, advance } = useStore()
  const [q, setQ] = useState("")
  const [form, setForm] = useState({ name: "", phone: "", age: "", gender: "Female" as Gender, city: "Yanam" })
  const filtered = patients.filter((patient) => `${patient.name} ${patient.phone} ${patient.mrn}`.toLowerCase().includes(q.toLowerCase()))

  function submit(event: FormEvent) {
    event.preventDefault()
    const age = Number(form.age)
    if (form.name.trim().length < 2 || form.phone.replace(/\D/g, "").length !== 10 || age < 1) return
    addPatient({
      name: form.name.trim(),
      phone: form.phone.replace(/\D/g, ""),
      age,
      gender: form.gender,
      city: form.city,
    })
    setForm({ name: "", phone: "", age: "", gender: "Female", city: form.city })
  }

  return (
    <div>
      <Header kicker="Reception" title="Front desk" copy="Register a walk-in, then check in anyone whose slot is today." />
      <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={submit} className="rounded-3xl border border-line bg-paper p-5">
          <h2 className="font-display text-2xl">New chart</h2>
          <div className="mt-3 grid gap-3">
            <Field label="Name"><input className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
            <Field label="Mobile"><input className={inputClass} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Age"><input className={inputClass} value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} /></Field>
              <Field label="Gender">
                <select className={inputClass} value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value as Gender })}>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </Field>
            </div>
            <Button type="submit">Register</Button>
          </div>
        </form>
        <div>
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search name, mobile, MRN" className={inputClass} aria-label="Search patients" />
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-paper">
            {filtered.map((patient) => (
              <li key={patient.mrn} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>
                  <span className="font-medium">{patient.name}</span>
                  <span className="mt-0.5 block text-xs text-ink/45">{patient.mrn} · {phonePretty(patient.phone)} · {patient.city}</span>
                </span>
                <span className="text-xs text-ink/50">{patient.age} · {patient.gender}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <h2 className="mt-8 font-display text-2xl">Check in</h2>
      <ul className="mt-3 space-y-2">
        {orders.filter((order) => order.status === "Booked").map((order) => (
          <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm">
            <span>{order.patient} · {order.slot} · {order.centre}</span>
            <Button size="sm" variant="ink" onClick={() => advance(order.id)}>Check in</Button>
          </li>
        ))}
        {orders.every((order) => order.status !== "Booked") && <li className="text-sm text-ink/55">No one left to check in.</li>}
      </ul>
    </div>
  )
}

export function SamplesScreen() {
  const { orders, advance, setPriority } = useStore()
  const [tab, setTab] = useState<OrderStatus | "Open">("Open")
  const rows = orders.filter((order) => (tab === "Open" ? order.status !== "Released" : order.status === tab))
  return (
    <div>
      <Header kicker="Accession" title="Sample floor" copy="Advance a tube one step. Urgent stays red until someone owns it." />
      <div className="mt-5 flex flex-wrap gap-2">
        {(["Open", ...FLOW] as const).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-full px-3 py-1.5 text-xs ${tab === item ? "bg-ink text-ivory" : "bg-paper ring-1 ring-line"}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {rows.map((order) => (
          <article key={order.id} className="rounded-3xl border border-line bg-paper p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs">{order.id}</p>
                <h3 className="font-display text-2xl">{order.patient}</h3>
                <p className="text-sm text-ink/55">{order.items.map((item) => item.name).join(", ")}</p>
              </div>
              <StatusPill status={order.status} />
            </div>
            <Barcode id={order.id} />
            <div className="mt-3 flex flex-wrap gap-2">
              {order.status !== "Released" && (
                <Button size="sm" onClick={() => advance(order.id)}>Advance</Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => setPriority(order.id)}>
                {order.priority === "Urgent" ? "Mark routine" : "Mark urgent"}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export function WorklistScreen() {
  const { orders, setResult } = useStore()
  const departments = ["All", ...new Set(orders.map((order) => order.department))]
  const [department, setDepartment] = useState("All")
  const rows = orders.filter((order) => ["Accessioned", "Processing", "Review"].includes(order.status) && (department === "All" || order.department === department))
  return (
    <div>
      <Header kicker="Analysers" title="Worklist" copy="Type a value. If it sits outside the reference, the row flags itself." />
      <div className="mt-5 flex flex-wrap gap-2">
        {departments.map((item) => (
          <button key={item} type="button" onClick={() => setDepartment(item)} className={`rounded-full px-3 py-1.5 text-xs ${department === item ? "bg-ink text-ivory" : "bg-paper ring-1 ring-line"}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-4">
        {rows.map((order) => (
          <article key={order.id} className="rounded-3xl border border-line bg-paper p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium">{order.patient} <span className="font-mono text-xs text-ink/40">{order.id}</span></h3>
              <StatusPill status={order.status} />
            </div>
            <div className="mt-3 grid gap-2">
              {order.results.map((row, index) => (
                <label key={`${row.name}-${index}`} className="grid items-center gap-2 rounded-2xl bg-ivory px-3 py-2 sm:grid-cols-[1.3fr_0.7fr_0.6fr]">
                  <span className="text-sm">
                    {row.name}
                    {row.flag && <span className="ml-2 text-[11px] font-semibold text-coral">{row.flag}</span>}
                  </span>
                  <input
                    value={row.value}
                    onChange={(event) => setResult(order.id, index, event.target.value)}
                    className="rounded-xl border border-line bg-paper px-2 py-1.5 text-sm"
                    aria-label={row.name}
                  />
                  <span className="text-xs text-ink/45">{row.ref} {row.unit !== "—" ? row.unit : ""}</span>
                </label>
              ))}
            </div>
          </article>
        ))}
        {rows.length === 0 && <p className="text-sm text-ink/55">Nothing is on the bench for that department.</p>}
      </div>
    </div>
  )
}

export function ValidateScreen() {
  const { orders, release, setNote } = useStore()
  const rows = orders.filter((order) => order.status === "Review")
  return (
    <div>
      <Header kicker="Pathologist" title="Validation" copy="Release only when every field has a value. The patient portal updates immediately." />
      <div className="mt-5 space-y-4">
        {rows.map((order) => {
          const ready = order.results.length > 0 && order.results.every((row) => row.value.trim())
          return (
            <article key={order.id} className="rounded-3xl border border-line bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-3xl">{order.patient}</h3>
                  <p className="text-sm text-ink/55">{order.id} · {order.centre} · {order.department}</p>
                </div>
                <Button size="sm" disabled={!ready} onClick={() => release(order.id)}>Release report</Button>
              </div>
              <ul className="mt-4 grid gap-1 text-sm sm:grid-cols-2">
                {order.results.map((row) => (
                  <li key={row.name} className="flex justify-between gap-3 border-b border-line py-1.5">
                    <span>{row.name}</span>
                    <span>{row.value || "—"} {row.flag ?? ""}</span>
                  </li>
                ))}
              </ul>
              <label className="mt-4 block text-xs uppercase tracking-[0.14em] text-ink/40">
                Note
                <textarea className={`${inputClass} mt-1`} rows={2} value={order.note} onChange={(event) => setNote(order.id, event.target.value)} />
              </label>
              {!ready && <p className="mt-2 text-xs text-coral">Fill the worklist before release.</p>}
            </article>
          )
        })}
        {rows.length === 0 && <p className="text-sm text-ink/55">The validation pile is clear.</p>}
      </div>
    </div>
  )
}

export function BillingScreen() {
  const { orders, setPaid } = useStore()
  const [onlyDue, setOnlyDue] = useState(false)
  const rows = orders.filter((order) => (onlyDue ? !order.paid : true))
  const collected = orders.filter((order) => order.paid).reduce((sum, order) => sum + order.total, 0)
  const due = orders.filter((order) => !order.paid).reduce((sum, order) => sum + order.total, 0)
  return (
    <div>
      <Header kicker="Counter" title="Billing" copy="UPI and card bookings are already marked paid. Counter dues wait here." />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Kpi label="Collected" value={inr(collected)} hint="On this sample day" />
        <Kpi label="Still due" value={inr(due)} hint="Pay at centre" />
      </div>
      <button type="button" className="mt-4 text-sm text-teal" onClick={() => setOnlyDue((value) => !value)}>
        {onlyDue ? "Show every bill" : "Show only dues"}
      </button>
      <ul className="mt-3 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-paper">
        {rows.map((order) => (
          <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
            <span>
              <span className="font-medium">{order.patient}</span>
              <span className="block text-xs text-ink/45">{order.id} · {order.pay} · {order.items.map((item) => item.name).join(", ")}</span>
            </span>
            <span className="flex items-center gap-3">
              <span>{inr(order.total)}</span>
              {order.paid ? <span className="text-xs text-teal">Paid</span> : <Button size="sm" onClick={() => setPaid(order.id)}>Record payment</Button>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function InventoryScreen() {
  const { inventory, reorder } = useStore()
  const low = inventory.filter((item) => item.onHand <= item.reorderAt)
  return (
    <div>
      <Header kicker="Stores" title="Inventory" copy={`${low.length} items are at or under the reorder line.`} />
      <div className="mt-5 overflow-x-auto rounded-3xl border border-line bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-[11px] uppercase tracking-wide text-ink/40">
            <tr>
              {["Item", "Lot", "On hand", "Reorder", "On order", ""].map((column) => (
                <th key={column || "action"} className="px-4 py-3 font-medium">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => {
              const short = item.onHand <= item.reorderAt
              return (
                <tr key={item.sku} className="border-t border-line">
                  <td className="px-4 py-3">
                    {item.name}
                    {short && <span className="ml-2 text-[11px] font-semibold text-coral">LOW</span>}
                    <span className="block text-xs text-ink/40">{item.sku} · exp {item.expiry}</span>
                  </td>
                  <td className="px-4 py-3">{item.lot}</td>
                  <td className="px-4 py-3">{item.onHand} {item.unit}</td>
                  <td className="px-4 py-3">{item.reorderAt}</td>
                  <td className="px-4 py-3">{item.onOrder}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost" onClick={() => reorder(item.sku)}>Reorder {item.reorderQty}</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function LogisticsScreen() {
  const { riders, advanceRider, orders } = useStore()
  const homes = orders.filter((order) => order.mode === "Home collection")
  return (
    <div>
      <Header kicker="Routes" title="Home collection" copy="Move a rider from assigned to dropped at the lab." />
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {riders.map((rider) => (
          <article key={rider.id} className="rounded-3xl border border-line bg-paper p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-2xl">{rider.name}</h3>
                <p className="text-sm text-ink/60">{rider.zone} · {rider.stops} stops · {rider.window}</p>
              </div>
              <StatusPill status={rider.status} />
            </div>
            <Button className="mt-4" size="sm" variant="ink" onClick={() => advanceRider(rider.id)} disabled={rider.status === "Dropped at lab"}>
              Next step
            </Button>
          </article>
        ))}
      </div>
      <h2 className="mt-8 font-display text-2xl">Home bookings</h2>
      <ul className="mt-3 space-y-2">
        {homes.map((order) => (
          <li key={order.id} className="rounded-2xl border border-line bg-paper px-4 py-3 text-sm">
            <span className="font-medium">{order.patient}</span> · {order.slot}
            <span className="block text-ink/55">{order.address} · {order.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ReferralsScreen() {
  const payout = referrals.reduce((sum, row) => sum + row.payout, 0)
  return (
    <div>
      <Header kicker="Clinics" title="Referrals" copy={`${inr(payout)} is still to be settled this month.`} />
      <ul className="mt-5 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-paper">
        {referrals.map((row) => (
          <li key={row.name} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-4 sm:items-center">
            <span>
              <span className="font-medium">{row.name}</span>
              <span className="block text-xs text-ink/45">{row.clinic} · {row.city}</span>
            </span>
            <span>{row.orders} orders</span>
            <span>{inr(row.revenue)}</span>
            <span className="text-coral">{inr(row.payout)} due</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function QualityScreen() {
  const { qc, logQc } = useStore()
  return (
    <div>
      <Header kicker="Before patients" title="Quality" copy="Morning controls. A warning has to be logged again before that analyte is trusted." />
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {qc.map((lot) => (
          <article key={lot.id} className="rounded-3xl border border-line bg-paper p-5">
            <StatusPill status={lot.status} />
            <h3 className="mt-3 font-display text-2xl">{lot.name}</h3>
            <p className="text-sm text-ink/60">{lot.level} · {lot.instrument}</p>
            <p className="mt-2 text-sm">Last run {lot.last} · {lot.runs} today</p>
            <Button className="mt-4" size="sm" onClick={() => logQc(lot.id)}>Log QC</Button>
          </article>
        ))}
      </div>
    </div>
  )
}

export function PeopleScreen() {
  const [shift, setShift] = useState("All")
  const rows = staff.filter((person) => shift === "All" || person.state === shift)
  return (
    <div>
      <Header kicker="Roster" title="People" copy="Who is on the floor this shift." />
      <div className="mt-5 flex gap-2">
        {["All", "On floor", "Off", "Leave"].map((item) => (
          <button key={item} type="button" onClick={() => setShift(item)} className={`rounded-full px-3 py-1.5 text-xs ${shift === item ? "bg-ink text-ivory" : "bg-paper ring-1 ring-line"}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((person) => (
          <article key={person.name} className="rounded-3xl border border-line bg-paper p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{person.name}</h3>
                <p className="text-sm text-ink/60">{person.role} · {person.centre}</p>
                <p className="text-xs text-ink/45">{person.shift}</p>
              </div>
              <StatusPill status={person.state} />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export function InsightsScreen() {
  const { orders } = useStore()
  const max = Math.max(...revenueSeries)
  const mix = useMemo(() => {
    const counts = new Map<string, number>()
    for (const order of orders) {
      counts.set(order.department, (counts.get(order.department) ?? 0) + 1)
    }
    return [...counts.entries()]
  }, [orders])
  return (
    <div>
      <Header kicker="This week" title="Insights" copy="Revenue is the sample week. The mix is counted from the orders on this board." />
      <div className="mt-5 rounded-3xl border border-line bg-paper p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-ink/40">Collections, ₹ lakh</p>
        <div className="mt-4 flex h-40 items-end gap-3">
          {revenueSeries.map((value, index) => (
            <div key={revenueDays[index]} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-xl bg-teal" style={{ height: `${(value / max) * 100}%` }} />
              <span className="text-[11px] text-ink/50">{revenueDays[index]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <article className="rounded-3xl border border-line bg-paper p-5">
          <h3 className="font-display text-2xl">By department</h3>
          <ul className="mt-3 space-y-2">
            {mix.map(([name, count]) => (
              <li key={name}>
                <div className="flex justify-between text-sm"><span>{name}</span><span>{count}</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-sand">
                  <div className="h-1.5 rounded-full bg-coral" style={{ width: `${(count / orders.length) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-3xl border border-line bg-paper p-5">
          <h3 className="font-display text-2xl">Turnaround promise</h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex justify-between"><span>Haematology</span><span>6 hours</span></li>
            <li className="flex justify-between"><span>Biochemistry</span><span>8 hours</span></li>
            <li className="flex justify-between"><span>Immunoassay</span><span>12 hours</span></li>
            <li className="flex justify-between"><span>Ultrasound</span><span>Same day</span></li>
            <li className="flex justify-between"><span>HPV DNA</span><span>5 days</span></li>
          </ul>
        </article>
      </div>
    </div>
  )
}

function Header({ kicker, title, copy }: { kicker: string; title: string; copy: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em] text-brass">{kicker}</p>
      <h1 className="mt-1 font-display text-4xl tracking-tight">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/60">{copy}</p>
    </div>
  )
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-3xl border border-line bg-paper p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-ink/40">{label}</p>
      <p className="mt-2 font-display text-4xl">{value}</p>
      <p className="mt-1 text-xs text-ink/50">{hint}</p>
    </article>
  )
}

function Barcode({ id }: { id: string }) {
  return (
    <div className="mt-4 flex h-10 items-end gap-px" aria-hidden>
      {id.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="bg-ink"
          style={{ width: (char.charCodeAt(0) % 3) + 1, height: 18 + ((char.charCodeAt(0) + index) % 5) * 4 }}
        />
      ))}
    </div>
  )
}
