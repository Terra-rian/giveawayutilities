import path from 'path';
import fs from 'fs';

import { EventHandler, SlashCommand } from '../typings/types';
import { donations } from '../models/donations';

import { GiveawayUtility } from '../bot';

export = {
    name: 'ready',
    once: false,
    callback: async function() {
        const self = this as unknown as GiveawayUtility;
        const guild_id = '724624373369012231';

		try {
			const slash_command_files = fs.readdirSync(path.join(process.cwd(), 'src', 'commands', 'slashCommands')).filter((file) => file.endsWith('.ts'));

			for(const file of slash_command_files) {
				const command: SlashCommand = require(path.join(process.cwd(), 'src', 'commands', 'slashCommands', `${file}`));

				if(command.global === true) {
					const data = {
						name: command.name,
						description: command.description,
						options: command.options,
					};

					await self.application?.commands.create(data);
				} else {
					const data = {
						name: command.name,
						description: command.description,
						options: command.options,
					};

					await self.guilds.cache.get(guild_id)?.commands.create(data);
				}

				self.slash_commands.set(command.name, command);
				console.log(`[Slash Command] ${file} loaded! (${command.global ? 'Global' : 'Guild-only'})`);
			}
		} catch(error) {
			console.log((error as Error).stack);
		}

        await donations.sync().then(() => {
            console.log('Donations database synced!');
        });

        self.user?.setPresence({ activities: [{ name: 'for giveaway donations', type: 'WATCHING' }], status: 'dnd' });

        console.log('Connected to Discord!');
    },
} as EventHandler;