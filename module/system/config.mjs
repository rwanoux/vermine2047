export const VERMINE = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */

VERMINE.AgeTypes = {
  1:{ "name":"AGE_TYPES.young", "beginning": 0  },
  2:{ "name":"AGE_TYPES.adult", "beginning": 16 },
  3:{ "name":"AGE_TYPES.old", "beginning": 45 }
}

VERMINE.SkillLevels = {
  1:{ "label":"VERMINE.skill_level.beginner", "dicePool":1, "reroll":0},
  2:{ "label":"VERMINE.skill_level.proficient", "dicePool":1, "reroll":1},
  3:{ "label":"VERMINE.skill_level.expert", "dicePool":2, "reroll":1},
  4:{ "label":"VERMINE.skill_level.master", "dicePool":2, "reroll":2},
  5:{ "label":"VERMINE.skill_level.legend", "dicePool":3, "reroll":2}
}

VERMINE.DifficultyLevels = {
  1:{ "label":"DIFFICULTY_LEVELS.obvious", "difficulty":3},
  2:{ "label":"DIFFICULTY_LEVELS.easy", "difficulty":5},
  3:{ "label":"DIFFICULTY_LEVELS.hard", "difficulty":7},
  4:{ "label":"DIFFICULTY_LEVELS.very_hard", "difficulty":9},
  5:{ "label":"DIFFICULTY_LEVELS.impossible", "difficulty":10}
},

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
