
/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class VermineActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();

  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
    
    if (this.type == 'character'){
      this._setAgeType();
      this._setCharacterEffort();
      this._setCharacterSelfControl();
      this._setCharacterThresholds();
    }
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.vermine2047 || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(systemData.abilities)) {
      // Calculate the modifier using d20 rules.
      ability.mod = Math.floor((ability.value - 10) / 2);
    }
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.xp = (systemData.cr * systemData.cr) * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;

    // Process additional NPC data here.
  }

  _setCharacterSelfControl() {
    let self_control = 0;

    for(let i in this.system.abilities){
      if (this.system.abilities[i].category == 'mental' || this.system.abilities[i].category == 'social'){
        self_control += this.system.abilities[i].value;  
      }
    }
    /// gestion de l'age
    if (this.system.identity.ageType == 1){
      self_control--;
    }
    
    this.system.attributes.self_control.max = self_control;
  }

  _setCharacterEffort() {
    let effort = 0;

    // calcul de l'effort
    for(let i in this.system.abilities){
      if (this.system.abilities[i].category == 'physical' || this.system.abilities[i].category == 'manual'){
        effort += this.system.abilities[i].value;  
      }
    }
  
    /// gestion de l'age
    if (this.system.identity.ageType == 1){
      effort--;
    } else if (this.system.identity.ageType == 3){
      effort -= 2;
    }
  
    this.system.attributes.effort.max = effort;
  }
  
  _setCharacterThresholds() {
    const health = this.system.abilities.health.value;

    this.system.minorWound.threshold = health;
    this.system.majorWound.threshold = health + 3;
    this.system.deadlyWound.threshold = (health + 7 < 11) ? health + 7 : 10;

    let lightWounds = 4;
    let heavyWounds = 3;
    let deadlyWounds = 2;

    if (this.system.identity.ageType == 3){
      lightWounds--;
      heavyWounds--;
      deadlyWounds--;
    } else if (this.system.identity.ageType == 1){
      deadlyWounds--;
    }

    this.system.minorWound.max = lightWounds;
    this.system.majorWound.max = heavyWounds;
    this.system.deadlyWound.max = deadlyWounds;
  }

  _setAgeType(){
    Object.keys(CONFIG.VERMINE.AgeTypes).forEach((type) => {
      if(this.system.identity.age >= parseInt(CONFIG.VERMINE.AgeTypes[type].beginning,10)){
        this.system.identity.ageType = type; 
      }
    });
  }

}