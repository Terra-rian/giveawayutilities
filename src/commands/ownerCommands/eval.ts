import { EmbedBuilder } from 'discord.js';
import { inspect } from 'util';
import { createError, removeCodeblock } from '../../assets/functions';
import { Timer } from '../../assets/timer';
import { Command } from '../../typings/types';
import sourcebin from 'sourcebin';

export = {
    name: 'eval',
    description: 'Allows the bot dev to evaluate code within Discord.',
    aliases: ['e'],
    ownerOnly: true,
    cooldown: 0,
    execute: async (message, args) => {
        const timer = new Timer();

        if(!args) {
            return message.reply({ embeds: [createError('You did not type anything to evaluate!')] });
        }

        try {
            timer.start();

            const to_eval = removeCodeblock(args.join(' '));
            const output = eval(to_eval.includes('await') ? `(async () => { ${to_eval} })()` : to_eval);
            const final_output = inspect(output, { showHidden: false, depth: 0 });

            if(output instanceof Promise) {
                await output;
                timer.stop();

                const time = timer.ms();
                return message.reply(`\`Evaluated in ${time.toFixed(3)} millisecond(s)\``);
            } else {
                timer.stop();
                const time = timer.ms();

                const embed = new EmbedBuilder()
                    .setDescription(`**Input**\n\`\`\`javascript\n${to_eval}\`\`\`\n**Output**\n\`\`\`javascript\n${final_output}\`\`\``)
                    .setFooter({ text: `Evaluated in ${time.toFixed(3)} millisecond(s)` })
                    .setColor('Random');

                if(embed.data.description && embed.data.description.length > 4096) {
                    const bin = await sourcebin.create({
                        title: 'Evaluated Output',
                        description: 'The output was over 4k chars',
                        files: [{
                            content: `${final_output}`,
                            language: 'javascript',
                        }],
                    });

                    console.log(bin);
                    return message.reply(`The output was larger than 4k characters, here's the sourcebin link:\n<${bin.url}>`);
                }

                return message.reply({ embeds: [embed] });
            }
        } catch(err) {
            const to_eval = removeCodeblock(args.join(' '));

            const embed = new EmbedBuilder()
                .setDescription(`**Input**\n\`\`\`javascript\n${to_eval}\`\`\`\n**Output**\n\`\`\`javascript\n${err}\`\`\``)
                .setFooter({ text: 'An error occurred!' })
                .setColor('Random');

            if(embed.data.description && embed.data.description.length > 4096) {
                const bin = await sourcebin.create({
                    title: 'Evaluated Output',
                    description: 'The output was over 4k chars',
                    files: [{
                        content: `${err}`,
                        language: 'javascript',
                    }],
                });

                return message.reply(`The output was larger than 4k characters, here's the sourcebin link:\n<${bin.url}>`);
            }

            return message.reply({ embeds: [embed] });
        }
    },
} as Command;