import { onManageActiveEffect, prepareActiveEffectCategories } from "../system/effects.mjs";
import { VermineActorSheet } from "./actor-sheet.mjs";
import { TotemPicker, ActorPicker } from "../system/applications.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {VermineActorSheet}
 */
export class VermineGroupSheet extends VermineActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["vermine2047", "sheet", "actor", "group"],
      template: "systems/vermine2047/templates/actor/actor-sheet.hbs",
      width: 500,
      height: 500,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  get template() {
    return `systems/vermine2047/templates/actor/actor-${this.actor.type}-sheet.hbs`;
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

    if (actorData.type == 'group') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = this.actor.getRollData();

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
    context.specialties = this.actor.itemTypes['specialty'];
    context.backgrounds = this.actor.itemTypes['background'];
    context.evolutions = this.actor.itemTypes['evolution'];
    context.traumas = this.actor.itemTypes['trauma'];

    context.gear = this.actor.itemTypes['item'];
    context.weapons = this.actor.itemTypes['weapon'];
    context.defenses = this.actor.itemTypes['defense'];
    context.vehicles = this.actor.itemTypes['vehicle'];

    context.totem_abilities = this.actor.itemTypes['ability'].filter(i => i.system.type === 'totem');
    context.abilities = this.actor.itemTypes['ability'].filter(i => i.system.type !== 'totem');

    context.members = this.actor.system.members;
    context.encounters = this.actor.system.encounters;



  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Choose Totem 
    html.find('.chooseTotem').click(this._onTotemButton.bind(this));

    // Choose Members / Encounters 
    html.find('.chooseActor').click(this._onRoadButton.bind(this));
    html.find('.member-delete').click(ev => {
      const li = $(ev.currentTarget).parents("li.actor");
      const actorId = li.data("actor-id");
      const actorIdIndex = this.actor.system.members.indexOf(actorId);
      if (actorIdIndex !== -1) {
        this.actor.system.members.splice(actorIdIndex, 1);
      }
      this.actor.update({ "system.members": this.actor.system.members });
      this.render(true);
    });

    html.find('.encounter-delete').click(ev => {
      const li = $(ev.currentTarget).parents("li.actor");
      const actorId = li.data("actor-id");
      const actorIdIndex = this.actor.system.encounters.indexOf(actorId);
      if (actorIdIndex !== -1) {
        this.actor.system.encounters.splice(actorIdIndex, 1);
      }
      this.actor.update({ "system.encounters": this.actor.system.encounters });
      this.render(true);
    });

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

  /**
* Handle actor pick
* @param {Event} event   The originating click event
* @private
*/
  _onRoadButton(event) {
    event.preventDefault();
    const el = event.currentTarget;
    // const dataset = el.dataset;

    const actorPicker = new ActorPicker(el, this.actor);
    actorPicker.render(true);
  }

}
