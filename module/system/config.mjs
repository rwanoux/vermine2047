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
  1:{ "label":"SKILL_LEVELS.beginner", "dicePool":1, "reroll":0},
  2:{ "label":"SKILL_LEVELS.proficient", "dicePool":1, "reroll":1},
  3:{ "label":"SKILL_LEVELS.expert", "dicePool":2, "reroll":1},
  4:{ "label":"SKILL_LEVELS.master", "dicePool":2, "reroll":2},
  5:{ "label":"SKILL_LEVELS.legend", "dicePool":3, "reroll":2}
}

VERMINE.DifficultyLevels = {
  1:{ "label":"DIFFICULTY_LEVELS.obvious", "difficulty":3},
  2:{ "label":"DIFFICULTY_LEVELS.easy", "difficulty":5},
  3:{ "label":"DIFFICULTY_LEVELS.hard", "difficulty":7},
  4:{ "label":"DIFFICULTY_LEVELS.very_hard", "difficulty":9},
  5:{ "label":"DIFFICULTY_LEVELS.impossible", "difficulty":10}
},

VERMINE.ThreatLevels = {
  1:{ "label":"THREAT_LEVELS.minor", "attack":3, "vigor":1, "minorWound":1, "majorWound":1, "deadlyWound":1},
  2:{ "label":"THREAT_LEVELS.serious", "attack":4, "vigor":2, "minorWound":2, "majorWound":1, "deadlyWound":1},
  3:{ "label":"THREAT_LEVELS.major", "attack":5, "vigor":3, "minorWound":2, "majorWound":1, "deadlyWound":1},
  4:{ "label":"THREAT_LEVELS.deadly", "attack":6, "vigor":4, "minorWound":2, "majorWound":2, "deadlyWound":2},
}

VERMINE.ExperienceLevels = {
  1:{ "label":"SKILL_LEVELS.beginner", "action":3, "specialties":4, "rerolls":0, "contact":"7"},
  2:{ "label":"SKILL_LEVELS.proficient", "action":3, "specialties":5, "rerolls":0, "contact":"5 ou 7"},
  3:{ "label":"SKILL_LEVELS.expert", "action":4, "specialties":6, "rerolls":1, "contact":"5,7 ou 9"},
  4:{ "label":"SKILL_LEVELS.master", "action":4, "specialties":6, "rerolls":2, "contact":"3,5,7 ou 9"},
}

VERMINE.RoleLevels = {
  1:{ "label":"ROLE_LEVELS.minor", "reaction":3, "reaction_bonus":0, "pools":0, "gear":9, "gear_hindrance":0, "protection":1},
  2:{ "label":"ROLE_LEVELS.secondary", "reaction":3,"reaction_bonus":1, "pools":1, "gear":9,"gear_hindrance":1,  "protection":2},
  3:{ "label":"ROLE_LEVELS.important", "reaction":3, "reaction_bonus":2, "pools":2, "gear":9,"gear_hindrance":2,  "protection":3},
  4:{ "label":"ROLE_LEVELS.major", "reaction":4, "reaction_bonus":2, "pools":4, "gear":10, "gear_hindrance":2, "protection":3},
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
VERMINE.totem_opposites = {
  "human":"TOTEMS.adapted.name",
  "predator": "TOTEMS.scavenger.name" ,
  "scavenger": "TOTEMS.predator.name" ,
  "symbiote": "TOTEMS.parasite.name" ,
  "parasite": "TOTEMS.symbiote.name" ,
  "builder": "TOTEMS.horde.name" ,
  "horde": "TOTEMS.builder.name" ,
  "hive": "TOTEMS.loner.name" ,
  "loner": "TOTEMS.hive.name",
  "adapted": "TOTEMS.human.name" 
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
