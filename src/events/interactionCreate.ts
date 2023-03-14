import { CommandInteraction, Events } from 'discord.js';

import { EventHandler } from '../typings/types';
import { GiveawayUtility } from '../bot';

export = {
    name: Events.InteractionCreate,
    callback: async function(interaction: CommandInteraction) {
        if(!interaction.isCommand()) {
            return;
        }

        const self = this as unknown as GiveawayUtility;

        try {
            const command = self.slash_commands.get(interaction.commandName);

            if(!command) {
                return;
            }

            await command.execute(interaction, self);
        } catch(err) {
            console.log((err as Error).stack);
        }
    },
} as EventHandler;