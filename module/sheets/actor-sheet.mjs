import {onManageActiveEffect, prepareActiveEffectCategories} from "../system/effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class VermineActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["vermine2047", "sheet", "actor"],
      template: "systems/vermine2047/templates/actor/actor-sheet.html",
      height: 800,
      width: 690,
      resizable: false,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  get template() {
    return `systems/vermine2047/templates/actor/actor-${this.actor.type}-sheet.html`;
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
      this._prepareCharacterItems(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareNpcItems(context);
    }

    // Prepare Group data and items.
    if (actorData.type == 'group') {
      this._prepareGroupItems(context);
    }

   // Prepare Creature data and items.
    if (actorData.type == 'npc') {
      this._prepareCreatureItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  }

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

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

   
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
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterItems(context) {
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

  /**
   * Organize and classify Items for Npc sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareNpcItems(context) {
    context.gear = this.actor.itemTypes['item'];
    context.traits = this.actor.itemTypes['trait'];

  }


  /**
   * Organize and classify Items for Group sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareGroupItems(context) {
    context.gear = this.actor.itemTypes['item'];
    context.weapons = this.actor.itemTypes['weapon'];
    context.defenses = this.actor.itemTypes['defense'];  
    context.vehicles = this.actor.itemTypes['vehicle'];

    context.totem_abilities = this.actor.itemTypes['ability'].filter(i=>i.type !== 'totem');
    context.abilities = this.actor.itemTypes['ability'].filter(i=>i.type === 'totem');

  }

  /**
   * Organize and classify Items for Creature sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCreatureItems(context) {
    context.gear = this.actor.itemTypes['item'];
    context.traits = this.actor.itemTypes['trait'];
  }

  
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    // const name = `New ${type.capitalize()}`;
    const name = game.i18n.localize('ITEMS.new_' + type);

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
}
