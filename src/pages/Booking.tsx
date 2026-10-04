import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useSearchParams } from "react-router-dom"
import { tests } from "../data/catalog"
import { testById } from "../data/catalog"
import { centres } from "../data/network"
import type { Gender, PayMode, VisitMode } from "../data/types"
import type { Order } from "../data/types"
import { useStore } from "../context/Store"
import { SLOT_TIMES, digits, inr, slotPassed, upcomingDays } from "../lib/utils"
import { Button, ButtonLink, Container, Eyebrow, Field, inputClass, useTitle } from "../components/ui"

export function Booking() {
  useTitle("Book")
  const [params] = useSearchParams()
  const { cart, cartTotal, addTest, removeItem, city, placeOrder, session, accountFor } = useStore()
  const mine = session?.role === "patient" ? accountFor(session.phone) : null
  const days = useMemo(() => upcomingDays(5), [])
  const firstOpen = SLOT_TIMES.every((time) => slotPassed(0, time)) ? 1 : 0
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<VisitMode>(params.get("mode") === "home" ? "Home collection" : "Centre visit")
  const [centreId, setCentreId] = useState(centres.find((centre) => centre.city === city)?.id ?? centres[0].id)
  const [day, setDay] = useState(firstOpen)
  const [time, setTime] = useState(SLOT_TIMES.find((slot) => !slotPassed(firstOpen, slot)) ?? SLOT_TIMES[0])
  const [promo, setPromo] = useState("")
  const [promoOn, setPromoOn] = useState(false)
  const [pay, setPay] = useState<PayMode>("UPI")
  const [demoOk, setDemoOk] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState<Order | null>(null)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "Female" as Gender,
    address: "",
  })

  useEffect(() => {
    if (!mine) return
    const born = new Date(mine.dob)
    let years = 0
    if (!Number.isNaN(born.getTime())) {
      const now = new Date()
      years = now.getFullYear() - born.getFullYear()
      const month = now.getMonth() - born.getMonth()
      if (month < 0 || (month === 0 && now.getDate() < born.getDate())) years -= 1
    }
    setForm((current) => ({
      ...current,
      name: mine.name,
      phone: mine.phone,
      gender: mine.gender,
      age: current.age || String(Math.max(0, years)),
    }))
  }, [mine])

  const centre = centres.find((item) => item.id === centreId) ?? centres[0]
  const testIds = [...new Set(cart.flatMap((item) => item.testIds))]
  const centreOnly = testIds.map((id) => testById(id)).filter((test) => test && !test.home)
  const gaps = coverageGaps(centre.services, testIds)
  const discount = promoOn ? Math.round(cartTotal * 0.2) : 0
  const homeFee = mode === "Home collection" && cartTotal > 0 && cartTotal < 500 ? 150 : 0
  const total = Math.max(0, cartTotal - discount + homeFee)

  function applyPromo() {
    if (promo.trim().toUpperCase() === "AURORA20") {
      setPromoOn(true)
      setError("")
    } else {
      setPromoOn(false)
      setError("That code is not active. Try AURORA20.")
    }
  }

  function continueVisit() {
    if (cart.length === 0) {
      setError("Add at least one test.")
      return
    }
    setError("")
    setStep(1)
  }

  function continueDetails() {
    if (slotPassed(day, time)) {
      setError("That slot has already passed.")
      return
    }
    if (mode === "Home collection" && centreOnly.length > 0) {
      setError(`${centreOnly.map((test) => test?.name).join(", ")} cannot be collected at home.`)
      return
    }
    if (gaps.length > 0) {
      setError(`${centre.name} does not run ${gaps.join(" & ")}. Pick another centre.`)
      return
    }
    setError("")
    setStep(2)
  }

  function confirm() {
    const phone = mine ? mine.phone : digits(form.phone)
    const age = Number(form.age)
    const patientName = mine ? mine.name : form.name.trim()
    if (patientName.length < 2) return setError("Add the patient's name.")
    if (phone.length !== 10) return setError("Use a 10-digit mobile number.")
    if (!Number.isFinite(age) || age < 1 || age > 110) return setError("Age should be between 1 and 110.")
    if (mode === "Home collection" && form.address.trim().length < 8) return setError("Add a full collection address.")
    if (!demoOk) return setError("Confirm that this is a demonstration booking.")
    const order = placeOrder({
      mode,
      centre: centre.name,
      slot: `${days[day]} · ${time}`,
      address: mode === "Home collection" ? form.address.trim() : undefined,
      patient: { name: patientName, phone, age, gender: mine?.gender ?? form.gender },
      total,
      pay,
    })
    setDone(order)
    setStep(3)
    setError("")
  }

  if (done && step === 3) {
    return (
      <Container className="py-16">
        <Eyebrow>Booking confirmed</Eyebrow>
        <h1 className="mt-2 font-display text-5xl tracking-tight">{done.id}</h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-ink/70">
          {done.patient} is booked for {done.slot} at {done.centre}. No payment was taken and no sample will be collected — this console is a demonstration.
        </p>
        <div className="mt-6 max-w-lg rounded-[24px] border border-line bg-paper p-5 text-sm">
          <p>{done.mode}</p>
          <p className="mt-1">{done.items.map((item) => item.name).join(", ")}</p>
          <p className="mt-3 font-medium">{inr(done.total)} · {done.paid ? "Marked paid" : "Pay at centre"}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <ButtonLink to={`/reports?order=${done.id}`}>Track the report</ButtonLink>
          <ButtonLink to="/console" variant="ink">
            See it on the lab queue
          </ButtonLink>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-12">
      <Eyebrow>Booking</Eyebrow>
      <h1 className="mt-2 font-display text-5xl tracking-tight">Choose the tests, then the hour.</h1>
      <ol className="mt-6 flex flex-wrap gap-2 text-xs">
        {["Tests", "Visit", "Details"].map((label, index) => (
          <li key={label} className={`rounded-full px-3 py-1.5 ${step === index ? "bg-ink text-ivory" : "bg-paper text-ink/55 ring-1 ring-line"}`}>
            0{index + 1} {label}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-line bg-paper p-5 md:p-7">
          {step === 0 && (
            <div>
              {cart.length === 0 && (
                <div>
                  <p className="text-sm text-ink/65">Your list is empty. Start with something common, or browse the catalogue.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tests.filter((test) => test.popular).slice(0, 5).map((test) => (
                      <button key={test.id} type="button" className="rounded-full bg-ivory px-3 py-1.5 text-xs" onClick={() => addTest(test.id)}>
                        + {test.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <ul className="divide-y divide-line">
                {cart.map((item) => (
                  <li key={item.key} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-ink/45">{item.kind === "package" ? `${item.testIds.length} tests` : "Single test"}</p>
                    </div>
                    <div className="text-right">
                      <p>{inr(item.price)}</p>
                      <button type="button" className="text-xs text-coral" onClick={() => removeItem(item.key)}>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <input value={promo} onChange={(event) => setPromo(event.target.value)} placeholder="Code AURORA20" className={inputClass} aria-label="Offer code" />
                <Button type="button" variant="ink" onClick={applyPromo}>
                  Apply
                </Button>
              </div>
              {promoOn && <p className="mt-2 text-sm text-teal">20% off applied.</p>}
              <div className="mt-5 flex gap-2">
                <Button type="button" onClick={continueVisit}>
                  Choose a visit
                </Button>
                <ButtonLink to="/tests" variant="ghost">
                  Add more
                </ButtonLink>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {(["Centre visit", "Home collection"] as VisitMode[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMode(option)}
                    className={`rounded-full px-4 py-2 text-sm ${mode === option ? "bg-ink text-ivory" : "bg-ivory"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <Field label={mode === "Home collection" ? "Processing centre" : "Centre"}>
                  <select className={inputClass} value={centreId} onChange={(event) => setCentreId(event.target.value)}>
                    {centres.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.city} — {item.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <p className="mt-2 text-xs text-ink/50">{centre.services.join(" · ")}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {days.map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setDay(index)}
                    className={`rounded-2xl px-3 py-2 text-xs ${day === index ? "bg-teal text-white" : "bg-ivory"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {SLOT_TIMES.map((slot) => {
                  const closed = slotPassed(day, slot)
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={closed}
                      onClick={() => setTime(slot)}
                      className={`rounded-xl px-2 py-2 text-xs ${time === slot ? "bg-ink text-ivory" : "bg-ivory"} disabled:opacity-30`}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
              <div className="mt-5 flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button type="button" onClick={continueDetails}>
                  Patient details
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3">
              <Field label="Patient name">
                <input className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </Field>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Mobile">
                  <input className={inputClass} inputMode="numeric" value={mine ? mine.phone : form.phone} readOnly={Boolean(mine)} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                </Field>
                <Field label="Age">
                  <input className={inputClass} inputMode="numeric" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} />
                </Field>
                <Field label="Gender">
                  <select className={inputClass} value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value as Gender })}>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>
              {mode === "Home collection" && (
                <Field label="Collection address">
                  <textarea className={inputClass} rows={3} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
                </Field>
              )}
              <div>
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink/45">Payment</p>
                <div className="flex flex-wrap gap-2">
                  {(["UPI", "Card", "Pay at centre"] as PayMode[]).map((option) => (
                    <button key={option} type="button" onClick={() => setPay(option)} className={`rounded-full px-3 py-1.5 text-xs ${pay === option ? "bg-ink text-ivory" : "bg-ivory"}`}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-start gap-2 text-sm text-ink/70">
                <input type="checkbox" className="mt-1" checked={demoOk} onChange={(event) => setDemoOk(event.target.checked)} />
                I understand this is a demonstration. No charge will be made and no one will visit.
              </label>
              <div className="mt-2 flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" onClick={confirm}>
                  Confirm booking
                </Button>
              </div>
            </div>
          )}
          {error && <p className="mt-4 text-sm text-coral">{error}</p>}
        </div>

        <aside className="h-fit rounded-[28px] border border-line bg-ivory p-5">
          <h2 className="font-display text-2xl">Summary</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {cart.map((item) => (
              <li key={item.key} className="flex justify-between gap-3">
                <span>{item.name}</span>
                <span>{inr(item.price)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-line pt-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(cartTotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-teal"><dt>Offer</dt><dd>−{inr(discount)}</dd></div>}
            {homeFee > 0 && <div className="flex justify-between"><dt>Home visit</dt><dd>{inr(homeFee)}</dd></div>}
            <div className="flex justify-between font-medium"><dt>Total</dt><dd>{inr(total)}</dd></div>
          </dl>
          <p className="mt-4 text-xs leading-5 text-ink/50">
            {mode} · {centre.name}
            {step > 0 ? ` · ${days[day]} ${time}` : ""}
          </p>
          <Link to="/prescription" className="mt-3 inline-block text-xs text-teal">
            Have a prescription instead?
          </Link>
        </aside>
      </div>
    </Container>
  )
}

function coverageGaps(services: string[], testIds: string[]) {
  const categories = new Set(testIds.map((id) => testById(id)?.category))
  const gaps: string[] = []
  if ((categories.has("Pathology") || categories.has("Molecular")) && !services.includes("Pathology")) gaps.push("pathology")
  if (categories.has("Radiology") && !services.includes("Radiology")) gaps.push("radiology")
  if (categories.has("Cardiology") && !services.includes("Cardiology")) gaps.push("cardiology")
  return gaps
}
