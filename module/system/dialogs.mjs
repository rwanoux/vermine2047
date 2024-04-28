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
export class RollDialog extends Dialog {

  static async create(data = {
    label: null,
    rolltype: null,
    NoD: 1,
    Reroll: false,
    actorId: game.user.character.id
  }) {
    data.actor = await game.actors.get(data.actorId);
    data.config = CONFIG.VERMINE;
    let options = { classes: ["nocDialog"], width: 420, height: 'fit-content', 'z-index': 99999 };
    let html = await renderTemplate('systems/vermine2047/templates/roll-dialog.hbs', data);

    return new RollDialog(data, html, options);
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      focus: true,
      classes: ["dialog vermine-roll"],

    });
  }
  /* -------------------------------------------- */
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
  getData() {
    let context = super.getData();
    context.data = this.data;
    context.config = CONFIG.VERMINE;
    return context;
  }
  async activateListeners(html) {
    super.activateListeners(html);
    this.getRollData();
    let rollInputs = html.find('[data-roll');
    for (let inp of rollInputs) {
      inp.addEventListener('change', await this.getRollData.bind(this))
    };
    let selectAbil = html.find('#ability')[0];
    html.find("#self_control")[0].max = selectAbil.value;
    selectAbil.addEventListener('change', this._onChangeAbility.bind(this));
    let selfControl = html.find('#self_control')[0]
    selfControl.addEventListener('change', this._onChangeSelfControl.bind(this));
  };
  async getRollData(ev) {
    console.log(this)
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
    console.log('____________________________________calculating roll', this.rollData);

  };
  _onChangeSelfControl(ev) {
    let html = this.element[0];
    html.querySelector('#self_control_value').innerText = ev.currentTarget.value;


  };
  getSelfControl() {
    let html = this.element[0];
    let selfControl = parseInt(html.querySelector('#self_control').value)
    return selfControl
  }
  getMaxEffort() {
    let html = this.element[0];
    return parseInt(html.querySelector('#ability').value);
  }
  getTotems() {
    let html = this.element[0];
    let totems = {
      human: html.querySelector('#human-totem').checked,
      adapted: html.querySelector('#adapted-totem').checked,
    }
    return totems
  }
  _onChangeAbility(ev) {
    let html = this.element[0];
    let score = html.querySelector('#ability').options[html.querySelector('#ability').selectedIndex].value;

    if (!typeof score == "number") {
      score = 0
    }
    html.querySelector('#abilityScore').value = score;
    html.querySelector('#self_control').max = score;


  }
  getDicePool() {
    let html = this.element[0];
    let abilValue = html.querySelector('#ability').options[html.querySelector('#ability').selectedIndex].value || 0;
    let skillValue = html.querySelector('#skill').options[html.querySelector('#skill').selectedIndex].dataset.pool || 0;
    let selfControl = html.querySelector('#self_control').value;
    let bonuses =
      (html.querySelector('#usingSpecialization').checked ? 1 : 0) +
      (html.querySelector('#helped').checked ? 1 : 0) +
      (html.querySelector('#usingTools').checked ? 1 : 0);
    let total = parseInt(abilValue) + parseInt(selfControl) + parseInt(skillValue) + bonuses;

    return total || 0;

  }
  getReroll() {
    let html = this.element[0];
    let selected = html.querySelector('#skill').selectedIndex;
    let reroll = html.querySelector('#skill').options[selected].dataset.reroll || 0;
    return parseInt(reroll) || 0;

  }
  getDifficulty() {
    let html = this.element[0];
    let selected = html.querySelector('#difficulty').selectedIndex;
    let diff = html.querySelector('#difficulty').options[selected].value || 0;
    return parseInt(diff) || 0;
  }
  roll() {
    if (this.rollData.self_control > 0) {
      if (this.rollData.actor.system.attributes.self_control.value < this.rollData.self_control) {
        return ui.notifications.warn('vous navez pas assez de sang-froid')
      }
    }
    return VermineUtils.roll({ ...this.rollData })
  }

}