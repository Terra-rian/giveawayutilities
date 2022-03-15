import { Snowflake } from 'discord.js';

export interface DonationAttributes {
    user_id: Snowflake;
    donations: number;
}