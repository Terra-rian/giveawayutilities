import { EmbedBuilder } from 'discord.js';
import path from 'path';
import fs from 'fs';

import { createError } from '../../assets/functions';
import { Command } from '../../typings/types';

export = {
    name: 'help',
    description: 'Get helpful info about how to use this bot.',
    aliases: [],
    cooldown: 3,
    execute: async (message, args, client) => {
        const categories = ['donations', 'utility'];
        const prefix = 'gw!';

        const donation_command_files = fs.readdirSync(path.join(process.cwd(), 'src', 'commands', 'donationCommands')).filter((file) => file.endsWith('.ts'));
        const utility_command_files = fs.readdirSync(path.join(process.cwd(), 'src', 'commands', 'utilityCommands')).filter((file) => file.endsWith('.ts'));

        if(!args || !args[0]) {
            const basic_help_embed = new EmbedBuilder()
                .setTitle('Giveaway Utilities Help')
                .setDescription('*The arguments inside `<>` are not required, but any mentions as well as the arguments inside `[]` are.*')
                .addFields({
                    name: '**🤑 Donations**',
                    value: `\`${prefix}help donations\``,
                    inline: true,
                }, {
                    name: '**🧰 Utilities**',
                    value: `\`${prefix}help utility\``,
                    inline: true,
                })
                .setColor('Random')
                .setTimestamp();

            return message.reply({ embeds: [basic_help_embed] });
        } else {
            const name = args[0].toLowerCase();
            const cmd_array: string[] = [];

            if(categories.includes(name)) {
                const category_embed = new EmbedBuilder()
                    .setColor('Random')
                    .setFooter({ text: `Use \`${prefix}\` before each command!` })
                    .setTimestamp();

                switch(name) {
                    case 'donations':
                        for(const file of donation_command_files) {
                            const cmd_name = file.split('.')[0];
                            cmd_array.push(cmd_name);
                        }

                        category_embed.setTitle('🤑 Donation Commands').setDescription(`\`${cmd_array.join('`, `')}\``);
                        cmd_array.length = 0;

                        return message.reply({ embeds: [category_embed] });

                    case 'utility':
                        for(const file of utility_command_files) {
                            const cmd_name = file.split('.')[0];
                            cmd_array.push(cmd_name);
                        }

                        category_embed.setTitle('🧰 Utility Commands').setDescription(`\`${cmd_array.join('`, `')}\``);
                        cmd_array.length = 0;

                        return message.reply({ embeds: [category_embed] });
                }
            }

            const command = client?.commands.get(name) || client?.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(name));
            if(!command) {
                return message.reply({ embeds: [createError(`That's not a valid command!\n\nUse \`${prefix}help (category name)\` to see all of the available commands and categories!`)] });
            }

            const cmd_embed = new EmbedBuilder()
                .setTitle(`${prefix}${command.name} info`)
                .setThumbnail(client?.user ? client.user.displayAvatarURL() : '')
                .setTimestamp()
                .setColor('Random');

            if(command.description && command.description.length > 0) {
                cmd_embed.setDescription(command.description);
            }

            if(command.aliases) {
                cmd_embed.addFields({ name: 'Aliases', value: `\`${command.aliases.length > 0 ? command.aliases.join(', ') : 'No Aliases'}\``, inline: true });
            }

            /* if(command.usage) {
                cmd_embed.addField('Usage', `\`${command.usage && command.usage.length > 0 ? command.usage.join(' ') : 'No Args Needed'}\``, true);
            } */

            if(command.cooldown) {
                cmd_embed.addFields({ name: 'Cooldown', value: `\`${command.cooldown && command.cooldown > 0 ? `${command.cooldown} seconds` : 'No Cooldown'}\``, inline: true });
            }

            return message.reply({ embeds: [cmd_embed] });
        }
    },
} as Command;