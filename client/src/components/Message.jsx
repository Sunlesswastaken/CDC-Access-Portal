const VARIANTS = {
  error: {
    wrap: 'border-red-200 bg-red-50 text-red-700',
    role: 'alert',
  },
  success: {
    wrap: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    role: 'status',
  },
  info: {
    wrap: 'border-line bg-canvas text-muted',
    role: 'status',
  },
}

export default function Message({ variant = 'info', children, className = '' }) {
  if (!children) return null
  const { wrap, role } = VARIANTS[variant] || VARIANTS.info

  return (
    <div
      role={role}
      className={`animate-descend rounded-xl border px-4 py-3 text-sm leading-relaxed ${wrap} ${className}`}
    >
      {children}
    </div>
  )
}
