import { useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import { doctors } from "../data/network"
import { modules } from "../data/modules"
import { tests } from "../data/catalog"
import { useStore } from "../context/Store"
import { Button, ButtonLink, Container, Eyebrow, Field, Photo, inputClass, useTitle } from "../components/ui"

export function Corporate() {
  useTitle("Corporate wellness")
  const [sent, setSent] = useState(false)
  function submit(event: FormEvent) {
    event.preventDefault()
    setSent(true)
  }
  return (
    <Container className="py-12">
      <Eyebrow>Employers</Eyebrow>
      <h1 className="mt-2 max-w-2xl font-display text-5xl tracking-tight">A draw camp that does not become a spreadsheet.</h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-ink/70">
        Aurora runs on-site collections for teams from 25 people up. Each employee gets a private portal login. HR receives a de-identified summary, never a named report, unless the employee opts in.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Essential camp", "CBC, lipids, sugar, TSH", "From ₹899 / person"],
          ["Executive camp", "Platinum panel plus ECG", "From ₹4,200 / person"],
          ["Women's day", "Thyroid, vitamin D, iron", "From ₹1,499 / person"],
        ].map(([title, copy, price]) => (
          <article key={title} className="rounded-[24px] border border-line bg-paper p-5">
            <h2 className="font-display text-2xl">{title}</h2>
            <p className="mt-2 text-sm text-ink/65">{copy}</p>
            <p className="mt-4 text-sm font-medium">{price}</p>
          </article>
        ))}
      </div>
      <form onSubmit={submit} className="mt-8 max-w-xl rounded-[28px] border border-line bg-paper p-6">
        {sent ? (
          <p className="text-sm leading-6">
            Request noted. In this demonstration nobody is emailed — a coordinator would call the number you entered on a live account.
          </p>
        ) : (
          <div className="grid gap-3">
            <h2 className="font-display text-3xl">Ask for a camp</h2>
            <Field label="Company"><input required className={inputClass} /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="City"><input required className={inputClass} /></Field>
              <Field label="Headcount"><input required inputMode="numeric" className={inputClass} /></Field>
            </div>
            <Field label="Work email"><input required type="email" className={inputClass} /></Field>
            <Field label="Phone"><input required className={inputClass} /></Field>
            <Button type="submit">Send the request</Button>
          </div>
        )}
      </form>
    </Container>
  )
}

export function Prescription() {
  useTitle("Prescription")
  const { addTest } = useStore()
  const [file, setFile] = useState("")
  const suggestions = ["cbc", "dengue", "crp", "urine"].map((id) => tests.find((test) => test.id === id)).filter((test) => test !== undefined)
  return (
    <Container className="grid items-start gap-8 py-12 lg:grid-cols-2">
      <div>
        <Eyebrow>Prescription desk</Eyebrow>
        <h1 className="mt-2 font-display text-5xl tracking-tight">Photograph the slip. A coordinator reads it.</h1>
        <p className="mt-4 text-sm leading-7 text-ink/70">
          We do not guess a panel from a photo on this demo. On a live desk, a coordinator confirms the tests with you before anyone is sent to draw blood.
        </p>
        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-brass/50 bg-paper px-6 py-12 text-center">
          <span className="font-medium">{file || "Drop a photo or PDF"}</span>
          <span className="mt-1 text-xs text-ink/50">It stays on this device. Nothing is uploaded.</span>
          <input
            type="file"
            accept="image/*,.pdf"
            className="sr-only"
            onChange={(event) => setFile(event.target.files?.[0]?.name ?? "")}
          />
        </label>
        {file && <p className="mt-3 text-sm text-teal">{file} is ready for a coordinator. Add any tests you already know.</p>}
      </div>
      <div>
        <h2 className="font-display text-3xl">Often paired with a fever slip</h2>
        <ul className="mt-4 space-y-2">
          {suggestions.map((test) => (
            <li key={test.id} className="flex items-center justify-between rounded-2xl border border-line bg-paper px-4 py-3">
              <Link to={`/tests/${test.id}`} className="text-sm font-medium">
                {test.name}
              </Link>
              <button type="button" className="text-xs text-coral" onClick={() => addTest(test.id)}>
                Add
              </button>
            </li>
          ))}
        </ul>
        <ButtonLink to="/book" className="mt-5">
          Continue to a slot
        </ButtonLink>
      </div>
    </Container>
  )
}

