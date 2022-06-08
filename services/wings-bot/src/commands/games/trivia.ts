import { request } from 'undici';
import { ApplicationCommandOptions, ComponentInteraction, Constants, InteractionButton } from 'eris';
import { CommandBase, CommandData, InteractionTimeoutError, AwaitComponentReturn } from '../../lib/framework';
import { MessageComponent } from '../../lib/framework/utils';

interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export default class Trivia extends CommandBase {
  description = 'Play some trivia and earn some Wings!';
  cooldown = 1000 * 60 * 5;
  options: ApplicationCommandOptions[] = [{
    name: 'difficulty',
    type: Constants.ApplicationCommandOptionTypes.STRING,
    description: 'Difficulty of the game!',
    choices: [{
      name: `Easy - ${this.client.modules.economy.parseInt(250)}`,
      value: 'easy',
    },
    {
      name: `Medium - ${this.client.modules.economy.parseInt(500)}`,
      value: 'medium',
    },
    {
      name: `Hard - ${this.client.modules.economy.parseInt(1000)}`,
      value: 'hard',
    }],
    required: true,
  }];

  exec = async ({ cooldown, interaction, responder, options }: CommandData) => {
    const choice = options[0].value as string;
    const componentBase = new MessageComponent()
      .addActionRow();

    const multiplier = await this.client.modules.economy.getMultiplier(interaction.member.id);
    let winningAmount = 0;

    if (choice === 'easy') winningAmount = 250 * multiplier;
    else if (choice === 'medium') winningAmount = 500 * multiplier;
    else winningAmount = 1000 * multiplier;

    const triviaRequest = await request(`https://opentdb.com/api.php?amount=1&encode=url3986&difficulty=${choice}`);
    const body = await triviaRequest.body.json();
    const triviaQuestion = body.results[0] as TriviaQuestion;

    const id = this.client.util.generateId();
    const embed = {
      author: {
        name: interaction.member.tag,
        icon_url: interaction.member.avatarURL,
      },
      title: decodeURIComponent(triviaQuestion.question),
      color: responder.colors.blue,
      footer: {
        text: `Category: ${decodeURIComponent(triviaQuestion.category)}`,
      },
    };

    const shuffledAnswers = [triviaQuestion.correct_answer, ...triviaQuestion.incorrect_answers].sort(() => Math.random() - 0.5);

    for (let answer of shuffledAnswers) {
      answer = decodeURIComponent(answer);
      componentBase.addButton({
        label: answer,
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: `${answer}:${id}`,
        disabled: false,
      });
    }

    await responder.sendRaw({
      content: `For **${this.client.modules.economy.parseInt(winningAmount)}**, answer this within **${this.client.util.msDuration(12000)}**`,
      embeds: [embed],
      components: componentBase.components,
    });

    let response: ComponentInteraction & AwaitComponentReturn;
    try {
      response = await this.client.util.awaitComponent(interaction, responder, id, { time: 12000, strict: true });
    } catch (error) {
      if (error instanceof InteractionTimeoutError) {
        responder.editRaw({
          content: '',
          embeds: [{
            description: `${responder.emojis.xmark} you ran out of time!`,
          }],
          components: [],
        });
      }

      cooldown.setCooldown();
      return;
    }

    const buttons = componentBase.components[0].components as InteractionButton[];
    if (response.parsedId === decodeURIComponent(triviaQuestion.correct_answer)) {
      for (const c of buttons) {
        c.disabled = true;
        if (c.custom_id.split(':')[0] === response.parsedId) c.style = Constants.ButtonStyles.SUCCESS;
      }

      await this.client.modules.economy.editBalance(interaction.member.id, winningAmount);

      embed.title = `Nice job! You win **${this.client.modules.economy.parseInt(winningAmount)}**`;
      embed.color = responder.colors.green;

      response.responder.editRaw({ embeds: [embed], components: componentBase.components });
    } else {
      for (const c of buttons) {
        c.disabled = true;
        if (c.custom_id.split(':')[0] === response.parsedId) c.style = Constants.ButtonStyles.DANGER;
        if (c.custom_id.split(':')[0] === decodeURIComponent(triviaQuestion.correct_answer)) c.style = Constants.ButtonStyles.SUCCESS;
      }

      embed.title = 'Darn you got it wrong. Better luck next time 😉';
      embed.color = responder.colors.red;

      response.responder.editRaw({ embeds: [embed], components: componentBase.components });
    }

    cooldown.setCooldown();
  };
}
