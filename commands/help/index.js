exports.run = (app, message, args) => {
	const embed = new app.libs.discord.EmbedBuilder()
	.setColor(0xFF0000)
	.setTitle(app.lang({
		en: "Help",
		es: "Ayuda"
	}, message))

	app.commands._config.map(cmd => {
		embed.addField(cmd.name, app.lang({
			en: cmd.description.en,
			es: cmd.description.es
		}, message))
	})

	message.reply({embeds: [embed]})
}
