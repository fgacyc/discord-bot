import {
	Client,
	Message,
	GatewayIntentBits,
	EmbedBuilder,
	Collection,
	TextChannel,
} from 'discord.js';
import { Command } from '../interfaces/Command';
import { Event } from '../interfaces/Event';
import { Config } from '../interfaces/Config';
import glob from 'glob';
import { promisify } from 'util';

import axios from 'axios'; // Api fetch() function
import { convertTo12Hour, getVotd } from '../utils';
import { run } from '../events/GuildEvents/MessageEvents';
import { cronjob } from '../cron';

const globPromise = promisify(glob);

const getTime = async (url: string) => {
	try {
		const res = await axios.get(
			`https://timeapi.io/api/TimeZone/zone?timeZone=${url}`,
		);
		const data = await res.data;
		const time = data.currentLocalTime as string;
		const formattedTime = convertTo12Hour(
			time.split('T')[1].split('.')[0].slice(0, 5),
		);

		return formattedTime;
	} catch (err) {
		console.error('API Err', url, err);
	}
};
const timeMap = {
	KUL: 'Asia/Singapore',
	LONDON: 'Europe/London',
	DUBLIN: 'Europe/Dublin',
};

class Bot extends Client {
	public commands: Collection<string, Command> = new Collection();
	public events: Collection<string, Event> = new Collection();
	public config: Config | undefined;
	public constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
			],
		});
	}
	public async start(config: Config): Promise<void> {
		this.config = config;
		this.login(config.token);

		const commandFiles: string[] = await globPromise(
			`${__dirname}/../commands/**/*{.ts,.js}`,
		);
		commandFiles.map(async (value: string) => {
			const file: Command = await import(value);
			this.commands.set(file.name, file);
			console.log(file);
		});
		const eventFiles: string[] = await globPromise(
			`${__dirname}/../events/**/*{.ts,.js}`,
		);
		eventFiles.map(async (value: string) => {
			const file: Event = await import(value);
			this.events.set(file.name, file);
			this.on(file.name, file.run.bind(null, this));
			console.log(file);
		});
		let index = 0;
		setInterval(async () => {
			const timezone: string[] = Object.keys(timeMap);

			if (index === timezone.length) index = 0;
			//@ts-ignore
			const url = timeMap[timezone[index]];
			const time = await getTime(url);
			try {
				//   Setting the custom activity
				if (this.user && time) {
					await this.user.setActivity({
						name: `${timezone[index].toString()}: ${time}`,
					});
				}
			} catch (err) {
				console.error('Discord Rate Err: ' + err);
			}
			// increase the index and loop again
			index++;
		}, 10000);
		// console.log(commandFiles);
		// console.log(eventFiles);

		cronjob(async () => {
			const { verseTitle, versePassage, verseVersion } = await getVotd();
			console.log(verseTitle, versePassage, verseVersion);
			const channel = this.guilds.cache
				.get('1136008049493016626')
				?.channels.cache.get('1136599413637267516') as TextChannel;

			channel.send({
				embeds: [this.verseEmbed(verseTitle, versePassage, verseVersion)],
			});
		});

		this.on('messageCreate', (message) => {
			run(this, message);
		});
	}
	public embed(title: string, message: Message, description?: string) {
		return new EmbedBuilder()
			.setColor('#800080')
			.setFooter({
				text: `${message.author.tag} | ${this.user?.username}`,
				iconURL:
					message.author.avatarURL({
						extension: 'png',
					}) ?? '',
			})
			.setTitle(title)
			.setDescription(description ?? null);
	}

	public verseEmbed(title: string, description?: string, version?: string) {
		return new EmbedBuilder()
			.setColor('#800080')
			.setFooter({
				text: version ?? '',
			})
			.setTitle(title)
			.setDescription(description ?? null);
	}
}

export { Bot };
