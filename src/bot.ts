import { Client, Collection, Partials, Snowflake } from 'discord.js';
import path from 'path';
import fs from 'fs';

import { Command, EventHandler, SlashCommand } from './typings/types';
import { token } from './assets/auth.json';

export class GiveawayUtility extends Client {
    commands: Collection<string, Command>;
    slash_commands: Collection<string, SlashCommand>;
    donations: Collection<string, number>;
    cooldowns: Collection<string, Collection<Snowflake, number>>;

    constructor() {
        super({
            intents: 65343,
            partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.User],
        });

        this.commands = new Collection();
        this.slash_commands = new Collection();
        this.donations = new Collection();
        this.cooldowns = new Collection();
    }
}

const client = new GiveawayUtility();

const cmd_array = [];
let index = 1;

const donation_command_files = fs.readdirSync(path.join(process.cwd(), 'src', 'commands', 'donationCommands')).filter((file) => file.endsWith('.ts'));
const owner_command_files = fs.readdirSync(path.join(process.cwd(), 'src', 'commands', 'ownerCommands')).filter((file) => file.endsWith('.ts'));
const utility_command_files = fs.readdirSync(path.join(process.cwd(), 'src', 'commands', 'utilityCommands')).filter((file) => file.endsWith('.ts'));

for(const file of donation_command_files) {
    const cmd_name = file.split('.')[0];
    cmd_array.push(cmd_name);
}

for(const file of owner_command_files) {
    const cmd_name = file.split('.')[0];
    cmd_array.push(cmd_name);
}

for(const file of utility_command_files) {
    const cmd_name = file.split('.')[0];
    cmd_array.push(cmd_name);
}

for(const file of donation_command_files) {
    const command: Command = require(path.join(process.cwd(), 'src', 'commands', 'donationCommands', `${file}`));
    client.commands.set(command.name, command);

    console.log(`${file} loaded! [${index}/${cmd_array.length}]`);
    index++;
}

for(const file of owner_command_files) {
    const command: Command = require(path.join(process.cwd(), 'src', 'commands', 'ownerCommands', `${file}`));
    client.commands.set(command.name, command);

    console.log(`${file} loaded! [${index}/${cmd_array.length}]`);
    index++;
}

for(const file of utility_command_files) {
    const command: Command = require(path.join(process.cwd(), 'src', 'commands', 'utilityCommands', `${file}`));
    client.commands.set(command.name, command);

    console.log(`${file} loaded! [${index}/${cmd_array.length}]`);
    index++;
}

const events = fs.readdirSync(path.join(process.cwd(), 'src', 'events'));
for(const file of events) {
    const event: EventHandler = require(path.join(process.cwd(), 'src', 'events', file));
    client.on(event.name, event.callback.bind(client));
}

client.login(token);