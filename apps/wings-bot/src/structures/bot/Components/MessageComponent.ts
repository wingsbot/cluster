import {
  APIActionRowComponent,
  APIButtonComponentWithCustomId,
  APIButtonComponentWithURL,
  APIMessageActionRowComponent,
  APIMessageComponent,
  APIMessageComponentEmoji,
  APISelectMenuComponent,
  APISelectMenuOption,
  ButtonStyle,
  ComponentType,
} from 'discord-api-types/v10';

type ButtonStyles = 'blue' | 'green' | 'red' | 'grey';
type MenuOptions = Omit<APISelectMenuComponent, 'custom_id' | 'type' | 'options'>;

export class MessageComponent {
  components: APIMessageComponent[] = [{
    type: ComponentType.ActionRow,
    components: [],
  }];

  constructor(public uniqueId?: string) {}

  addActionRow() {
    this.components.push({
      type: ComponentType.ActionRow,
      components: [],
    });
  }

  addButton(label: string | APIMessageComponentEmoji, customId: string, style?: ButtonStyles, required?: boolean) {
    const button: APIButtonComponentWithCustomId = {
      ...(typeof label === 'string' ? { label: label } : { emoji: label }),
      custom_id: `${customId}${this.uniqueId ? `:${this.uniqueId}` : ''}`,
      style: this.getButtonStyle(style),
      type: ComponentType.Button,
      ...(required && { required: true }),
    };

    (this.components[this.components.length - 1] as APIActionRowComponent<APIMessageActionRowComponent>).components.push(button);
    return this;
  }

  addURLButton(label: string | APIMessageComponentEmoji, url: string) {
    const button: APIButtonComponentWithURL = {
      ...(typeof label === 'string' ? { label: label } : { emoji: label }),
      style: ButtonStyle.Link,
      type: ComponentType.Button,
      url,
    };

    (this.components[this.components.length - 1] as APIActionRowComponent<APIMessageActionRowComponent>).components.push(button);
    return this;
  }

  addMenu(customId: string, selections: APISelectMenuOption[], options: MenuOptions = {}) {
    const menu: APISelectMenuComponent = {
      type: ComponentType.SelectMenu,
      custom_id: `${customId}${this.uniqueId ? `:${this.uniqueId}` : ''}`,
      options: selections,
      ...options,
    };

    this.components.push({
      type: ComponentType.ActionRow,
      components: [menu],
    });
    return this;
  }

  addModal() {
    return 'lol wait till its better';
  }

  private getButtonStyle(style: ButtonStyles) {
    switch (style) {
    case 'blue':
      return ButtonStyle.Primary;
    case 'grey':
      return ButtonStyle.Secondary;
    case 'green':
      return ButtonStyle.Success;
    case 'red':
      return ButtonStyle.Danger;

    default: return ButtonStyle.Primary;
    }
  }
}
