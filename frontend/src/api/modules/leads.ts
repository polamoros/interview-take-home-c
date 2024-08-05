import { LeadsCreateInput, LeadsCreateOutput } from '../types/leads/create'
import { LeadsDeleteInput, LeadsDeleteOutput } from '../types/leads/delete'
import { LeadsGetManyInput, LeadsGetManyOutput } from '../types/leads/getMany'
import { LeadsGetOneInput, LeadsGetOneOutput } from '../types/leads/getOne'
import { LeadsUpdateInput, LeadsUpdateOutput } from '../types/leads/update'
import { LeadsGenerateMessageInput, LeadsGenerateMessageOutput } from '../types/leads/generateMessage'
import { ApiModule, endpoint } from '../utils'
import { LeadsEnrichGenderInput, LeadsEnrichGenderOutput } from '../types/leads/enrichGender'
import { LeadsImportInput, LeadsImportOutput } from '../types/leads/import'

export const leadsApi = {
  getMany: endpoint<LeadsGetManyOutput, LeadsGetManyInput>('get', '/leads'),
  getOne: endpoint<LeadsGetOneOutput, LeadsGetOneInput>('get', ({ id }) => `/leads/${id}`),
  create: endpoint<LeadsCreateOutput, LeadsCreateInput>('post', '/leads'),
  delete: endpoint<LeadsDeleteOutput, LeadsDeleteInput>('delete', ({ id }) => `/leads/${id}`),
  update: endpoint<LeadsUpdateOutput, LeadsUpdateInput>('put', ({ id }) => `/leads/${id}`),
  generateMessage: endpoint<LeadsGenerateMessageOutput, LeadsGenerateMessageInput>(
    'post',
    ({ id }) => `/leads/${id}/message`
  ),
  enrichGender: endpoint<LeadsEnrichGenderOutput, LeadsEnrichGenderInput>(
    'post',
    ({ id }) => `/leads/${id}/enrich-gender`
  ),
  import: endpoint<LeadsImportOutput, LeadsImportInput>('post', '/leads/import'),
} as const satisfies ApiModule
