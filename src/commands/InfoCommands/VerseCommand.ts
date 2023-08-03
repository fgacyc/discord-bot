import { Message } from 'discord.js';
import { RunFunction } from '../../interfaces/Command';
import axios from 'axios';
import cheerio, { Cheerio } from 'cheerio';
import { getVotd } from '../../utils';

export const run: RunFunction = async (client, message) => {
	const { verseTitle, versePassage, verseVersion } = await getVotd();

	message.channel.send({
		embeds: [client.verseEmbed(verseTitle, versePassage, verseVersion)],
	});
};

export const name: string = 'verse';
