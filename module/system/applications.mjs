export class TotemPicker extends Application {

  
  constructor(linkEl, actor) {
    super();
    this.linkEl = linkEl;
    this.actor = actor;
  }

  /* -------------------------------------------- */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id:"TOTEM_PICKER",
      title:game.i18n.localize("VERMINE.totem_picker"),
      template:'systems/vermine2047/templates/applications/choose-totem.hbs',
      popOut:true,
      resizable:true,
      height:"800",
      width:"800"
    });
  }

  getData() {
    // Send data to the template
    return {
      config: CONFIG.VERMINE,
      /*anarchy: this.gmAnarchy.getAnarchy(),
      convergences: this.gmConvergence.getConvergences(),
      difficultyPools: this.gmDifficulty.getDifficultyData(),
      options: {
        classes: [game.system.anarchy.styles.selectCssClass()]
      }*/
    }
  }

  activateListeners(html) {
    super.activateListeners(html);
      html.find('.totem').click(event => {
        const totem = $(event.target).parent('a').data('totem');
        if (totem != null){
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
    return mergeObject(super.defaultOptions, {
      id:"ACTOR_PICKER",
      title:game.i18n.localize("VERMINE.actor_picker"),
      template:'systems/vermine2047/templates/applications/choose-actor.hbs',
      popOut:true,
      resizable:true,
      height:"350",
      width:"600"
    });
  }



  getData() {
    // Send data to the template
    const npcs = game.actors.filter(a => a.type == "npc");
    const characters = game.actors.filter(a => a.type == "character");
    const encounters = game.actors.filter(a => a.type == "npc" || a.type == 'character'); 
    const type = $(this.linkEl).data('type');

    let actorsList = [];
    if (type == 'members'){
      actorsList = characters;
    } else if (type == 'relations'){
      actorsList = npc;
    } else {
      actorsList = encounters;
    }
    return {
      config: CONFIG.VERMINE,      
      actorsList: actorsList  
    }
  }

  activateListeners(html) {
    super.activateListeners(html);
      html.find('.actor').click(event => {
        const actorId = $(event.target).parent('div').data('id');
        const type = $(this.linkEl).data('type');
        let actorsList = [];

        if (type == 'members'){
          actorsList = this.actor.system.members;
        } else if (type == 'encounters'){
          actorsList = this.actor.system.encounters;
        } 
        if (!Array.isArray(actorsList)){
          actorsList = [];
        }

        actorsList.push(actorId);

        if (type == 'members'){
          actorsList = this.actor.system.members;
          this.actor.update({ 'system.members': actorsList });
        } else if (type == 'encounters'){
          this.actor.update({ 'system.encounters': actorsList });
        } 

      });
  }

}
