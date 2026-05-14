var CronJob = require('cron').CronJob;

const fetchHNJobs = require('');

const job = new CronJob(
  '*/1 * * * * *', //cronTime
  fetchHNJobs, // onTick
  null, // onComplete
  true, // start
  'America/Los_Angeles' // timeZone
);
// job.start() is ooptional here because of the fourth parameter set to true.
