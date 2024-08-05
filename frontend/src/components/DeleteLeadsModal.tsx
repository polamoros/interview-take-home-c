import { Modal, ModalBody, ModalFooter, ModalTitle } from './desing-system/Modal'
import { Button } from './desing-system/Button'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export interface DeleteLeadsModalProps {
  visible: boolean
  disabled?: boolean
  onAccept: () => void
  onCancel: () => void
}

export const DeleteLeadsModal = ({ visible, disabled, onAccept, onCancel }: DeleteLeadsModalProps) => {
  return (
    <Modal visible={visible}>
      <ModalBody
        icon={
          <div className="mx-auto flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <ExclamationTriangleIcon className="size-6 text-red-600" />
          </div>
        }
      >
        <ModalTitle>Delete Leads</ModalTitle>
        <div>
          Are you sure you want to delete the selected Leads?
          <br />
          This action <b>cannot be </b>undone.
        </div>
      </ModalBody>

      <ModalFooter>
        <Button onClick={onAccept} className="text-white bg-red-600 hover:bg-red-500" disabled={disabled}>
          Delete
        </Button>
        <Button onClick={onCancel} transparent disabled={disabled}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}
