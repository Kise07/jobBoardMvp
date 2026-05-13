import './App.css'
import Jobs from './components/jobs'

const mockJobs = [
  { role: 'SWE 1', company: 'Google' },
  { role: 'SWE 2', company: 'Amazon' },
]

function App() {
  return (
    <>
      <Jobs job={mockJobs} />
    </>
  )
}

export default App
