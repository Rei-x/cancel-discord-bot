import { Client, Intents, Message, MessageAttachment } from "discord.js";
import Canvas from "canvas";
import config from "./config";
import { drawCircledImage } from "./utils";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "cancel") {
    const cancelledUser = interaction.options.getUser("użytkownik");
    if (!cancelledUser) return;

    const canvas = Canvas.createCanvas(500, 200);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage("src/assets/cancel.png");
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(
      interaction.user.displayAvatarURL({ format: "jpg" })
    );
    drawCircledImage(context, avatar, 25, 25, 150, 150);
    const cancelledAvatar = await Canvas.loadImage(
      cancelledUser.displayAvatarURL({ format: "jpg" })
    );
    drawCircledImage(context, cancelledAvatar, 300, 25, 150, 150);

    const diamondSword = await Canvas.loadImage("src/assets/diamondsword.png");
    context.drawImage(diamondSword, 150, 50, 100, 100);

    // Draw a shape onto the main canvas

    const attachment = new MessageAttachment(canvas.toBuffer(), "cancel.png");

    const message = (await interaction.reply({
      files: [attachment],
      allowedMentions: { users: [interaction.user.id] },
      content: `<@${interaction.user.id}> chce zcancellować <@${cancelledUser.id}> \n\n Cancellujemy?`,
      fetchReply: true,
    })) as Message<true>;
    await message.react("✅");
    await message.react("❌");
  }
});

client.login(config.TOKEN);
