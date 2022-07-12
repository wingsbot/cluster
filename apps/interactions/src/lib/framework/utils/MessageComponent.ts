
export class MessageComponent {
  components: ActionRow[];

  constructor(data?: ActionRow[]) {
    this.components = data || [];
  }

  addActionRow() {
    this.components.push({
      type: Constants.ComponentTypes.ACTION_ROW,
      components: [],
    });

    return this;
  }

  addButton(data: InteractionButton) {
    this.components[this.components.length - 1].components.push(data);
    return this;
  }

  addMenu(data: SelectMenu) {
    this.components[this.components.length - 1].components.push(data);
    return this;
  }

  enableAllComponents() {
    for (const component of this.components) {
      for (const c of component.components) {
        c.disabled = false;
      }
    }
  }

  disableAllComponents() {
    for (const component of this.components) {
      for (const c of component.components) {
        c.disabled = true;
      }
    }
  }
}
