import { RunFunction } from '../../interfaces/Command';
import { getFirestore } from 'firebase-admin/firestore';
import { formatObjectToString } from '../../utils';

const db = getFirestore();

export const run: RunFunction = async (client, message) => {
	const snapshot = await db.collection('config').get();
	snapshot.forEach((doc) => {
		const info = doc.data();
		message.channel.send({
			embeds: [
				client.embed('Important Links 🔗', message, formatObjectToString(info)),
			],
		});
	});
};

export const name: string = 'links';
