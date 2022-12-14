/*														*\
==========================================================
===		Developer: AguaDeCoco						   ===
===		Made with love in Argentina					   ===
===		First re-code								   ===
==========================================================
\*														*/

const fs = require("node:fs")
const discord = require("discord.js")
const client = new discord.Client({
    intents: [
		new discord.IntentsBitField(32767)
	]
})
client.config = require("./config")
let events = fs.readdirSync("./events").filter(f => f.endsWith(".js"))
for(let file of events) {
    const event = require(`./events/${file}`)
    client.on(event.name, (...args) => {
        try {
            event.run(client, ...args)
        } catch(error) { throw new Error(error) }
    })
}

client.commands = new discord.Collection()
let commands = []
const commandsDir = fs.readdirSync("./commands")
for (const file of commandsDir) {
	const commandRun = require(`./commands/${file}/index.js`)
	const command = require(`./commands/${file}/data.js`);
	commands.push(command)
	client.commands.set(command.name, commandRun)
}


// Load slash commands

require("dotenv").config()
const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '10' }).setToken(process.env.token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			discord.Routes.applicationCommands(client.config.client_id),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

require("./extra")(client);
client.login(process.env.token)
.then(() => {
	console.log("Log in...")
})
