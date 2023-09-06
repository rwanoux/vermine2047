
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
    this.system.attributes.self_control.max = 0 + Object.values(this.system.abilities).filter(i => i.category === "mental" || i.category === "social").map((i) => i.value).reduce((acc, curr) => acc + curr, 0) + this.modFromAgeSelfControl;
  }

  _setCharacterEffort() {
    this.system.attributes.effort.max = 0 + Object.values(this.system.abilities).filter(i => i.category === "physical" || i.category === "manual").map((i) => i.value).reduce((acc, curr) => acc + curr, 0) + this.modFromAgeEffort;
  }
  
  _setCharacterThresholds() {
    const health = this.system.abilities.health.value;

    this.system.minorWound.threshold = health;
    this.system.majorWound.threshold = health + 3;
    this.system.deadlyWound.threshold = (health + 7 < 11) ? health + 7 : 10;

    this.system.minorWound.max = 4 + this.modFromAgeWounds.l;
    this.system.majorWound.max =  3 + this.modFromAgeWounds.h;
    this.system.deadlyWound.max = 2 + this.modFromAgeWounds.d;
  }
  

  _setAgeType(){
    Object.keys(CONFIG.VERMINE.AgeTypes).forEach((type) => {
      if(this.system.identity.age >= parseInt(CONFIG.VERMINE.AgeTypes[type].beginning,10)){
        this.system.identity.ageType = type; 
      }
    });
  }

  get ageType() {
    return this.system.identity.ageType;
  }

  get modFromAgeSelfControl() {
    return this.ageType == 1 ? -1 : 0;
  }

  get modFromAgeEffort() {
    if (this.ageType == 1) return -1;
    if (this.ageType == 3) return -2;
    return 0;
  }

  get modFromAgeWounds() {
    if (this.ageType == 1) return {l : 0, h : 0, d: -1};
    if (this.ageType == 3) return {l : -1, h : -1, d: -1};    
    return {l : 0, h : 0, d: 0};
  }

}