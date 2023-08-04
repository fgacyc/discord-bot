import axios from 'axios';
import cheerio, { Cheerio } from 'cheerio';

export const formatObjectToString = (obj: Record<string, string>): string => {
	return Object.entries(obj)
		.map(([key, value]) => `${key}: ${value}`)
		.join('\n');
};

export const convertTo12Hour = (time24: string) => {
	// Parse the input time
	const [hours, minutes] = time24.split(':').map(Number);

	// Check if the time is in the morning (AM) or afternoon/evening (PM)
	const period = hours >= 12 ? 'PM' : 'AM';

	// Convert to 12-hour format
	let hours12 = hours % 12 || 12;

	// Format the output string
	const time12 = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;

	return time12;
};

export const getVotd = async (): Promise<{
	verseTitle: string;
	versePassage: string;
	verseVersion: string;
}> => {
	const AxiosInstance = axios.create();

	let verseTitle = '';
	let versePassage = '';
	let verseVersion = '';
	await AxiosInstance.get('https://www.biblegateway.com')
		.then(
			// Once we have data returned ...
			async (response) => {
				const html = response.data; // Get the HTML from the HTTP request
				const $ = cheerio.load(html);
				//@ts-ignore
				const dailyVerse: Cheerio = $('.passage-box');
				// console.log(dailyVerse);
				//@ts-ignore
				dailyVerse.each(async (i, elem) => {
					verseTitle = $(elem).find('.verse-bar > a > span').text(); // Parse the title
					verseVersion = $(elem)
						.find('.verse-bar > a')
						.text()
						.trim()
						.slice(verseTitle.length); // Parse the version

					versePassage = $(elem).find('#verse-text').text(); // Parse the passage
				});
			},
		)
		.catch((err) => {
			console.error(err);
			return {
				verseTitle,
				versePassage,
				verseVersion,
			};
		});

	return {
		verseTitle,
		versePassage,
		verseVersion,
	};
};
