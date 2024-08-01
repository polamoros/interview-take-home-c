import { Lead } from '.'

export type LeadsCreateInput = {
  firstName: string
  email: string
}

export type LeadsCreateOutput = Lead
