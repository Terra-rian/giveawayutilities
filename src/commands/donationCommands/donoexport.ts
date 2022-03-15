import * as sourcebin from 'sourcebin';

import { donations } from '../../models/donations';
import { Command } from '../../typings/types';

export = {
    name: 'donoexport',
    description: 'Exports all donations in JSON format to a Pastebin.',
    aliases: ['export', 'donos'],
    cooldown: 3,
    guildOnly: true,
    roles: ['786354739255705600'],
    execute: async (message) => {
        const total = await donations.findAll();
        let output = '';

        total.forEach((donation) => {
            output += JSON.stringify(donation, undefined, 4);
            output += '\n';
        });

        const bin = await sourcebin.create([{
            content: output,
            language: 'json',
        }], {
            title: 'All Donations',
            description: `Exported at ${new Date().toLocaleString()}`,
        });

        console.log(bin.url);
        return message.reply(`Export successful! Here's the sourcebin link: <${bin.url}>`);
    },
} as Command;