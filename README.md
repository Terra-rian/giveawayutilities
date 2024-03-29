# Giveaway Utilities

![Built with TypeScript](./.github/created-with-typescript.svg) ![License - MIT](./.github/license-mit.svg) ![Node.js Version >= 16.6.0](./.github/node.js.svg)

## ABOUT THE BOT

**DISCLAIMER:** this bot is **not** a giveaway bot. It does not manage actual giveaways, there are other more capable bots already out there that do that. If this is what you want from this bot, you're out of luck.

This bot allows server staff to manage giveaway **donations**, using a MySQL database & good old TypeScript. So far, capabilities are limited because I have not implemented any commands regarding settings and such, but the bot is able to perform basic logging & data management.

The bot is designed to log donations involving **virtual** currency, from other Discord bots. Other types of donations will be added in the future.

This is not a publicly hosted bot, you will need to host it yourself. Refer to the `SELF-HOSTING` section below.

## USING THE BOT

To use this bot, prepend `gw!` (or the prefix of your choice, if you happen to change the `config.json` file) before any command, such as `gw!help`. Each command has a help message, in case you forget how to use it.  
Slash commands are also provided, just prepend a `/` before the command.

## SELF-HOSTING

1. You will need to install [Node.js](https://nodejs.org/en/). Node.js 16.6.0 or newer is required.
    - Check the version by running `node -v` after you have installed it on your system.
    - Node.js comes with `npm`, its package manager. If it is not present, make sure to install it separately (check with `npm -v`).

2. Install [Git](https://git-scm.com/downloads). Any relatively new version is fine.
    - After installation, clone this repository with `git clone`.

3. Navigate into the cloned repository folder.
    - In the folder, run `npm install`.
    - This may take a while, depending on your system.

4. In order to run the bot, you will need to fill in some information.
    - Navigate to `src/assets` (relative to the root folder).
    - There are 2 files, `auth.example.json` and `config.example.json`:
        - For each file, fill in the proper credentials for each key.
        - Remove `example` from the file names, so they become `auth.json` / `config.json`.
        - To get a Discord bot token, head to the [Developer Dashboard](https://discord.com/login?redirect_to=%2Fdevelopers%2Fapplications).
        - Free MySQL databases are available at https://www.alwaysdata.com/.

5. Create the donations database, the `src/dbInit.ts` script is provided for that.
    - In the `src` directory, run `ts-node dbInit.ts` and wait until it's finished.

6. To run the bot, run `npm start`.
    - If any errors occur, make sure nodemon is installed (`npm install -g nodemon`), and check that you did the previous steps correctly.

## LICENSE

The code in this repository is licensed under the MIT license. For more details, see the license file at the root of this repository (`LICENSE`).