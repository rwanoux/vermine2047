import { onManageActiveEffect, prepareActiveEffectCategories } from "../system/effects.mjs";
import { VermineActorSheet } from "./actor-sheet.mjs";
import RollDialog from "../system/dialogs/rollDialog.mjs";
import { TotemPicker } from "../system/applications.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {VermineActorSheet}
 */
export class VermineCharacterSheet extends VermineActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["vermine2047", "sheet", "character", "actor"],
      template: "systems/vermine2047/templates/actor/actor-sheet.hbs",
      width: "fit-content",
      height: "fit-content",
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  get template() {
    return `systems/vermine2047/templates/actor/actor-character-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;
    context.config = CONFIG.VERMINE;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }
    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();


    //get the group actor 
    context.group = this.getGroup()


    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Handle ability scores.
    for (let [k, v] of Object.entries(context.system.abilities)) {
      v.label = game.i18n.localize(context.system.abilities[k].label) ?? k;
    }
    for (let [k, v] of Object.entries(context.system.skills)) {
      if (v.value >= 2) {
        let spe = this.actor.items.filter(it => it.type == "specialty").filter(spec => spec.system.skill == k);
        v.specialties = spe
      }

    }

  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    context.gear = this.actor.itemTypes['item'];
    context.weapons = this.actor.itemTypes['weapon'];
    context.defenses = this.actor.itemTypes['defense'];
    context.traits = this.actor.itemTypes['trait'];
    context.specialties = this.actor.itemTypes['specialty'];
    context.abilities = this.actor.itemTypes['ability'];
    context.evolutions = this.actor.itemTypes['evolution'];
    context.traumas = this.actor.itemTypes['trauma'];
    context.backgrounds = this.actor.itemTypes['background'];
    context.rumors = this.actor.itemTypes['rumor'];
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    //desactiver les inputs si mode jeu
    if (!this.actor.flags.world?.editMode) {
      this.disableInputs(html)
    }
    // Choose Totem 
    html.find('.chooseTotem').click(this._onTotemButton.bind(this));
    //activer lest jets
    html.find('.ability .rollable').click(this._onRoll.bind(this));
    //gérer les dés totems
    html.find('[data-totem-name]').click(this._onClickTotemDice.bind(this));
    //creation de specialités
    html.find('i.add-specialty').click(this.addSpecialty.bind(this))


  }

  //mode jeu/edit en mode jeu on bloque les selects et input
  disableInputs(html) {
    for (let input of html.find('input')) {
      //préserver le toggle mode jeu/ mode edit
      if (input.name != "flags.world.editMode") {
        input.setAttribute('disabled', true)
      }

    }
    for (let select of html.find('select')) {
      select.setAttribute('disabled', true)
    }
  }
  async addSpecialty(ev) {
    let skillName = ev.target.closest('.ability').querySelector('label').dataset.label;
    let itemData = {
      name: `spécialité, ${skillName}`,
      type: 'specialty',
      system: {
        skill: skillName
      }
    }
    let spec = await this.actor.createEmbeddedDocuments("Item", [itemData]);
    spec[0].sheet.render(true)
  }
  async _onClickTotemDice(ev) {
    let el = ev.currentTarget;
    let totem = el.dataset.totemName;
    let value = parseInt(el.dataset.totemValue) || 0;

    let oldValue = this.actor.system.adaptation.totems[totem].value;
    if (value === oldValue) { value-- };
    let updates = {};
    updates[`system.adaptation.totems.${totem}.value`] = value;
    //verifier le max des dés totems
    let sum = value;
    switch (totem) {
      case "human":
        sum += this.actor.system.adaptation.totems.adapted.value;
        break;
      case "adapted":
        sum += this.actor.system.adaptation.totems.human.value;
        break;
    }
    if (sum > 5) { return ui.notifications.warn("pas plus de 5 dés totems") }
    await this.actor.update(updates);
  }
  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    console.log("Ceci est un jet d'un personnage joueur");
    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.label) {
      dataset.rollType = dataset.type;

      let data = {
        actorId: this.actor.id,
        rollType: dataset.rollType,
        labelKey: dataset.label,

        label: game.i18n.localize(dataset.label)
      };

      let dial = await RollDialog.create(data);
      dial.render(true)
      return true;
    }
  }

  /**
   * Handle totem pick
   * @param {Event} event   The originating click event
   * @private
   */
  _onTotemButton(event) {
    event.preventDefault();
    const el = event.currentTarget;
    // const dataset = el.dataset;

    const totemPicker = new TotemPicker(el, this.actor);
    totemPicker.render(true);
  }

}
