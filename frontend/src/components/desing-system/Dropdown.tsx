import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Button } from './Button'
import clsx from 'clsx'

export interface DropdownItem {
  label: string
  onClick?: () => void
}

export interface DropdownProps {
  label: string
  items: DropdownItem[]
  disabled?: boolean
}

export const Dropdown = ({ label, items, disabled }: DropdownProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton as={Button} disabled={disabled}>
          {label}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className={clsx(
          'absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5',
          'py-1 divide-y divide-gray-300',
          'transition focus:outline-none'
        )}
      >
        {items.map((item) => (
          <MenuItem key={item.label}>
            <a
              onClick={item.onClick}
              className={clsx(
                'block px-4 py-2 text-sm',
                'cursor-pointer',
                'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {item.label}
            </a>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}
