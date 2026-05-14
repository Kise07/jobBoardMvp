import { CronJob } from 'cron';
import fetchHNJobs from './tasks/fetch-HN.js';

const job = new CronJob(
  // '*/1 * * * * *', //cronTime (every single second)
  // '* */6 * * * *', //cronTime (every 6 hours)
  '0 0 * * * *', //cronTime (daily)
  fetchHNJobs, // onTick
  null, // onComplete
  true, // start
  'America/Los_Angeles' // timeZone
);
// job.start() is optional here because of the fourth parameter set to true.

export default job;
