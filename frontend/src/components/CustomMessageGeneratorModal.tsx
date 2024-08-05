import { Modal, ModalBody, ModalFooter, ModalTitle } from './desing-system/Modal'
import clsx from 'clsx'
import { Button } from './desing-system/Button'

export interface CustomMessageGeneratorModalProps {
  message: string
  onMessageChange: (message: string) => void
  onAccept: () => void
  onCancel: () => void
  visible: boolean
  errorMessage?: string[]
  loading?: boolean
}

export const CustomMessageGeneratorModal = ({
  message,
  onMessageChange,
  onAccept,
  onCancel,
  visible,
  errorMessage,
  loading,
}: CustomMessageGeneratorModalProps) => {
  // Lets hardcode the available variables for now
  const availableVariables = [
    'firstName',
    'lastName',
    'email',
    'jobTitle',
    'countryCode',
    'companyName',
  ].join(', ')

  return (
    <Modal visible={visible}>
      <ModalBody>
        <ModalTitle>Custom Message Generation</ModalTitle>
        <div>
          <label className="text-sm text-gray-700">Message template</label>
          <textarea
            className={clsx(
              'w-full h-32 bg-white border border-slate-300 rounded text-gray-900',
              'p-2 mt-1',
              'text-sm resize-none'
            )}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
          />
          <div className="truncate w-full">
            <div className="gap-0.5 text-xs text-gray-500 truncate" title={availableVariables}>
              <span className="text-xs text-gray-800">Variables: </span> {availableVariables}
            </div>
          </div>
          {errorMessage && (
            <div className="text-xs">
              <div className="text-red-800 mt-2 font-semibold">Errors</div>
              <div className="text-red-600">
                {errorMessage.map((error, i) => (
                  <div key={i}>{error}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button onClick={onAccept} disabled={loading}>
          Generate
        </Button>
        <Button onClick={onCancel} transparent disabled={loading}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}
