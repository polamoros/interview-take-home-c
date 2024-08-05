import genesyLogo from './assets/genesy-ai-logo.svg'
import { NotificationsProvider } from './components/desing-system/Notification'
import { LeadsList } from './components/LeadsList'

function App() {
  return (
    <main className="main">
      <div>
        <a href="https://genesy.ai" target="_blank">
          <img src={genesyLogo} className="logo genesy" alt="Genesy AI logo" />
        </a>
      </div>
      <div className="flex flex-col gap-6">
        <h1 className="title">Genesy AI</h1>
        <NotificationsProvider>
          <LeadsList />
        </NotificationsProvider>
      </div>
    </main>
  )
}

export default App
