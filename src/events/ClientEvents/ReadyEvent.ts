import { RunFunction } from '../../interfaces/Event';
// import { Message } from 'discord.js';

// const leveling = require('discord-leveling');

export const run: RunFunction = async (client) => {
	console.log(`${client.user?.tag} is now online!`);
};

export const name: string = 'ready';
