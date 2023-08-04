import { Bot } from './client/Client';
import { Config } from './interfaces/Config';
import { initializeApp, cert } from 'firebase-admin/app';

require('dotenv').config();

const token: string = process.env.DISCORD_TOKEN ?? '';

initializeApp({
	credential: cert({
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY,
		projectId: process.env.FIREBASE_PROJECT_ID,
	}),
});

new Bot().start(token as unknown as Config);
