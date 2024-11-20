export class TotemPicker extends Application {


  constructor(linkEl, actor) {
    super();
    this.linkEl = linkEl;
    this.actor = actor;
  }

  /* -------------------------------------------- */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "TOTEM_PICKER",
      title: game.i18n.localize("VERMINE.totem_picker"),
      template: 'systems/vermine2047/templates/applications/choose-totem.hbs',
      popOut: true,
      resizable: true,
      height: "800",
      width: "800"
    });
  }

  getData() {
    // Send data to the template
    return {
      config: CONFIG.VERMINE,
    }
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find('.totem').click(event => {
      const totem = $(event.target).parent('a').data('totem');
      if (totem != null) {
        this.actor.update({ 'system.identity.totem': totem });
      }
      this.close();
    });
  }

  /*async _updateObject(event, formData) {
    // console.log(formData.exampleInput);
  }*/
}


export class ActorPicker extends Application {


  constructor(linkEl, actor) {
    super();
    this.linkEl = linkEl;
    this.actor = actor;
  }

  /* -------------------------------------------- */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "ACTOR_PICKER",
      title: game.i18n.localize("VERMINE.actor_picker"),
      template: 'systems/vermine2047/templates/applications/choose-actor.hbs',
      popOut: true,
      resizable: true,
      height: "350",
      width: "600"
    });
  }



  getData() {
    // Send data to the template
    const npcs = game.actors.filter(a => a.type == "npc");
    const characters = game.actors.filter(a => a.type == "character");
    const all = game.actors.filter(a => a.type == "npc" || a.type == 'character');
    const type = $(this.linkEl).data('type');

    let actorsList = [];
    if (type == 'members') {
      actorsList = characters;
    } else if (type == 'relations') {
      actorsList = npc;//[...npc, ...characters];
    } else {
      actorsList = all;
    }
    return {
      config: CONFIG.VERMINE,
      actorsList: actorsList
    }
  }

  async activateListeners(html) {
    super.activateListeners(html);
    html.find('.actor').click(async (event) => {
      const actorId = $(event.target).parent('div').data('actor-id');
      const type = $(this.linkEl).data('type');
      let actorsList = [];

      if (type == 'members') {
        actorsList = this.actor.system.members;
      } else if (type == 'encounters') {
        actorsList = this.actor.system.encounters;
      }
      if (!Array.isArray(actorsList)) {
        actorsList = [];
      }

      actorsList.push(actorId);

      if (type == 'members') {
        actorsList = this.actor.system.members;
        this.actor.update({ 'system.members': actorsList });
      } else if (type == 'encounters') {
        this.actor.update({ 'system.encounters': actorsList });
      }

    });
  }

}


export class TraitSelector extends Application {

  constructor(targetItem) {
    super();
    this.targetItem = targetItem;
    this.traits = CONFIG.VERMINE.traits
  }

  /* -------------------------------------------- */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "TRAITS_SELECTOR",
      title: game.i18n.localize("VERMINE.traits_selector"),
      template: 'systems/vermine2047/templates/applications/choose-traits.hbs',
      popOut: true,
      resizable: true,
      height: "500",
      width: "500"
    });
  }
  getData() {
    return {
      traits: this.traits,
      item: this.targetItem
    }
  }
  async activateListeners(html) {
    super.activateListeners(html);
    this.validateTraits(html);
    html.find('input').change(ev => {
      this.onChangeInput(ev)
    })

  }
  async validateTraits(html) {
    let checks = html.find("input.trait-selector");
    for (let inp of checks) {
      if (this.targetItem.system.traits[inp.dataset.trait]) {
        if (inp.type == "checkbox") {
          inp.checked = true
        }
             }
    }
    await this.render(true)
  }

  async onChangeInput(ev) {
    let el = ev.currentTarget;

    let traitKey = el.dataset.trait; // Récupère la clé du trait à partir de l'attribut data-trait
    let traitValue = parseInt(el.value) || null
    let traits = this.targetItem.system.traits || {}; // Récupère les traits actuels, ou un objet vide si aucun trait n'est défini


    console.log(traitKey, traitValue, traits)

    if (el.classList.contains('trait-selector')) {
      if (!traits[traitKey]) {
        // Si la case est cochée, ajoute le trait
        await this.targetItem.update({ [`system.traits.${traitKey}`]: this.traits[traitKey] });
      } else {
        // Si la case est décochée, retire le trait
        await this.targetItem.update({ [`system.traits.${traitKey}`]: null });
      }
    }
    if (traitValue) {
      console.log(el.value)
      // Logique pour les valeurs des traits si nécessaire
      el.closest("label").querySelector('.trait-selector').checked = true;
    } else {
      el.closest("label").querySelector('.trait-selector').checked = false;
    }
    this.render(true)
  }
}