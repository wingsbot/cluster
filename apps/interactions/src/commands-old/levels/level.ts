import { ApplicationCommandOptions, Constants } from 'eris';
import { loadImage, createCanvas, CanvasRenderingContext2D } from 'canvas';
import { CommandBase, CommandData } from '../../lib/framework';

interface RoundedData {
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
  color?: string;
}

interface ProgressBar {
  x: number;
  y: number;
  completedSize: number;
  completedColor: string;
  leftSize: number;
  leftColor: string;
  userPercent: number;
}

export default class Level extends CommandBase {
  description = 'Get your level status here';

  options: ApplicationCommandOptions[] = [{
    name: 'user',
    type: Constants.ApplicationCommandOptionTypes.USER,
    description: 'Input a user, or press send for yourself.',
  }];

  exec = async ({ interaction, responder, options }: CommandData) => {
    const userId = options?.[0]?.value as string || interaction.member.id;
    const user = await this.client.fetchUser(userId);

    const userLevelData = await this.client.modules.levels.getUserData(userId);
    const xpToFinishLevel = this.client.modules.levels.xpToFinishLevel(userLevelData.level);
    const rank = await this.client.modules.levels.getUserRank(userId);

    const canvas = createCanvas(1250, 600);
    const ctx = canvas.getContext('2d');

    const background = await loadImage(userLevelData.backgroundURL);
    const avatarURL = await loadImage(user.avatarURL);

    // draw the starting canvas image
    ctx.save();
    this.roundedImage(ctx, {
      x: 0,
      y: 0,
      w: 1250,
      h: 600,
      radius: 40,
    });
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(background,
      userLevelData.backgroundX || 0,
      userLevelData.backgroundY || 0,
      userLevelData.backgroundW || background.width,
      userLevelData.backgroundH || background.height);
    ctx.restore();

    // sets the big background square
    ctx.globalAlpha = userLevelData.bigSquareOpacity;
    this.roundRectangle(ctx, {
      x: 25,
      y: 125,
      w: 1200,
      h: 450,
      radius: 100,
      color: userLevelData.bigSquareColor,
    });
    ctx.globalAlpha = 1;
    ctx.save();

    // draws the users avatar in
    ctx.beginPath();
    ctx.arc(625, 135, 110, 0, 6.28, false);
    ctx.clip();
    ctx.stroke();
    ctx.closePath();
    ctx.drawImage(avatarURL, 515, 25, 220, 220);
    ctx.restore();

    // progress bar bubble, one day find a better way to do this, its slow
    await this.progressBar(ctx, {
      x: 115,
      y: 400,
      completedSize: 18,
      leftSize: 15,
      completedColor: userLevelData.filledDotsColor,
      leftColor: userLevelData.emptyDotsColor,
      userPercent: userLevelData.percent,
    });

    // username
    ctx.fillStyle = userLevelData.usernameColor;
    ctx.textAlign = 'center';
    ctx.font = 'bold 60px calibri';
    ctx.fillText(`${user.tag}`, 625, 305);

    // global rank
    ctx.fillStyle = userLevelData.rankColor;
    ctx.font = 'bold 60px calibri';
    ctx.textAlign = 'right';
    ctx.fillText(`Rank #${rank.toLocaleString()}`, 1150, 90);

    // xp till next level text
    ctx.fillStyle = userLevelData.xpColor;
    ctx.font = '45px calibri';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.fixedNumber(userLevelData.exp - xpToFinishLevel)} XP to reach next level.`, 625, 525);

    // Current level
    ctx.fillStyle = userLevelData.levelColor;
    ctx.textAlign = 'left';
    ctx.font = 'bold 60px calibri';
    ctx.fillText(`Level ${userLevelData.level}`, 90, 90);

    await responder.sendRaw('', { name: 'level.png', file: canvas.toBuffer() });
  };

  private fixedNumber(number: number) {
    return Math.abs(number) > 999 ? `${Math.sign(number) * Number((Math.abs(number) / 1000).toFixed(1))}k` : number.toLocaleString();
  }

  private roundedImage(context: CanvasRenderingContext2D, data: RoundedData) {
    const { x, y, w, h, radius } = data;

    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + w - radius, y);
    context.quadraticCurveTo(x + w, y, x + w, y + radius);
    context.lineTo(x + w, y + h - radius);
    context.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    context.lineTo(x + radius, y + h);
    context.quadraticCurveTo(x, y + h, x, y + h - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  }

  private roundRectangle(context: CanvasRenderingContext2D, data: RoundedData) {
    const { x, y, w, h, radius, color } = data;
    const r = x + w;
    const b = y + h;

    context.beginPath();
    context.fillStyle = color;
    context.moveTo(x + radius, y);
    context.lineTo(r - radius, y);
    context.quadraticCurveTo(r, y, r, y + radius);
    context.lineTo(r, y + h - radius);
    context.quadraticCurveTo(r, b, r - radius, b);
    context.lineTo(x + radius, b);
    context.quadraticCurveTo(x, b, x, b - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
    context.stroke();
    context.fill();
  }

  private async progressBar(context: CanvasRenderingContext2D, data: ProgressBar) {
    const { y, completedSize, completedColor, userPercent } = data;
    const completedLength = Math.floor(userPercent) / 10;

    context.fillStyle = completedColor;
    const size = completedSize;

    context.beginPath();
    for (let i = 0; i < completedLength; i++) {
      context.moveTo(data.x, y);
      context.arc(data.x, y, size, 0, Math.PI * 2, true);

      data.x += 100;
    }

    context.fill();
    await this.progressAddBlank(context, data);
  }

  private async progressAddBlank(context: CanvasRenderingContext2D, data: ProgressBar) {
    const { y, leftSize, leftColor, userPercent } = data;
    const completedLength = Math.floor(userPercent) / 10;

    context.fillStyle = leftColor;
    const size = leftSize;

    if (10 - completedLength === 10) data.x += 65;

    context.beginPath();
    for (let i = 0; i < 10 - completedLength; i++) {
      context.moveTo(data.x, y);
      context.arc(data.x, y, size, 0, Math.PI * 2, true);

      data.x += 100;
    }

    context.fill();
  }
}
