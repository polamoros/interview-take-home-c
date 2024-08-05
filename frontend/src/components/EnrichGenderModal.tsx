import { Modal, ModalBody, ModalFooter, ModalTitle } from './desing-system/Modal'
import { Button } from './desing-system/Button'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export interface EnrichGenderModalProps {
  visible: boolean
  onAccept: () => void
  onCancel: () => void
}

// this will Use an external API (e.g., Genderize API) to guess the gender of selected leads.
export const EnrichGenderModal = ({ visible, onAccept, onCancel }: EnrichGenderModalProps) => {
  return (
    <Modal visible={visible}>
      <ModalBody
        icon={
          <div className="mx-auto flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
            <ExclamationTriangleIcon className="size-6 text-yellow-600" />
          </div>
        }
      >
        <ModalTitle>Enrich Gender</ModalTitle>
        <div>
          Are you sure you want to enrich the selected leads gender using{' '}
          <span className="font-semibold">'Genderize'</span> API?
        </div>
      </ModalBody>

      <ModalFooter>
        <Button onClick={onAccept}>Enrich</Button>
        <Button onClick={onCancel} transparent>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}
