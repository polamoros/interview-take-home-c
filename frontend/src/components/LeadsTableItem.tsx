import clsx from 'clsx'
import { FC, useMemo } from 'react'
import { Lead } from '../api/types/leads'

export const LeadTableItem: FC<{ lead: Lead; selected: boolean; onSelect: () => void }> = ({
  lead,
  selected,
  onSelect,
}) => {
  const createdAt = useMemo(() => new Date(lead.createdAt).toLocaleString(), [lead.createdAt])
  const updatedAt = useMemo(() => new Date(lead.updatedAt).toLocaleString(), [lead.updatedAt])

  return (
    <tr
      key={lead.email}
      className={clsx(
        selected && 'bg-genesy-500',
        !selected && 'bg-genesy-600',
        'text-sm text-left whitespace-nowrap'
      )}
    >
      <td className="relative px-5 sm:w-12">
        {selected && <div className="absolute inset-y-0 left-0 w-1 bg-genesy-700" />}
        <input
          type="checkbox"
          className={clsx(
            'absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded',
            'border-genesy-700 text-genesy-700 focus:ring-genesy-700'
          )}
          value={lead.email}
          checked={selected}
          onChange={onSelect}
        />
      </td>
      <td className="pr-3 py-2.5 truncate">{lead.firstName}</td>
      <td className="px-3 py-2.5 truncate">{lead.lastName}</td>
      <td className="px-3 py-2.5 truncate">{lead.countryCode}</td>
      <td className="px-3 py-2.5 truncate max-w-80" title={lead.message}>
        {lead.message}
      </td>
      <td className="px-3 py-2.5 truncate">{lead.email}</td>
      <td className="px-3 py-2.5 truncate">{lead.jobTitle}</td>
      <td className="px-3 py-2.5 truncate">{lead.companyName}</td>
      <td className="px-3 py-2.5 truncate">{createdAt}</td>
      <td className="px-3 py-2.5 truncate">{updatedAt}</td>
    </tr>
  )
}
