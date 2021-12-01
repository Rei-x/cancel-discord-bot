import Canvas from "canvas";

// eslint-disable-next-line import/prefer-default-export
export const drawCircledImage = async (
  context: Canvas.NodeCanvasRenderingContext2D,
  image: Canvas.Image,
  dx: number,
  dy: number,
  dh: number,
  dw: number
) => {
  context.save();
  context.beginPath();
  // Start the arc to form a circle
  context.arc(dw / 2 + dx, dh / 2 + dy, dh / 2, 0, Math.PI * 2, true);
  // Put the pen down
  context.closePath();
  // Clip off the region you drew on
  context.clip();

  // Draw a shape onto the main canvas
  context.drawImage(image, dx, dy, dh, dw);
  context.restore();
};
