module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {

        if (interaction.isModalSubmit()) {
            console.log(`Modal submitted: ${interaction.customId}`);
        }

    });
};
