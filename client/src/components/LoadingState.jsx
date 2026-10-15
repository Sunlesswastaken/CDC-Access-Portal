// Full-screen loading state used while the stored session is being verified.
export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-canvas">
      <div className="flex items-center gap-3 text-muted" role="status" aria-live="polite">
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-line border-t-navy"
        />
        <span className="font-mono text-xs uppercase tracking-[0.16em]">{label}</span>
      </div>
    </div>
  )
}
