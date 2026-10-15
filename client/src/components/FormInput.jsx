import { forwardRef, useId } from 'react'

// Label above the input, optional helper text, error below (never placeholder-as-label).
const FormInput = forwardRef(function FormInput(
  { label, error, hint, id, className = '', ...inputProps },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId
  const describedById = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={inputId}
        className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedById}
        className={[
          'w-full rounded-xl border bg-surface px-3.5 py-3 text-sm text-ink',
          'transition-[border-color,box-shadow] duration-150',
          'placeholder:text-muted/60',
          'focus:outline-none focus:ring-4',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
            : 'border-line focus:border-navy-hover focus:ring-navy-hover/15',
        ].join(' ')}
        {...inputProps}
      />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="animate-descend text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
})

export default FormInput
