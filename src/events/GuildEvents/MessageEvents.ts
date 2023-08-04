import { RunFunction } from '../../interfaces/Event';
import { Message } from 'discord.js';
import { Command } from '../../interfaces/Command';
// import * as data from '../../../bindedRankChannels.json';

// const leveling = require('discord-leveling');
// const canvacord = require('canvacord');

// var channelRankId: string;
// var guildId: string;
// var currentGuild: string;

const prefix = '!';

export const run: RunFunction = async (client, message: Message) => {
	if (
		message.author.bot ||
		!message.guild ||
		!message.content.toLowerCase().startsWith(prefix)
	)
		return;

	const args: string[] = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);

	// console.log('args: ' + args);
	const cmd: string = args.shift() as string;

	const command = client.commands.get(cmd) as Command;

	console.log('client commands: ' + JSON.stringify(client.commands, null, 2));
	if (!command) return;

	// console.log('command: ' + command);
	command.run(client, message, args).catch(
		async (reason: any) =>
			await message.channel.send({
				embeds: [client.embed('Error', message, reason)],
			}),
	);
};

export const name: string = 'message';
