import { Lead } from '.'

export type LeadsImportInput = {
  leads: Lead[]
}

export type LeadsImportOutput = {
  importedLeads: Lead[]
  updatedLeads: Lead[]
  failedLeads: Lead[]
}
