import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { api, useApiMutation } from '../api'
import { Lead } from '../api/types/leads'
import clsx from 'clsx'
import { Dropdown } from './desing-system/Dropdown'
import { Button } from './desing-system/Button'
import { LeadTableItem } from './LeadsTableItem'
import { CustomMessageGeneratorModal } from './CustomMessageGeneratorModal'
import { DeleteLeadsModal } from './DeleteLeadsModal'
import { EnrichGenderModal } from './EnrichGenderModal'
import { useNotifications } from './desing-system/Notification'
import { AxiosError } from 'axios'
import { ImportCSVModal } from './ImportCSVModal'

export const LeadsList: FC = () => {
  const { showNotification } = useNotifications()

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [enrichMessageModal, setEnrichMessageModal] = useState(false)
  const [enrichGenderModal, setEnrichGenderModal] = useState(false)
  const [importCSVModal, setImportCSVModal] = useState(false)

  const [allChecked, setAllChecked] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([])

  const leadsQuery = useQuery({
    queryKey: ['leads', 'getMany'],
    queryFn: async () => api.leads.getMany(),
  })

  const leads = useMemo(() => leadsQuery.data ?? [], [leadsQuery.data])

  const deleteLeadsMutation = useApiMutation('leads.delete')

  const onDeleteSelectedLeads = useCallback(() => {
    selectedLeads.forEach((lead) => {
      try {
        deleteLeadsMutation.mutate({ id: lead.id })
      } catch (error) {
        console.error(error)
      }
    })
    setSelectedLeads([])
    setDeleteModalVisible(false)
  }, [deleteLeadsMutation, selectedLeads])

  const [customMessageLoading, setCustomMessageLoading] = useState(false)
  const generateMessageMutation = useApiMutation('leads.generateMessage')
  const [templateMessage, setTemplateMessage] = useState(
    "Hi {firstName}, I'm doing a survey. \n Who would you rate working in {companyName} as a {jobTitle}, from 1 to 10?"
  )

  const [generateMessageErrors, setGenerateMessageErrors] = useState<string[]>()

  const onTemplateChange = useCallback(
    (message: string) => {
      setTemplateMessage(message)

      const fields = message.match(/{(.*?)}/g) || []

      const missingFields = fields.reduce(
        (acc, field) => {
          const fieldName = field.slice(1, -1) // Remove curly braces
          if (fieldName) {
            const missingLeadsCount = selectedLeads.filter((lead) => !lead[fieldName]).length
            if (missingLeadsCount > 0) {
              acc.push({ field: fieldName, count: missingLeadsCount })
            }
          }
          return acc
        },
        [] as { field: string; count: number }[]
      )

      if (missingFields.length > 0) {
        const errors = missingFields.map(
          ({ field, count }) => `Field {${field}} is missing in ${count} leads.`
        )
        errors.push('The message for them will be empty.')
        setGenerateMessageErrors(errors)
        return
      }

      setGenerateMessageErrors(undefined)
    },
    [selectedLeads, setGenerateMessageErrors]
  )

  const onGenerateMessage = useCallback(() => {
    setCustomMessageLoading(true)
    selectedLeads.forEach((lead) => {
      generateMessageMutation.mutate(
        { id: lead.id, message: templateMessage },
        {
          onError: (error) => {
            const errorData = (error as AxiosError)?.response?.data as { message: string }
            showNotification(errorData.message || error.message, {
              type: 'error',
            })
          },
        }
      )
    })
    showNotification('Messages were generated for the selected leads')
    setCustomMessageLoading(false)
    setEnrichMessageModal(false)
  }, [generateMessageMutation, selectedLeads, templateMessage, showNotification])

  const enrichGenderMutation = useApiMutation('leads.enrichGender')

  const onEnrichGender = useCallback(() => {
    selectedLeads.forEach((lead) => {
      enrichGenderMutation.mutate(
        { id: lead.id },
        {
          onError: (error: Error) => {
            const errorData = (error as AxiosError)?.response?.data as { message: string }
            showNotification(errorData.message || error.message, {
              type: 'error',
            })
          },
        }
      )
    })
    showNotification('Gender was enriched for the selected leads')
    setEnrichGenderModal(false)
  }, [enrichGenderMutation, selectedLeads, showNotification])

  const importLeadsMutation = useApiMutation('leads.import')

  const fileInputRef = useRef<string>()
  const [leadsToImport, setLeadsToImport] = useState<Lead[]>([])

  const openFileExplorer = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) {
        return
      }

      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result as string
        const rows = text.split('\n').filter((row) => row.trim() !== '')

        if (rows.length === 0) {
          setLeadsToImport([])
          setImportCSVModal(true)
          return
        }

        // Get the header and rows
        const [header, ...dataRows] = rows
        const keys = header.split(',').map((key) => key.trim())

        const leads = dataRows
          .map((row) => {
            const values = row.split(',').map((value) => value.trim())
            return keys.reduce(
              (acc, key, index) => ({
                ...acc,
                [key]: values[index] || '',
              }),
              {} as Lead
            )
          })
          .filter((lead) => Object.values(lead).some((value) => value !== ''))

        setLeadsToImport(leads)
        setImportCSVModal(true)
      }
      reader.readAsText(file)
    },
    [setLeadsToImport, setImportCSVModal]
  )

  const onImportCSV = useCallback(
    (leads: Lead[]) => {
      if (fileInputRef.current) {
        fileInputRef.current = ''
      }
      importLeadsMutation.mutate(
        { leads },
        {
          onError: (error) => {
            const errorData = (error as AxiosError)?.response?.data as { message: string }
            showNotification(errorData.message || error.message, {
              type: 'error',
            })
          },
          onSuccess: (data) => {
            const { importedLeads, updatedLeads, failedLeads } = data

            if (failedLeads.length > 0) {
              showNotification(`Some leads failed to import ${failedLeads.length}`, {
                type: 'error',
              })
            }
            if (importedLeads.length > 0) {
              showNotification(`${importedLeads.length} Leads were imported`)
            }
            if (updatedLeads.length > 0) {
              showNotification(`${updatedLeads.length} Leads were updated`)
            }
            setImportCSVModal(false)
          },
        }
      )
    },
    [showNotification, importLeadsMutation]
  )

  const toggleAll = useCallback(() => {
    setSelectedLeads(allChecked ? [] : leads)
    setAllChecked(!allChecked)
  }, [allChecked, leads])

  const isLoading = useMemo(() => leadsQuery.isLoading, [leadsQuery.isLoading])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (leadsQuery.isError) {
    return <div>Error: {leadsQuery.error.message}</div>
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-x-3 text-genesy-100 h-10">
        <div className="text-sm font-semibold">
          {selectedLeads.length > 0 && <div>{selectedLeads.length} selected</div>}
          {selectedLeads.length === 0 && <div>{leads.length} leads</div>}
        </div>

        {selectedLeads.length > 0 && (
          <>
            <div className="w-0.5 h-6 bg-genesy-600" />
            <Button onClick={() => setDeleteModalVisible(true)} className="">
              Delete
            </Button>
            <Dropdown
              label="Enrich"
              items={[
                { label: 'Gender', onClick: () => setEnrichGenderModal(true) },
                {
                  label: 'Message',
                  onClick: () => setEnrichMessageModal(true),
                },
              ]}
            />
          </>
        )}
        <div className="flex grow justify-end">
          <Button className="relative">
            <label className="pointer-events-none">Import from CSV</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={openFileExplorer}
              className="opacity-0 absolute inset-0 cursor-pointer z-10"
            />
          </Button>
        </div>
      </div>

      <div className="w-full overflow-auto rounded-md">
        <table className="table-fixed divide-y bg-genesy-800 text-genesy-50 shadow-xl">
          <thead>
            <tr className="text-sm font-semibold whitespace-nowrap">
              <th className="relative px-7 sm:w-12 sm:px-6">
                <input
                  type="checkbox"
                  disabled={leads.length === 0}
                  className={clsx(
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded',
                    'text-genesy-500 border-genesy-500 focus:ring-genesy-500'
                  )}
                  checked={allChecked}
                  onChange={toggleAll}
                />
              </th>
              <th className="py-3.5 pr-3 text-left">Name</th>
              <th className="px-3 py-3.5 text-left">Last name</th>
              <th className="px-3 py-3.5 text-left">Country</th>
              <th className="px-3 py-3.5 text-left">Message</th>
              <th className="px-3 py-3.5 text-left">Gender</th>
              <th className="px-3 py-3.5 text-left">Email</th>
              <th className="px-3 py-3.5 text-left">Job title</th>
              <th className="px-3 py-3.5 text-left">Company</th>
              <th className="px-3 py-3.5 text-left">Created at</th>
              <th className="px-3 py-3.5 text-left">Updated at</th>
            </tr>
          </thead>
          <tbody className={clsx('divide-y divide-genesy-200 overflow-auto h-80', 'bg-genesy-600')}>
            {leads.map((lead) => (
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

      <DeleteLeadsModal
        visible={deleteModalVisible}
        onAccept={onDeleteSelectedLeads}
        onCancel={() => setDeleteModalVisible(false)}
      />

      <CustomMessageGeneratorModal
        loading={customMessageLoading}
        message={templateMessage}
        onMessageChange={onTemplateChange}
        visible={enrichMessageModal}
        onAccept={onGenerateMessage}
        onCancel={() => setEnrichMessageModal(false)}
        errorMessage={generateMessageErrors}
      />

      <EnrichGenderModal
        visible={enrichGenderModal}
        onAccept={onEnrichGender}
        onCancel={() => setEnrichGenderModal(false)}
      />

      <ImportCSVModal
        visible={importCSVModal}
        leads={leadsToImport}
        onAccept={onImportCSV}
        onCancel={() => setImportCSVModal(false)}
      />
    </div>
  )
}
