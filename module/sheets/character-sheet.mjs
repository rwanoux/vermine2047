import {onManageActiveEffect, prepareActiveEffectCategories} from "../system/effects.mjs";
import { VermineActorSheet } from "./actor-sheet.mjs";
import { getRollBox } from "../system/dialogs.mjs";
import { TotemPicker } from "../system/applications.mjs";
import { setCharacterEffort, setCharacterSelfControl, setCharacterThresholds } from "../system/functions.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {VermineActorSheet}
 */
export class VermineCharacterSheet extends VermineActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["vermine2047", "sheet", "actor"],
      template: "systems/vermine2047/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  get template() {
    return `systems/vermine2047/templates/actor/actor-character-sheet.html`;
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
    const actor = game.actors.get(context.data._id);
    // Handle ability scores.
    for (let [k, v] of Object.entries(context.system.abilities)) {
      v.label = game.i18n.localize(context.system.abilities[k].label) ?? k;
    }

    setCharacterEffort(actor);
    setCharacterSelfControl(actor);
    setCharacterThresholds(actor);
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
    const gear = [];
    const features = [];
    const spells = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: []
    };

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === 'feature') {
        features.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        if (i.system.spellLevel != undefined) {
          spells[i.system.spellLevel].push(i);
        }
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.spells = spells;
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
    
    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Rollable abilities.
    html.find('input[name="system.identity.age"]').change(ev => {
      const age = parseInt(ev.target.value,10);
      let ageType = "2";

      Object.keys(CONFIG.VERMINE.AgeTypes).forEach((type) => {
        if(age >= parseInt(CONFIG.VERMINE.AgeTypes[type].beginning,10)){
          ageType = type; 
        }
      });

      this.actor.update({ 'system.identity.ageType': ageType });

    });

    // Choose Totem 
    html.find('.chooseTotem').click(this._onTotemButton.bind(this));

    // Drag events for macros.
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
        if (dataset.type == 'ability'){
          data.abilityScore = this.actor.system.abilities[dataset.label].value;
        } else if (dataset.type == 'skill'){
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
