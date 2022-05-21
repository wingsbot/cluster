import { ActionRow, Constants, InteractionButton, SelectMenu } from 'eris';

export class MessageComponent {
  public components: ActionRow[];

  constructor(data?: ActionRow[]) {
    this.components = data || [];
  }

  public addActionRow() {
    this.components.push({
      type: Constants.ComponentTypes.ACTION_ROW,
      components: [],
    });

    return this;
  }

  public addButton(data: InteractionButton) {
    this.components[this.components.length - 1].components.push(data);
    return this;
  }

  public addMenu(data: SelectMenu) {
    this.components[this.components.length - 1].components.push(data);
    return this;
  }

  public enableAllComponents() {
    for (const component of this.components) {
      for (const c of component.components) {
        c.disabled = false;
      }
    }
  }

  public disableAllComponents() {
    for (const component of this.components) {
      for (const c of component.components) {
        c.disabled = true;
      }
    }
  }
}
