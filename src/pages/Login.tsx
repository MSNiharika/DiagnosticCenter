import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useStore } from "../context/Store"
import { Button, Container, Eyebrow, Field, inputClass, useTitle } from "../components/ui"

function safeNext(value: string | null, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback
  return value
}

export function Login() {
  useTitle("Sign in")
  const [params] = useSearchParams()
  const focus = params.get("as") === "staff" ? "staff" : "patient"
  const next = safeNext(params.get("next"), focus === "staff" ? "/console" : "/reports")
  const { session, signInPatient, signInStaff, signOut } = useStore()
  const navigate = useNavigate()

  return (
    <Container className="py-12">
      <Eyebrow>Sign in</Eyebrow>
      <h1 className="mt-2 max-w-2xl font-display text-5xl tracking-tight">Patient desk or staff desk.</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-ink/65">
        A registered mobile opens only that patient's reports. Staff id <span className="font-medium text-ink">meera</span> opens the lab console. The sample patient is 9848012345 / aurora.
      </p>
      {session && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-sm">
          <p>
            Signed in as <span className="font-medium">{session.name}</span>
            <span className="text-ink/50"> · {session.role === "staff" ? "Staff" : "Patient"}</span>
          </p>
          <div className="flex gap-2">
            <Link to={session.role === "staff" ? "/console" : "/reports"} className="text-teal">
              Continue
            </Link>
            <button type="button" className="text-coral" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      )}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <LoginCard
          id="patient"
          active={focus === "patient"}
          kicker="Patients and customers"
          title="Patient"
          copy="Reports, bookings, and home-collection status for one mobile number."
          fields={[
            { name: "phone", label: "Mobile", placeholder: "9848012345" },
            { name: "password", label: "Password", placeholder: "aurora", secret: true },
          ]}
          hint="Sample account: 9848012345 / aurora. New patients register first."
          onSubmit={(values) => {
            const error = signInPatient(values.phone ?? "", values.password ?? "")
            if (!error) navigate(next === "/console" ? "/reports" : next)
            return error
          }}
        />
        <LoginCard
          id="staff"
          active={focus === "staff"}
          kicker="Laboratory"
          title="Staff login"
          copy="Front desk, sample floor, validation, billing, and the rest of Aurora OS."
          fields={[
            { name: "id", label: "Staff id", placeholder: "meera" },
            { name: "password", label: "Password", placeholder: "aurora", secret: true },
          ]}
          hint="Try meera / aurora"
          onSubmit={(values) => {
            const error = signInStaff(values.id ?? "", values.password ?? "")
            if (!error) navigate(params.get("next") ? next : "/console")
            return error
          }}
        />
      </div>
    </Container>
  )
}

function LoginCard({
  id,
  active,
  kicker,
  title,
  copy,
  fields,
  hint,
  onSubmit,
}: {
  id: string
  active: boolean
  kicker: string
  title: string
  copy: string
  fields: { name: string; label: string; placeholder: string; secret?: boolean }[]
  hint: string
  onSubmit: (values: Record<string, string>) => string | null
}) {
  const [error, setError] = useState("")
  const [values, setValues] = useState<Record<string, string>>({})

  function submit(event: FormEvent) {
    event.preventDefault()
    const message = onSubmit(values)
    setError(message ?? "")
  }

  return (
    <form id={id} onSubmit={submit} className={`rounded-[28px] border bg-paper p-6 ${active ? "border-ink" : "border-line"}`}>
      <p className="text-xs uppercase tracking-[0.16em] text-brass">{kicker}</p>
      <h2 className="mt-2 font-display text-3xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink/65">{copy}</p>
      <div className="mt-5 grid gap-3">
        {fields.map((field) => (
          <Field key={field.name} label={field.label}>
            <input
              className={inputClass}
              type={field.secret ? "password" : "text"}
              placeholder={field.placeholder}
              autoComplete={field.secret ? "current-password" : "username"}
              value={values[field.name] ?? ""}
              onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
            />
          </Field>
        ))}
        {error && <p className="text-sm text-coral">{error}</p>}
        <Button type="submit">{title}</Button>
        <p className="text-xs text-ink/45">{hint}</p>
        {id === "patient" && (
          <Link to="/register" className="text-sm font-semibold text-teal">
            New patient? Register
          </Link>
        )}
      </div>
    </form>
  )
}
