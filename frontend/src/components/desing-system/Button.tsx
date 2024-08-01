import clsx from 'clsx'
import { PropsWithChildren } from 'react'

export interface ButtonProps {
  disabled?: boolean
  onClick?: () => void
}

export const Button = ({ onClick, disabled, children }: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      type="button"
      className={clsx(
        'flex gap-1 items-center',
        'rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm',
        disabled && 'opacity-50 cursor-not-allowed'
        //'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
        //'text-white bg-genesy-600 hover:bg-genesy-400'
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
