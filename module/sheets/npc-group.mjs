import {onManageActiveEffect, prepareActiveEffectCategories} from "../system/effects.mjs";
import { VermineActorSheet } from "./actor-sheet.mjs";
import { TotemPicker, ActorPicker } from "../system/applications.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {VermineActorSheet}
 */
export class VermineGroupSheet extends VermineActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["vermine2047", "sheet", "actor"],
      template: "systems/vermine2047/templates/actor/actor-sheet.hbs",
      width: 600,
      height: 600,
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
    // Initialize containers.
    const abilities = [];
    const specialties = [];
    const backgrounds = [];
    const evolutions = [];
    const traumas = [];


    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      if (i.type === 'ability') {
        abilities.push(i);
      }
      else if (i.type === 'specialty') {
        specialties.push(i);
      }
      else if (i.type === 'background') {
        backgrounds.push(i);
      }
      else if (i.type === 'evolution') {
        evolutions.push(i);
      }
      else if (i.type === 'trauma') {
        traumas.push(i);
      }

    }

    // Assign and return
    context.abilities = abilities;
    context.specialties = specialties;
    context.backgrounds = backgrounds;
    context.evolutions = evolutions;
    context.traumas = traumas;
    context.members = [];
    context.encounters = [];
    
    for(let memberId of context.actor.system.members){
      context.members.push(game.actors.get(memberId));
    }
    
    for(let encounterId of context.actor.system.encounters){
      context.encounters.push(game.actors.get(encounterId));
    }

  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add and delete Inventory Item
    // already configured in parents listeners

    // Choose Totem 
    html.find('.chooseTotem').click(this._onTotemButton.bind(this));

     // Choose Members / Encounters 
     html.find('.chooseActor').click(this._onRoadButton.bind(this));
     html.find('.member-delete').click(ev => {
      const li = $(ev.currentTarget).parents("li.actor");
      const actorId = li.data("actor-id");
      const actorIdIndex = this.actor.system.members.indexOf(actorId);
      if (actorIdIndex !== -1){
        this.actor.system.members.splice(actorIdIndex, 1);
      }
      this.actor.update({ "system.members": this.actor.system.members });
      this.render(true);
    });

    html.find('.encounter-delete').click(ev => {
      const li = $(ev.currentTarget).parents("li.actor");
      const actorId = li.data("actor-id");
      const actorIdIndex = this.actor.system.encounters.indexOf(actorId);
      if (actorIdIndex !== -1){
        this.actor.system.encounters.splice(actorIdIndex, 1);
      }
      this.actor.update({ "system.encounters": this.actor.system.encounters });
      this.render(true);
    });

    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
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

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
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
