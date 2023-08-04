import { RunFunction } from '../../interfaces/Command';
import { getVotd } from '../../utils';

export const run: RunFunction = async (client, message) => {
	const { verseTitle, versePassage, verseVersion } = await getVotd();

	message.channel.send({
		embeds: [client.verseEmbed(verseTitle, versePassage, verseVersion)],
	});
};

export const name: string = 'verse';
