/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class VermineItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }
  prepareBaseData() {
    const actorType = (this.actor !== null) ? this.actor.type : 'character';
    const itemType = this.type;


    // Vérifie si une méthode spécifique au type existe// preparedData specifique au type
    if (typeof this[`prepare${itemType.charAt(0).toUpperCase() + itemType.slice(1)}Data`] === 'function') {
      this[`prepare${itemType.charAt(0).toUpperCase() + itemType.slice(1)}Data`]();
    }

    // si dégats sur l'item, application du damage label et damage icon
    if (this.system.damages?.value) {
      this.damagedLabel = this.system.damages.state[parseInt(this.system.damages?.value) - 1];
      switch (this.damagedLabel) {
        case "endommagé":
          this.damagedIcon = '<i class="fas fa-exclamation-circle" style:"color="yellow"></i>';
          break;
        case "défectueux":
          this.damagedIcon = '<i class="fas fa-exclamation-triangle" style:"color="orange"></i>';
          break;
        case "hors d'usage":
          this.damagedIcon = '<i class="fas fa-star-exclamation" style:"color="red"></i>';
          break;

      }
    }
  }

  prepareAbilityData() {
    console.log('ability data', this)
    const actorType = (this.actor !== null) ? this.actor.type : 'character';

    if (this.system.type == "") {
      // console.log('je suis une capacité, avec pour sous-type', this.system.type, actorType);
      this.system.type = actorType;
    }
    if (this.system.totem == "" && this.actor !== null && this.actor.system.identity.totem != "") {
      // console.log('je suis une capacité, avec pour sous-type', this.system.type, actorType);
      this.system.totem = this.actor.system.identity.totem;
    }
  }
  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
  getRollData() {
    // If present, return the actor's roll data.
    if (!this.actor) return null;
    const rollData = this.actor.getRollData();
    // Grab the item's system data as well.
    rollData.item = foundry.utils.deepClone(this.system);

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.

    let mess = new ChatMessage({
      speaker: speaker,
      rollMode: rollMode,
      flavor: label,
    });
    mess.content = await renderTemplate(`systems/vermine2047/templates/item/chatCards/${this.type}.html`, { item: this, message: mess }) ?? null;
    console.log(mess)
  }

}

