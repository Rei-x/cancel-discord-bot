import Canvas from "canvas";
import { MessageAttachment, User } from "discord.js";
import { drawCircledImage } from "./utils";

// eslint-disable-next-line import/prefer-default-export
export const createCancelImage = async (user: User, cancelledUser: User) => {
  const canvas = Canvas.createCanvas(500, 200);
  const context = canvas.getContext("2d");

  const background = await Canvas.loadImage("src/assets/cancel.png");
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  const avatar = await Canvas.loadImage(
    user.displayAvatarURL({ format: "jpg" })
  );
  drawCircledImage(context, avatar, 25, 25, 150, 150);
  
  const cancelledAvatar = await Canvas.loadImage(
    cancelledUser.displayAvatarURL({ format: "jpg" })
  );
  drawCircledImage(context, cancelledAvatar, 300, 25, 150, 150);

  const diamondSword = await Canvas.loadImage("src/assets/diamondsword.png");
  context.drawImage(diamondSword, 150, 50, 100, 100);

  return new MessageAttachment(canvas.toBuffer(), "cancel.png");
}