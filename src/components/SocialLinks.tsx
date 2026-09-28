const networks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com",
    path: "M15.1 8.5h-2V7.1c0-.5.3-.6.6-.6H15V4.1l-2.2-.1c-2.4 0-3 1.8-3 3v1.5H8v2.4h1.8V20h2.3v-9.1h2l.1-2.4z",
  },
  {
    name: "X",
    href: "https://x.com",
    path: "M6 5.5h2.4l3.1 4.2L15.2 5.5H18l-4.6 6.1L18.4 18.5h-2.4l-3.4-4.6-3.8 4.6H6.2l5-6.6L6 5.5z",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com",
    path: "M8 4.5h8A3.5 3.5 0 0 1 19.5 8v8a3.5 3.5 0 0 1-3.5 3.5H8A3.5 3.5 0 0 1 4.5 16V8A3.5 3.5 0 0 1 8 4.5zm8 1.6H8A1.9 1.9 0 0 0 6.1 8v8A1.9 1.9 0 0 0 8 17.9h8a1.9 1.9 0 0 0 1.9-1.9V8A1.9 1.9 0 0 0 16 6.1zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM16.7 7.1a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9z",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com",
    path: "M7.2 9.2H5V19h2.2zm.2-2.6A1.3 1.3 0 1 1 6.1 5.3a1.3 1.3 0 0 1 1.3 1.3zM19 19h-2.2v-4.8c0-1.2-.4-2-1.5-2a1.6 1.6 0 0 0-1.5 1.1 2 2 0 0 0-.1.7V19H11.5s.1-7.4 0-8.2h2.2v1.2a2.4 2.4 0 0 1 2.1-1.2c1.6 0 2.7 1 2.7 3.2z",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com",
    path: "M19.2 8.2a2.2 2.2 0 0 0-1.6-1.6C16.2 6.3 12 6.3 12 6.3s-4.2 0-5.6.3a2.2 2.2 0 0 0-1.6 1.6A23 23 0 0 0 4.5 12a23 23 0 0 0 .3 3.8 2.2 2.2 0 0 0 1.6 1.6c1.4.3 5.6.3 5.6.3s4.2 0 5.6-.3a2.2 2.2 0 0 0 1.6-1.6 23 23 0 0 0 .3-3.8 23 23 0 0 0-.3-3.8zM10.6 14.6V9.4L15 12z",
  },
]

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {networks.map((network) => (
        <li key={network.name}>
          <a
            href={network.href}
            target="_blank"
            rel="noreferrer"
            aria-label={network.name}
            className="grid h-11 w-11 place-items-center rounded-[10px] bg-black text-white transition hover:bg-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path fill="currentColor" d={network.path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
