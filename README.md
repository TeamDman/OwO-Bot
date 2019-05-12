# OwO Bot \[Eto\]
Most configuration is done in `config.json`.\
Make sure to set your bot token like in the `.env.example`, either as an environment variable or in a `.env` file.\
The default prefix is `OwO`, and it is what will be used in the examples in this README.

## Commands
Commands are individual `.ts` files located in `/app/commands/`.\
Each file exports a single command.\
Use `OwO help` to get a list of commands.\
Use `OwO help info <command>` to get more info about a specific command. Both the name and aliases work for this.

Some commands have 'routes' in addition to having parameters.\
Example:\
`OwO tasks list`\
`OwO tasks start <taskname>`\
`OwO tasks stop <taskname>`\
The `list`/`start`/`stop` would be considered the 'route', and `<taskname>` would be the parameters for the `starts` and `stop` route.

## Tasks
Tasks are individual `.ts` files located in `/app/tasks/`.\
Tasks take no parameters, and are used to extend the bot's functionality beyond the addition of commands.\
Tasks are able to run when the bot begins, an example is the `Logger` task. This task logs edited and deleted messages.

## Development
The bot is written in typescript. This means that when you change one of the `.ts` files, you have to recompile using the `tsc` command.\
you can use `tsc --watch` to have it automatically rebuild when it detects a file change.\
If you don't want to install typescript globally (`npm -i typescript -g`) for the `tsc` command, you can:
- `npm run build`
- Run the typescript compiler manually `node node_modules/typescript/bin/tsc`

## Running
Run the bot with either:
- `npm run start`
- `node dist/app.js`