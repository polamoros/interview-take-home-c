import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
  useCallback,
} from 'react'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { nanoid } from 'nanoid'

interface Notification {
  id: string
  title: string
  body?: string
  show: boolean
  type?: 'success' | 'error'
  autoCloseTimeoutId?: ReturnType<typeof setTimeout>
}

interface NotificationsContextProps {
  notifications: Notification[]
  showNotification: (
    title: string,
    options?: {
      body?: string
      autoCloseDelayMs?: number
      type?: 'success' | 'error'
    }
  ) => void
  closeNotification: (id: string) => void
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined)

const useNotificationsContext = () => {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider')
  }
  return context
}

export const useNotifications = () => {
  const { notifications, showNotification, closeNotification } = useNotificationsContext()
  return { notifications, showNotification, closeNotification }
}

const NotificationContainer = () => {
  const { notifications, closeNotification } = useNotificationsContext()

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <Transition
            key={notification.id}
            show={notification.show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => closeNotification(notification.id)}
          >
            <div
              className={`max-w-sm w-full shadow-lg rounded-lg overflow-hidden ${
                notification.type === 'error' ? 'bg-red-50' : 'bg-green-50'
              } ring-1 ring-black ring-opacity-5`}
            >
              <div className="p-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {notification.type === 'error' ? (
                      <ExclamationCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                    ) : (
                      <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900 text-left">{notification.title}</p>
                    {notification.body && <p className="mt-1 text-sm text-gray-700">{notification.body}</p>}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => closeNotification(notification.id)}
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        ))}
      </div>
    </div>
  )
}

export const NotificationsProvider = ({ children }: PropsWithChildren) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const closeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, show: false } : notification))
    )
  }, [])

  const showNotification = useCallback(
    (
      title: string,
      options?: {
        body?: string
        autoCloseDelayMs?: number
        type?: 'success' | 'error'
      }
    ) => {
      const id = nanoid()
      const autoCloseDelayMs = options?.autoCloseDelayMs ?? 3000

      setNotifications((prev) => {
        return [
          ...prev,
          {
            id,
            title,
            body: options?.body,
            type: options?.type,
            show: true,
            autoCloseTimeoutId: setTimeout(() => closeNotification(id), autoCloseDelayMs),
          },
        ]
      })
    },
    [closeNotification]
  )

  useEffect(() => {
    return () => {
      notifications.forEach((notification) => {
        if (notification.autoCloseTimeoutId) {
          clearTimeout(notification.autoCloseTimeoutId)
        }
      })
    }
  }, [notifications])

  return (
    <NotificationsContext.Provider value={{ notifications, showNotification, closeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationsContext.Provider>
  )
}