export function Doctors() {
  useTitle("Doctors")
  return (
    <Container className="py-12">
      <Eyebrow>Consultants</Eyebrow>
      <h1 className="mt-2 max-w-xl font-display text-5xl tracking-tight">The names on the bottom of the page.</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {doctors.map((doctor) => (
          <article key={doctor.id} className="grid overflow-hidden rounded-[28px] border border-line bg-paper sm:grid-cols-[200px_1fr]">
            <Photo src={doctor.photo} alt={doctor.name} face className="h-72 sm:h-full" />
            <div className="p-5">
              <h2 className="font-display text-3xl">{doctor.name}</h2>
              <p className="text-sm text-teal">{doctor.role}</p>
              <p className="mt-2 text-sm text-ink/60">{doctor.cred}</p>
              <p className="mt-3 text-sm leading-6">{doctor.focus}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-ink/40">{doctor.centre}</p>
            </div>
          </article>
        ))}
      </div>
    </Container>
  )
}

export function Contact() {
  useTitle("Contact")
  const [sent, setSent] = useState(false)
  return (
    <Container className="grid gap-10 py-12 lg:grid-cols-2">
      <div>
        <Eyebrow>Talk to us</Eyebrow>
        <h1 className="mt-2 font-display text-5xl tracking-tight">Call the Yanam desk on 0884 232 4500.</h1>
        <p className="mt-4 text-sm leading-7 text-ink/70">
          Reports, slot changes, and home collection in Yanam. For a critical value already released, the duty pathologist calls the referring doctor directly.
        </p>
        <dl className="mt-6 space-y-3 text-sm">
          <div><dt className="text-ink/45">Phone</dt><dd>0884 232 4500 · 7:00 AM to 8:00 PM</dd></div>
          <div><dt className="text-ink/45">Email</dt><dd>care@auroradiagnostics.example</dd></div>
          <div><dt className="text-ink/45">Centre</dt><dd>D. No. 8-2-14, Ferry Road, Yanam, Puducherry 533464</dd></div>
        </dl>
      </div>
      <form
        className="rounded-[28px] border border-line bg-paper p-6"
        onSubmit={(event) => {
          event.preventDefault()
          setSent(true)
        }}
      >
        {sent ? (
          <p className="text-sm leading-6">Message kept on this page only. Nothing was sent.</p>
        ) : (
          <div className="grid gap-3">
            <Field label="Name"><input required className={inputClass} /></Field>
            <Field label="Mobile"><input required className={inputClass} /></Field>
            <Field label="About">
              <select className={inputClass}>
                <option>A report</option>
                <option>Change a slot</option>
                <option>A centre</option>
                <option>Corporate camp</option>
              </select>
            </Field>
            <Field label="Message"><textarea required rows={4} className={inputClass} /></Field>
            <Button type="submit">Leave a note</Button>
          </div>
        )}
      </form>
    </Container>
  )
}

export function Platform() {
  useTitle("Aurora OS")
  return (
    <Container className="py-12">
      <Eyebrow>Lab software</Eyebrow>
      <h1 className="mt-2 max-w-3xl font-display text-5xl tracking-tight">Twelve modules. One accession number from the door to the signature.</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
        Aurora OS is the management system the centres run on: front desk, samples, worklists, validation, billing, stock, riders, referrals, quality, people, and the week's numbers. The console is loaded with a sample morning so you can click through a real queue.
      </p>
      <ButtonLink to="/console" className="mt-6">
        Open the live console
      </ButtonLink>
      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {modules.map((item, index) => (
          <Link key={item.to} to={item.to} className="rounded-[24px] border border-line bg-paper p-5 hover:border-ink/25">
            <p className="text-[11px] uppercase tracking-[0.16em] text-brass">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-2 font-display text-2xl">{item.label}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">{item.blurb}</p>
          </Link>
        ))}
      </div>
    </Container>
  )
}

export function NotFound() {
  useTitle("Not found")
  return (
    <Container className="py-24">
      <h1 className="font-display text-5xl">That page is not on the floor.</h1>
      <ButtonLink to="/" variant="ink" className="mt-6">
        Back home
      </ButtonLink>
    </Container>
  )
}
