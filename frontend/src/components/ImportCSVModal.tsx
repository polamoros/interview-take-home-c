import { Modal, ModalBody, ModalFooter, ModalTitle } from './desing-system/Modal'
import { Button } from './desing-system/Button'
import { CheckIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Lead } from '../api/types/leads'
import { useMemo } from 'react'

export interface ImportCSVModalProps {
  leads: Lead[]
  visible: boolean
  onAccept: (leads: Lead[]) => void
  onCancel: () => void
}

export const ImportCSVModal = ({ leads, visible, onAccept, onCancel }: ImportCSVModalProps) => {
  const headers = useMemo(() => {
    if (!leads || leads.length === 0) {
      return []
    }
    return Object.keys(leads[0])
  }, [leads])

  const { validLeads, invalidLeads } = useMemo(() => {
    const validLeads = leads.filter((lead) => lead.firstName)
    const invalidLeads = leads.filter((lead) => !lead.firstName)
    return { validLeads, invalidLeads }
  }, [leads])

  return (
    <Modal visible={visible} size="lg">
      <ModalBody>
        <ModalTitle>Import from CSV</ModalTitle>
        <div className="flex-col gap-2 text-xs">
          <div className="w-full overflow-auto rounded-md">
            <table className="table-fixed divide-y bg-genesy-100 text-genesy-900">
              <thead>
                <tr className="font-semibold whitespace-nowrap">
                  <th className="w-12"></th>
                  {headers.map((header) => (
                    <th key={header} className="py-3.5 pr-3 text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {validLeads.map((lead) => (
                  <tr key={`${lead.firstName}${lead.lastName}`}>
                    <td className="relative px-5 sm:w-12">
                      <CheckIcon className="text-green-500 size-5" />
                    </td>
                    {headers.map((header) => (
                      <td key={header} className="py-3.5 pr-3 text-left truncate">
                        {lead[header]}
                      </td>
                    ))}
                  </tr>
                ))}
                {invalidLeads.map((lead) => (
                  <tr key={`${lead.firstName}${lead.lastName}`}>
                    <td className="relative px-5 sm:w-12">
                      <XMarkIcon className="text-red-500 size-5" />
                    </td>
                    {headers.map((header) => (
                      <td key={header} className="py-3.5 pr-3 text-left truncate">
                        {lead[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-2">
            {invalidLeads.length > 0 && (
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="text-red-500 size-5" />
                <span>{invalidLeads.length} leads have errors</span>
              </div>
            )}
            {validLeads.length > 0 && (
              <div className="flex items-center gap-2">
                <CheckIcon className="text-green-500 size-5" />
                {validLeads.length === leads.length && <span>All leads are valid</span>}
                {validLeads.length !== leads.length && <span>{validLeads.length} leads are valid</span>}
              </div>
            )}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          onClick={() => {
            onAccept(validLeads)
          }}
        >
          Import
        </Button>
        <Button onClick={onCancel} transparent>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}
