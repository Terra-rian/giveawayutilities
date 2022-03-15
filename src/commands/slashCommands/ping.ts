import { SlashCommand } from '../../typings/types';

export = {
    name: 'ping',
    description: 'Gets the bot\'s current latency.',
    global: true,
    options: [{
        name: 'ephemeral',
        type: 'BOOLEAN',
        description: 'Whether the result should be visible to you only.',
        required: true,
    }],
    execute: async (interaction, client) => {
        await interaction.reply({ content: 'Ping!', ephemeral: interaction.options.getBoolean('ephemeral', true) === true ? true : false });

        setTimeout(async () => {
            return await interaction.editReply(`🏓 Pong! That took **${client?.ws.ping}** milliseconds!`);
        }, 1500);
    },
} as SlashCommand;