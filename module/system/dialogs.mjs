import { VermineUtils } from "./roll.mjs";
export class CombatResultDialog extends Dialog {

  constructor(dialogData, options) {
    /*let options = { classes: ["combat", "result"], ...options };
    let conf = {
      title: "Résultat de la confrontation",
      content: dialogData.content      
    };
    super(conf, options);
    this.dialogData = dialogData;*/
  }

  /* -------------------------------------------- */
  activateListeners(html) {
    /*super.activateListeners(html);
    this.html = html;
    this.setEphemere(this.dialogData.signe.system.ephemere);
    html.find(".signe-aleatoire").click(event => this.setSigneAleatoire());
    html.find("[name='signe.system.ephemere']").change((event) => this.setEphemere(event.currentTarget.checked));
    html.find(".signe-xp-sort").change((event) => this.onValeurXpSort(event));
    html.find("input.select-actor").change((event) => this.onSelectActor(event));
    html.find("input.select-tmr").change((event) => this.onSelectTmr(event));*/
  }


  async onSelectActor(event) {
    /*const actorId = this.html.find(event.currentTarget)?.data("actor-id");
    const actor = this.dialogData.actors.find(it => it.id == actorId);
    if (actor) {
      actor.selected = event.currentTarget.checked;
    }*/
  }


}


/**
 * Represents a dialog for rolling dice.
 */
export class RollDialog extends Dialog {

  /**
   * Creates a new RollDialog instance.
   * @param {Object} data - The data for the dialog.
   * @param {HTMLElement} html - The HTML content of the dialog.
   * @param {Object} options - The options for the dialog.
   * @param {Function} close - The callback function for closing the dialog.
   */

  constructor(data, html, options, close = undefined) {
    let conf = {
      title: "jet de dés",
      content: html,
      buttons: {
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: "Lancer !",
          callback: () => {
            this.roll()
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Annuler",
          callback: () => { this.close() }
        }
      },
      close: close,
    }
    return super({ ...conf, ...data }, options);
  };

  /**
    * Creates a new RollDialog instance.
    * @param {Object} data - The data for the dialog.
    * @param {HTMLElement} html - The HTML content of the dialog.
    * @param {Object} options - The options for the dialog.
    * @param {Function} close - The callback function for closing the dialog.
    */
  static async create(data = {
    label: null,
    rolltype: null,
    NoD: 1,
    Reroll: false,
    actorId: game.user.character.id
  }) {
    // Retrieve the actor data based on the actorId
    data.actor = await game.actors.get(data.actorId);
    data.config = CONFIG.VERMINE;
    // Define options for the dialog
    let options = { classes: ["nocDialog"], width: 420, height: 'fit-content', 'z-index': 99999 };
    // Render the HTML template for the dialog
    let html = await renderTemplate('systems/vermine2047/templates/roll-dialog.hbs', data);

    // Return a new RollDialog instance with the provided data, HTML, and options
    return new RollDialog(data, html, options);
  }

