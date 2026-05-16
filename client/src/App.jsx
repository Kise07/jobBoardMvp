import { useEffect, useState } from 'react';
import './App.css'
import Jobs from './components/jobs'

const JOB_API_URL = 'http://localhost:8080/jobs';

const mockJobs = [
  { role: 'SWE 1', company: 'Google' },
  { role: 'SWE 2', company: 'Amazon' },
]

async function fetchJobs(updateCb) {
  const res = await fetch(JOB_API_URL);
  const json = await res.json();

  updateCb(json);
}

function App() {
  const [jobList, updateJobs] = useState([]);

  useEffect(() => {
    fetchJobs(updateJobs);
  }, []);

  return (
    <>
      <Jobs job={jobList} />
    </>
  )
}

export default App
