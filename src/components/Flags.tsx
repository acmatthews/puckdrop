import type { BroadcastCountry } from '../broadcasts'

type Props = {
  country: BroadcastCountry
}

export function Flag({ country }: Props) {
  if (country === 'CA') return <CanadaFlag />
  if (country === 'US') return <UsaFlag />
  return <UkFlag />
}

function CanadaFlag() {
  return (
    <svg className="flag" viewBox="0 0 24 12" role="img" aria-label="Canada">
      <rect width="6" height="12" fill="#d80621" />
      <rect x="18" width="6" height="12" fill="#d80621" />
      <rect x="6" width="12" height="12" fill="#fff" />
      <path
        fill="#d80621"
        d="M12 2.2 13 4.2h1.6L13.2 5.3 13.8 7.2 12 6.2 10.2 7.2 10.8 5.3 9.4 4.2H11zM11.4 7.1h1.2V9.6h-1.2z"
      />
    </svg>
  )
}

function UsaFlag() {
  return (
    <svg className="flag" viewBox="0 0 24 12" role="img" aria-label="United States">
      <rect width="24" height="12" fill="#fff" />
      <rect width="24" height="1.5" y="0" fill="#b22234" />
      <rect width="24" height="1.5" y="3" fill="#b22234" />
      <rect width="24" height="1.5" y="6" fill="#b22234" />
      <rect width="24" height="1.5" y="9" fill="#b22234" />
      <rect width="10" height="6.5" fill="#3c3b6e" />
      <g fill="#fff">
        <circle cx="1.6" cy="1.3" r="0.35" />
        <circle cx="3.4" cy="1.3" r="0.35" />
        <circle cx="5.2" cy="1.3" r="0.35" />
        <circle cx="7" cy="1.3" r="0.35" />
        <circle cx="8.6" cy="1.3" r="0.35" />
        <circle cx="2.5" cy="2.6" r="0.35" />
        <circle cx="4.3" cy="2.6" r="0.35" />
        <circle cx="6.1" cy="2.6" r="0.35" />
        <circle cx="7.9" cy="2.6" r="0.35" />
        <circle cx="1.6" cy="3.9" r="0.35" />
        <circle cx="3.4" cy="3.9" r="0.35" />
        <circle cx="5.2" cy="3.9" r="0.35" />
        <circle cx="7" cy="3.9" r="0.35" />
        <circle cx="8.6" cy="3.9" r="0.35" />
        <circle cx="2.5" cy="5.2" r="0.35" />
        <circle cx="4.3" cy="5.2" r="0.35" />
        <circle cx="6.1" cy="5.2" r="0.35" />
        <circle cx="7.9" cy="5.2" r="0.35" />
      </g>
    </svg>
  )
}

function UkFlag() {
  return (
    <svg className="flag" viewBox="0 0 60 30" role="img" aria-label="United Kingdom">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0 60 30M60 0 0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0 60 30M60 0 0 30" stroke="#c8102e" strokeWidth="3" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  )
}