  /**
  * Retrieves the default options for the RollDialog.
  */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      focus: true,
      classes: ["dialog vermine-roll"],

    });
  }
  /**
   * Retrieves the data for the dialog.
   * @returns {Object} The context data for the dialog.
   */
  getData() {
    // Get the context data from the superclass
    let context = super.getData();
    context.data = this.data;
    context.config = CONFIG.VERMINE;
    return context;
  }

  /**
   * Activates event listeners for the dialog.
   * @param {HTMLElement} html - The HTML element of the dialog.
   */
  async activateListeners(html) {
    // Activate event listeners from the superclass
    super.activateListeners(html);
    // Retrieve roll data and set up event listeners
    await this.getRollData();
    let rollInputs = html.find('[data-roll');
    for (let inp of rollInputs) {
      // Add event listener for roll input changes
      inp.addEventListener('change', await this.getRollData.bind(this))
    };
    let selectAbil = html.find('#ability')[0];
    // Set the maximum value for self control based on ability value
    html.find("#self_control")[0].max = selectAbil.value;
    selectAbil.addEventListener('change', this._onChangeAbility.bind(this));
    let selfControl = html.find('#self_control')[0]
    // Add event listener for self control changes
    selfControl.addEventListener('change', this._onChangeSelfControl.bind(this));
  };

  /**
   * Retrieves the roll data for the dialog.
   * @param {Event} ev - The event triggering the roll data retrieval.
   */
  async getRollData(ev) {
    console.log(this)
    // Calculate and store the roll data
    this.rollData = {
      actor: this.data.actor,
      NoD: this.getDicePool(),
      Reroll: this.getReroll(),
      difficulty: this.getDifficulty(),
      rollLabel: this.data.labelKey,
      totems: this.getTotems(),
      self_control: this.getSelfControl(),
      max_effort: this.getMaxEffort()
    }
  };
  /**
   * Handles the change in self control value.
   * @param {Event} ev - The event triggering the change in self control value.
   */
  _onChangeSelfControl(ev) {
    let html = this.element[0];
    // Update the displayed self control value based on the event
    html.querySelector('#self_control_value').innerText = ev.currentTarget.value;
  };

  /**
   * Retrieves the self control value from the HTML element.
   * @returns {number} The self control value.
   */
  getSelfControl() {
    let html = this.element[0];
    // Parse and return the self control value from the HTML element
    let selfControl = parseInt(html.querySelector('#self_control').value)
    return selfControl
  }

  /**
   * Retrieves the maximum effort value from the HTML element.
   * @returns {number} The maximum effort value.
   */
  getMaxEffort() {
    let html = this.element[0];
    // Retrieve and return the maximum effort value from the HTML element
    return parseInt(html.querySelector('#ability').value);
  }

  /**
   * Retrieves the selected totems from the HTML element.
   * @returns {Object} An object containing the selected totems.
   */
  getTotems() {
    let html = this.element[0];
    // Check and store the status of human and adapted totems
    let totems = {
      human: html.querySelector('#human-totem')?.checked,
      adapted: html.querySelector('#adapted-totem')?.checked,
    }
    return totems
  }

  /**
   * Handles the change in ability value.
   * @param {Event} ev - The event triggering the change in ability value.
   */
  _onChangeAbility(ev) {
    let html = this.element[0];
    // Retrieve the selected ability score and update related elements
    let score = html.querySelector('#ability').options[html.querySelector('#ability').selectedIndex].value;
    // Check if the score is a number, otherwise set it to 0
    if (!typeof score == "number") {
      score = 0
    }
    html.querySelector('#abilityScore').value = score;
    html.querySelector('#self_control').max = score;
  }
  /**
 * Retrieves the total dice pool based on various factors.
 * @returns {number} The total dice pool value.
 */
  getDicePool() {
    // Retrieve the HTML element
    let html = this.element[0];
    // Get the ability value or set to 0 if not found
    let abilValue = html.querySelector('#ability').options[html.querySelector('#ability').selectedIndex].value || 0;
    // Get the skill value or set to 0 if not found
    let skillValue = html.querySelector('#skill').options[html.querySelector('#skill').selectedIndex].dataset.pool || 0;
    // Get the self control value
    let selfControl = html.querySelector('#self_control').value;
    // Calculate bonuses based on certain conditions
    let bonuses =
      (html.querySelector('#usingSpecialization').checked ? 1 : 0) +
      (html.querySelector('#helped').checked ? 1 : 0) +
      (html.querySelector('#usingTools').checked ? 1 : 0);
    // Calculate the total dice pool
    let total = parseInt(abilValue) + parseInt(selfControl) + parseInt(skillValue) + bonuses;
    return total || 0;
  }

  /**
   * Retrieves the reroll value based on selected skill.
   * @returns {number} The reroll value.
   */
  getReroll() {
    // Retrieve the HTML element
    let html = this.element[0];
    // Get the selected skill index
    let selected = html.querySelector('#skill').selectedIndex;
    // Get the reroll value from the selected skill or set to 0 if not found
    let reroll = html.querySelector('#skill').options[selected].dataset.reroll || 0;
    return parseInt(reroll) || 0;
  }

  /**
   * Retrieves the difficulty value based on selected option.
   * @returns {number} The difficulty value.
   */

  getDifficulty() {
    // Retrieve the HTML element
    let html = this.element[0];
    // Get the selected index for difficulty
    let selected = html.querySelector('#difficulty').selectedIndex;
    // Get the difficulty value from the selected option or set to 0 if not found
    let diff = html.querySelector('#difficulty').options[selected].value || 0;
    return parseInt(diff) || 0;
  }

  /**
 * Performs a dice roll based on the roll data and handles self control checks.
 * @returns {Promise} A promise that resolves with the result of the dice roll.
 */
  async roll() {
    // Check if self control is required for the roll
    if (this.rollData.self_control > 0) {
      // Check if the actor has enough self control
      if (this.rollData.actor.system.attributes.self_control.value < this.rollData.self_control) {
        // Display a warning message if self control is insufficient
        ui.notifications.warn('vous navez pas assez de sang-froid');
        // Re-render the dialog
        this.render(true);
        return false; // Exit the function if self control is insufficient
      }
    }

    // Deduct self control points if necessary
    if (this.rollData.self_control > 0) {
      // Update the actor's self control value
      await this.rollData.actor.update({ "system.attributes.self_control.value": this.rollData.actor.system.attributes.self_control.value - this.rollData.self_control });
    }

    // Perform the dice roll using VermineUtils
    return VermineUtils.roll({ ...this.rollData });
  }
}