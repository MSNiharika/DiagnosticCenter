import { useState } from "react"
import type { FormEvent } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { UserRound } from "lucide-react"
import type { Account } from "../context/Store"
import { useStore } from "../context/Store"
import type { Gender } from "../data/types"
import { digits } from "../lib/utils"
import { Button, Container, Eyebrow, Field, inputClass, useTitle } from "../components/ui"

const titles = ["Mr", "Mrs", "Ms", "Dr", "Master", "Baby"]
const genders: { id: Gender; label: string }[] = [
  { id: "Female", label: "Female" },
  { id: "Male", label: "Male" },
  { id: "Other", label: "Others" },
]

export function Register() {
  return <AccountForm mode="register" />
}

export function Profile() {
  return <AccountForm mode="profile" />
}

function AccountForm({ mode }: { mode: "register" | "profile" }) {
  useTitle(mode === "register" ? "Register" : "Profile")
  const { session, accountFor, register, updateProfile } = useStore()
  const navigate = useNavigate()
  const existing = session?.role === "patient" ? accountFor(session.phone) : null

  if (mode === "profile" && session?.role !== "patient") {
    return <Navigate to="/login?next=/profile" replace />
  }
  if (mode === "register" && session?.role === "patient") {
    return <Navigate to="/reports" replace />
  }

  return (
    <Container className="max-w-3xl py-10">
      <Eyebrow>{mode === "register" ? "New patient" : "Your account"}</Eyebrow>
      <h1 className="mt-2">{mode === "register" ? "Register" : "Edit profile"}</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-ink/65">
        {mode === "register"
          ? "Create an account with your mobile number. After you sign in, the report portal shows only bookings on that number."
          : "These details are the ones on your bookings and reports."}
      </p>
      <Form
        key={existing?.phone ?? "new"}
        mode={mode}
        initial={existing}
        onSubmit={(account) => {
          const error = mode === "register" ? register(account) : updateProfile(account)
          if (!error) navigate(mode === "register" ? "/reports" : "/profile")
          return error
        }}
      />
      {mode === "register" && (
        <p className="mt-4 text-sm text-ink/60">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-teal">
            Sign in
          </Link>
        </p>
      )}
    </Container>
  )
}

function Form({
  mode,
  initial,
  onSubmit,
}: {
  mode: "register" | "profile"
  initial: Account | null
  onSubmit: (account: Account) => string | null
}) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [name, setName] = useState(initial?.name ?? "")
  const [dob, setDob] = useState(initial?.dob ?? "")
  const [gender, setGender] = useState<Gender | "">(initial?.gender ?? "")
  const [phone, setPhone] = useState(initial?.phone ?? "")
  const [altPhone, setAltPhone] = useState(initial?.altPhone ?? "")
  const [email, setEmail] = useState(initial?.email ?? "")
  const [password, setPassword] = useState(mode === "profile" ? (initial?.password ?? "") : "")
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)

  function submit(event: FormEvent) {
    event.preventDefault()
    setSaved(false)
    if (!title) return setError("Select a title.")
    if (name.trim().length < 2) return setError("Enter your name.")
    if (!dob) return setError("Enter your date of birth.")
    if (new Date(dob) > new Date()) return setError("Date of birth cannot be in the future.")
    if (!gender) return setError("Select a gender.")
    const mobile = digits(phone)
    if (mobile.length !== 10) return setError("Use a 10-digit mobile number.")
    const alternate = digits(altPhone)
    if (alternate && alternate.length !== 10) return setError("Alternate mobile needs 10 digits, or leave it blank.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Enter a valid email.")
    if (password.trim().length < 4) return setError("Password needs at least 4 characters.")
    const message = onSubmit({
      title,
      name: name.trim(),
      dob,
      gender,
      phone: mobile,
      altPhone: alternate,
      email: email.trim(),
      password: password.trim(),
    })
    setError(message ?? "")
    if (!message && mode === "profile") setSaved(true)
  }

  return (
    <form onSubmit={submit} className="mt-8 rounded-md border border-line bg-white p-5 sm:p-8">
      <h2 className="border-b border-line pb-3 text-base">Basic information</h2>
      <div className="mt-5 grid gap-4">
        <Field label="Title">
          <select className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} required>
            <option value="">Select title</option>
            {titles.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Your name">
          <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} placeholder="Eg., John" required />
        </Field>
        <Field label="Date of birth">
          <input className={inputClass} type="date" value={dob} onChange={(event) => setDob(event.target.value)} required />
        </Field>
        <fieldset>
          <legend className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-ink/45">Gender</legend>
          <div className="flex gap-6">
            {genders.map((item) => {
              const on = gender === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setGender(item.id)}
                  className="flex flex-col items-center gap-1 text-xs font-semibold"
                >
                  <span className={`grid h-12 w-12 place-items-center rounded-full border-2 ${on ? "border-teal text-teal" : "border-line text-ink/35"}`}>
                    <UserRound className="h-6 w-6" />
                  </span>
                  {item.label}
                </button>
              )
            })}
          </div>
        </fieldset>
        <Field label="Mobile">
          <input
            className={inputClass}
            inputMode="numeric"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="10-digit mobile"
            readOnly={mode === "profile"}
            required
          />
        </Field>
        <Field label="Alternate mobile">
          <input className={inputClass} inputMode="numeric" value={altPhone} onChange={(event) => setAltPhone(event.target.value)} />
        </Field>
        <Field label="Email">
          <input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </Field>
        <Field label={mode === "profile" ? "Password" : "Password"}>
          <input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "register" ? "new-password" : "current-password"} required />
        </Field>
        {error && <p className="text-sm text-coral">{error}</p>}
        {saved && <p className="text-sm text-teal">Profile saved. Your reports stay on this mobile number.</p>}
        <Button type="submit" className="w-fit uppercase tracking-wide">
          {mode === "register" ? "Register" : "Update profile"}
        </Button>
      </div>
    </form>
  )
}
