import { MessageEmbed } from 'discord.js';

import { owner_tag, owner_pfp } from './config.json';
import { token } from './auth.json';

/**
 * Creates an error embed for any command errors.
 * @param {string} error - The error.
 * @example const error = createError('An error occurred!');
 */
export function createError(error: string) {
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Error!')
        .setDescription(error)
        .setTimestamp()
        .setFooter({ text: `Made by ${owner_tag}`, iconURL: owner_pfp })

    return embed;
}

/**
 * Cleans the provided text (gets rid of Discord mentions).
 * @param {string} text - The text to clean.
 * @example const cleaned = clean('@everyone');
 */
export function clean(text: string) {
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)).replace(new RegExp(token, 'gi'), '***************');
}

/**
 * Removes markdown formatting for codeblocks.
 * @param {string} text - The text with markdown codeblocks to remove.
 * @example const cleaned = removeCodeblock(```js\nmessage.channel.send('Hey there!');\n```);
 */
export function removeCodeblock(text: string) {
    if(text.startsWith('```')) {
        text = text.replace(/^```(js|ts|typescript|javascript)?\n/g, '');
    }

    if(text.endsWith('```')) {
        text = text.replace(/```$/g, '');
    }

    return text;
}

/**
 * Adds an ordinal suffix to numbers, useful for date formatting.
 * @param {number} num - The number to format.
 */
export function ordinalSuffixOf(num: number): string {
    const modulus_of_ten = num % 10;
    const modulus_of_hundred = num % 100;

    if(modulus_of_ten === 1 && modulus_of_hundred !== 11) {
        return num + 'st';
    }

    if(modulus_of_ten === 2 && modulus_of_hundred !== 12) {
        return num + 'nd';
    }

    if(modulus_of_ten === 3 && modulus_of_hundred !== 13) {
        return num + 'rd';
    }

    return num + 'th';
}

/**
 * Converts numbers that have the K, M and B abbreviations.
 * @param {string} value The value to convert.
 */
export function convertAbbreviatedValue(value: string): number {
    const multiplier = value.substring(-1).toLowerCase();

    switch(multiplier) {
        case 'k':
            return parseFloat(value) * 1e3;

        case 'm':
            return parseFloat(value) * 1e6;

        case 'b':
            return parseFloat(value) * 1e9;

        case 't':
            return parseFloat(value) * 1e12;

        default:
            return parseFloat(value);
    }
}

/**
 * Converts exponential values to their full values.
 * @param {string} value The value to convert.
 */
export function convertExponentialValue(value: string): number {
    value += '';
    let sign = '';

    value.charAt(0) == '-' && (value = value.substring(1), sign = '-');

    let str = value.split(/[eE]/g);
    if(str.length < 2) {
        return Number(sign + value);
    }

    const power = Number(str[1]);
    if(power === 0) {
        return Number(sign + str[0]);
    }

    const decimal_split = 1.1.toLocaleString().substring(1, 2);
    str = str[0].split(decimal_split);

    let base_right_hand_side = str[1] || '', base_left_hand_side = str[0];

    if(power > 0) {
        if(power > base_right_hand_side.length) {
            base_right_hand_side += '0'.repeat(power - base_right_hand_side.length);
        }

        base_right_hand_side = base_right_hand_side.slice(0, power) + decimal_split + base_right_hand_side.slice(power);

        if(base_right_hand_side.charAt(base_right_hand_side.length - 1) == decimal_split) {
            base_right_hand_side = base_right_hand_side.slice(0, -1);
        }
    } else {
        const num = Math.abs(power) - base_left_hand_side.length;
        if(num > 0) {
            base_left_hand_side = '0'.repeat(num) + base_left_hand_side;
        }

        base_left_hand_side = base_left_hand_side.slice(0, power) + decimal_split + base_left_hand_side.slice(power);

        if(base_left_hand_side.charAt(0) == decimal_split) {
            base_left_hand_side = '0' + base_left_hand_side;
        }
    }

    return Number(sign + base_left_hand_side + base_right_hand_side);
}

/**
 * Parses text case.
 * @param string The text to parse.
 */
export function parseCase(string: string): void {
    string.split('_').map((char) => char[0] + char.slice(1).toLowerCase()).join(' ');
}