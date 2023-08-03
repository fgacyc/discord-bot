import { Bot } from './client/Client';
import { Config } from './interfaces/Config';

require('dotenv').config();

const token: string = process.env.DISCORD_TOKEN ?? '';
new Bot().start(token as unknown as Config);
