import { useEffect, useState } from 'react';
import './App.css'
import Jobs from './components/jobs'

const JOB_API_URL = 'https://jobboardmvp-production.up.railway.app/jobs';

const mockJobs = [
  {
    id: 1,
    role: 'SWE 1',
    company: 'Google',
    location: 'Mountain View, CA',
    remote: true,
    tags: ['React', 'TypeScript'],
    raw: 'Senior SWE at Google'
  },
  {
    id: 2,
    role: 'SWE 2',
    company: 'Facebook',
    location: 'Menlo Park, CA',
    remote: false,
    tags: ['Node.js', 'GraphQL'],
    raw: 'Senior SWE at Facebook'
  },
  {
    id: 3,
    role: 'SWE 2',
    company: 'Amazon',
    location: 'Seattle, WA',
    remote: false,
    tags: ['Python', 'AWS'],
    raw: 'Backend Engineer at Amazon'
  },
]

function App() {
  const [jobList, updateJobs] = useState(mockJobs);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  // Fetch jobs function
  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs from:', JOB_API_URL);

      const res = await fetch(JOB_API_URL);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      console.log('Got', json.length, 'jobs');

      // Update jobs only if we got real data
      if (json && json.length > 0) {
        updateJobs(json);
        setHasData(true); // Mark as successful
        setLoading(false); // Stop loading only on success
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Auto-refresh every 3 seconds until we get data
  useEffect(() => {
    if (!hasData) {
      const interval = setInterval(() => {
        console.log('Auto-refreshing jobs...');
        fetchJobs();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [hasData]);

  return (
    <>
      <Jobs job={jobList} />
      <div style={{
        padding: '10px',
        color: '#666',
        fontSize: '34px',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        {!hasData && <span>Loading jobs...</span>}
        {hasData && jobList.length > 0 && (
          <span>Loaded {jobList.length} jobs</span>
        )}
        {hasData && jobList.length === 0 && (
          <span>No jobs found. Check console.</span>
        )}
      </div>
    </>
  )
}

export default App
