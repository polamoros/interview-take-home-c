import clsx from 'clsx'
import { forwardRef, PropsWithChildren } from 'react'

export interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  transparent?: boolean
  className?: string
}

export const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>(
  ({ onClick, disabled, transparent, className, children }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          'flex gap-1 items-center outline-none',
          'rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm',
          disabled && 'opacity-50 cursor-not-allowed',
          'border border-gray-300',
          !transparent && 'bg-[#1a1a1a] text-white',
          transparent && 'text-gray-700 bg-transparent hover:bg-gray-50',
          className
        )}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
)
