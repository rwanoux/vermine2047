import { TraitSelector } from "../system/applications.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class VermineItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["vermine2047", "sheet", "item"],
      width: "fit-content",
      height: "auto",
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/vermine2047/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `${path}/item-${this.item.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.item;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;
    context.config = CONFIG.VERMINE;

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;
    //click on wound radio
    html.find('.damages-row [type="radio"]').click(ev => {
      this._onClickDamage(ev)
    })

    html.find('.traits-selector').click(ev => {
      this.openTraitSelector(ev)
    })
  }
  async _onClickDamage(ev) {
    if (!ev.currentTarget.checked) { return }
    let prop = ev.currentTarget.name;
    let update = {};
    update[prop] = ev.currentTarget.value - 1

    this.item.update(update)
  }

  async openTraitSelector(ev) {
    let selector = new TraitSelector(this.item);
    selector.render(true)
  }
}
