import { onManageActiveEffect, prepareActiveEffectCategories } from "../system/effects.mjs";
import { VermineActorSheet } from "./actor-sheet.mjs";
import { getRollBox } from "../system/dialogs.mjs";
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
      width: 600,
      height: 600,
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
    // Choose Totem 
    html.find('.chooseTotem').click(this._onTotemButton.bind(this));
    html.find('.ability .rollable').click(this._onRoll.bind(this));

  }


  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
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
      /*const label = game.i18n.localize(dataset.label) ? `[ability] ${game.i18n.localize(dataset.label)}` : '';
      console.log($(element).attr('for'));
      const NoD = this.actor.system.skills[$(element).attr('for').split('.')[2]]?.value || 0
     return game.vermine2047.VermineRoll.roll(this.actor.id, label, NoD, 0, {});*/
      let data = {
        actorId: this.actor.id,
        abilities: this.actor.system.abilities,
        skills: this.actor.system.skills,
        rollType: dataset.rollType,
        labelKey: dataset.label,
        abilityScore: 0,
        skillScore: 0,
        label: game.i18n.localize(dataset.label)
      };
      if (dataset.type == 'ability') {
        data.abilityScore = this.actor.system.abilities[dataset.label].value;
      } else if (dataset.type == 'skill') {
        data.skillScore = this.actor.system.skills[dataset.label].value;
      }
      getRollBox(data);
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
