import { Message } from 'discord.js';
import { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async (client, message) => {
	const msg: Message = await message.channel.send({
		embeds: [client.embed('Pinging', message)],
	});
	console.log(msg);
	await msg.edit({
		embeds: [
			client.embed(
				'Pong!',
				message,
				`WebSocket: ${client.ws.ping}MS\nMessage edit: ${
					msg.createdTimestamp - message.createdTimestamp
				}MS`,
			),
		],
	});
};

export const name: string = 'ping';
