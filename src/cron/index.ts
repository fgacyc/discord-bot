import cron from 'node-cron';

export const cronjob = (fn: () => void) => {
	cron.schedule('* * 10 1-31 * *', fn);
	// cron.schedule('* * * * * *', fn);
};
