import { Command } from '../../typings/types';

export = {
    name: 'ping',
    description: 'Checks the latency of the bot.',
    aliases: ['latency'],
    cooldown: 3,
    execute: async (message, _args, client) => {
        return message.channel.send('Ping?').then((msg) => {
            setTimeout(() => {
                msg.edit(`\`\`\`c\nPong! | Message latency: ${msg.createdTimestamp - message.createdTimestamp} ms\n\nPing! | API latency: ${Math.round(client?.ws.ping ?? 50)} ms\`\`\``);
            }, 1500);
        });
    },
} as Command;