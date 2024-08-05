'use client'

import { PropsWithChildren } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import clsx from 'clsx'

export const ModalTitle = ({ children }: PropsWithChildren) => {
  return (
    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
      {children}
    </DialogTitle>
  )
}

export const ModalBody = ({
  icon,
  children,
}: PropsWithChildren<{
  icon?: React.ReactNode
}>) => {
  return (
    <div className="flex items-start mt-2 w-full gap-4">
      {icon}
      <div className="text-left grow flex flex-col gap-2 text-sm text-gray-500 w-full">{children}</div>
    </div>
  )
}

export const ModalFooter = ({ children }: PropsWithChildren) => {
  return <div className="mt-4 flex flex-row-reverse gap-2.5">{children}</div>
}

export interface ModalProps {
  visible: boolean
  setVisible?: (visible: boolean) => void
  size?: 'sm' | 'md' | 'lg'
}

export const Modal = ({ visible, setVisible, size = 'md', children }: PropsWithChildren<ModalProps>) => {
  return (
    <Dialog open={visible} onClose={() => setVisible?.(false)} className="relative z-10">
      <DialogBackdrop
        transition
        className={clsx(
          'fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity',
          // animation classes
          'data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in'
        )}
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full w-full justify-center p-4 text-center items-center">
          <DialogPanel
            transition
            className={clsx(
              size === 'sm' && 'max-w-md',
              size === 'md' && 'max-w-lg',
              size === 'lg' && 'max-w-2xl',
              'relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all my-8 w-full p-6',
              // animation classes
              'transform data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in',
              'data-[enter]:duration-300 data-[leave]:duration-200 data-[closed]:translate-y-0 data-[closed]:scale-95'
            )}
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
