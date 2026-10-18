import { forwardRef, useId } from 'react'

// Label above the input, optional hint, error below (never placeholder-as-label).
// Styled to match the Attendance Studio form controls.
const FormInput = forwardRef(function FormInput(
  { label, error, hint, id, className = '', ...inputProps },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId
  const describedById = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={inputId} className="ui-field-label mb-1.5 leading-tight">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedById}
        className="ui-input"
        {...inputProps}
      />
      {error ? (
        <p id={`${inputId}-error`} role="alert" data-error="true" className="ui-hint animate-descend mt-1.5">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="ui-hint mt-1.5">
          {hint}
        </p>
      ) : null}
    </div>
  )
})

export default FormInput
