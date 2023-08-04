import cron from 'node-cron';

export const cronjob = (fn: () => void) => {
	cron.schedule('0 10 * * *', fn);
	// cron.schedule('* * * * * *', fn);
};
