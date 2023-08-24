export const VERMINE = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */


VERMINE.SkillLevels = {
  1:{ "label":"VERMINE.skill_level.beginner", "dicePool":1, "reroll":0},
  2:{ "label":"VERMINE.skill_level.proficient", "dicePool":1, "reroll":1},
  3:{ "label":"VERMINE.skill_level.expert", "dicePool":2, "reroll":1},
  4:{ "label":"VERMINE.skill_level.master", "dicePool":2, "reroll":2},
  5:{ "label":"VERMINE.skill_level.legend", "dicePool":3, "reroll":2}
}

VERMINE.Instincts = {
  1:{ "key":"architect"},
  2:{ "key":"sword"},
  3:{ "key":"flail"},
  4:{ "key":"man"},
  5:{ "key":"keeper"},
  6:{ "key":"hand"},
  7:{ "key":"mask"},
  8:{ "key":"void"},
  9:{ "key":"bone"},
  0:{ "key":"traveller"}
}


VERMINE.abilityCategories = {
  "physical": {
    "label":"VERMINE.ability_category.physical"
  },
  "manual": {
    "label":"VERMINE.ability_category.manual"
  },
  "mental": {
    "label":"VERMINE.ability_category.mental"
  },
  "social": {
    "label":"VERMINE.ability_category.social"
  }
}

VERMINE.skillCategories = {
  "man": {
    "label":"VERMINE.skill_category.man"
  },
  "animal": {
    "label":"VERMINE.skill_category.animal"
  },
  "tool": {
    "label":"VERMINE.skill_category.tool"
  },
  "weapon": {
    "label":"VERMINE.skill_category.weapon"
  },
  "survival": {
    "label":"VERMINE.skill_category.survival"
  },
  "world": {
    "label":"VERMINE.skill_category.world"
  }
}

VERMINE.sexes = {"male": "VERMINE.sexes.male", "female": "VERMINE.sexes.female"};

VERMINE.totems = {
  "human":"TOTEMS.human.name",
  "predator": "TOTEMS.predator.name" ,
  "scavenger": "TOTEMS.scavenger.name" ,
  "symbiote": "TOTEMS.symbiote.name" ,
  "parasite": "TOTEMS.parasite.name" ,
  "builder": "TOTEMS.builder.name" ,
  "horde": "TOTEMS.horde.name" ,
  "hive": "TOTEMS.hive.name" ,
  "loner": "TOTEMS.loner.name",
  "adapted": "TOTEMS.adapted.name" 
}

VERMINE.origins = {"aon":"Aon",
"avhorae": "Avhorae" ,
"babel": "Babel",
"soleil_noir": "Empire du Soleil Noir",
"fakhar": "Fakhar",
"horde": "Horde",
"khashan": "Khashan",
"ool": "Ool",
"shattered_kingdoms": "Royaumes divisés",
"saeth": "Saeth",
"tegee": "Tégée (Thalos)",
"tuuhle": "Tuuhle",
"vaelor": "Vaelor",
"valdheim": "Valdheim"
}
