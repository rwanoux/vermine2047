export class TotemPicker extends Application {

  constructor(element) {
    super();
  }


  /* -------------------------------------------- */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id:"TOTEM_PICKER",
      title:game.i18n.localize("VERMINE.totem_picker"),
      template:'systems/vermine2047/templates/applications/choose-totem.hbs',
      popOut:true,
      resizable:true,
      height:"600",
      width:"600"
    });
  }

  getData() {
    // Send data to the template
    return {
      config: CONFIG.VERMINE
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
    // html.find('.app-title-bar').mousedown(event => this.handleDrag.onMouseDown(event));
  }
  
  async _updateObject(event, formData) {
    // console.log(formData.exampleInput);
  }
}
