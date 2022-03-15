import { EventHandler } from '../typings/types';
import { donations } from '../models/donations';

export = {
    name: 'ready',
    once: false,
    callback: async function() {
        await donations.sync().then(() => {
            console.log('Donations database synced!');
        });

        console.log('Connected to Discord!');
    },
} as EventHandler;