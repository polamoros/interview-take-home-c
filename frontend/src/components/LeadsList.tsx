import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { api } from '../api'
import { Lead } from '../api/types/leads'
import clsx from 'clsx'
import { Dropdown } from './desing-system/Dropdown'
import { Button } from './desing-system/Button'

const LeadTableItem: FC<{ lead: Lead; selected: boolean; onSelect: () => void }> = ({
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
      <td className="px-3 py-2.5 truncate">{}</td>
      <td className="px-3 py-2.5 truncate">{lead.email}</td>
      <td className="px-3 py-2.5 truncate">{lead.jobTitle}</td>
      <td className="px-3 py-2.5 truncate">{lead.companyName}</td>
      <td className="px-3 py-2.5 truncate">{createdAt}</td>
      <td className="px-3 py-2.5 truncate">{updatedAt}</td>
    </tr>
  )
}

export const LeadsList: FC = () => {
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([])

  const leads = useQuery({
    queryKey: ['leads', 'getMany'],
    queryFn: async () => api.leads.getMany(),
  })

  const toggleAll = useCallback(() => {
    const newSelectedLeads = checked || indeterminate ? [] : leads.data
    setSelectedLeads(newSelectedLeads || [])
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }, [checked, indeterminate, leads.data])

  if (leads.isLoading) {
    return <div>Loading...</div>
  }

  if (leads.isError) {
    return <div>Error: {leads.error.message}</div>
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-x-3 px-4 text-genesy-100 h-10">
        <div className="text-sm font-semibold">
          {selectedLeads.length > 0 && <div>{selectedLeads.length} selected</div>}
          {selectedLeads.length === 0 && <div>{leads.data?.length} leads</div>}
        </div>

        {selectedLeads.length > 0 && (
          <>
            <div className="w-0.5 h-6 bg-genesy-600" />
            <Button disabled>Delete</Button>
            <Dropdown
              label="Enrich"
              disabled
              items={[
                { label: 'Gender' },
                {
                  label: 'Message',
                },
              ]}
            />
          </>
        )}
      </div>

      <div className="w-full overflow-auto rounded-md">
        <table className="table-fixed divide-y bg-genesy-800 text-genesy-50 shadow-xl">
          <thead>
            <tr className="text-sm font-semibold whitespace-nowrap">
              <th className="relative px-7 sm:w-12 sm:px-6">
                <input
                  type="checkbox"
                  className={clsx(
                    'absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded',
                    'text-genesy-500 border-genesy-500 focus:ring-genesy-500'
                  )}
                  checked={checked}
                  onChange={toggleAll}
                />
              </th>
              <th className="py-3.5 pr-3 text-left">Name</th>
              <th className="px-3 py-3.5 text-left">Last name</th>
              <th className="px-3 py-3.5 text-left">Country</th>
              <th className="px-3 py-3.5 text-left">Message</th>
              <th className="px-3 py-3.5 text-left">Email</th>
              <th className="px-3 py-3.5 text-left">Job title</th>
              <th className="px-3 py-3.5 text-left">Company</th>
              <th className="px-3 py-3.5 text-left">Created at</th>
              <th className="px-3 py-3.5 text-left">Updated at</th>
            </tr>
          </thead>
          <tbody className={clsx('divide-y divide-genesy-200 overflow-auto h-80', 'bg-genesy-600')}>
            {leads.data?.map((lead) => (
              <LeadTableItem
                key={lead.email}
                lead={lead}
                selected={selectedLeads.includes(lead)}
                onSelect={() =>
                  setSelectedLeads(
                    selectedLeads.includes(lead)
                      ? selectedLeads.filter((p) => p !== lead)
                      : [...selectedLeads, lead]
                  )
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
