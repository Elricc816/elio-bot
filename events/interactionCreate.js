module.exports = (client) => {

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isButton()) return;

        console.log(`Button clicked: ${interaction.customId}`);

    });

};
