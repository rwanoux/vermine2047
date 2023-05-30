export const TOTEM = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */


TOTEM.SkillLevels = {
  1:{ "label":"TOTEM.skill_level.beginner", "dicePool":1, "reroll":0},
  2:{ "label":"TOTEM.skill_level.proficient", "dicePool":1, "reroll":1},
  3:{ "label":"TOTEM.skill_level.expert", "dicePool":2, "reroll":1},
  4:{ "label":"TOTEM.skill_level.master", "dicePool":2, "reroll":2},
  5:{ "label":"TOTEM.skill_level.archmaster", "dicePool":3, "reroll":2},
  5:{ "label":"TOTEM.skill_level.legend", "dicePool":3, "reroll":3},
}

TOTEM.Instincts = {
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


TOTEM.abilityCategories = {
  "physical": {
    "label":"TOTEM.ability_category.physical"
  },
  "manual": {
    "label":"TOTEM.ability_category.manual"
  },
  "mental": {
    "label":"TOTEM.ability_category.mental"
  },
  "social": {
    "label":"TOTEM.ability_category.social"
  }
}

TOTEM.skillCategories = {
  "man": {
    "label":"TOTEM.skill_category.man"
  },
  "animal": {
    "label":"TOTEM.skill_category.animal"
  },
  "tool": {
    "label":"TOTEM.skill_category.tool"
  },
  "weapon": {
    "label":"TOTEM.skill_category.weapon"
  },
  "survival": {
    "label":"TOTEM.skill_category.survival"
  },
  "world": {
    "label":"TOTEM.skill_category.world"
  }
}

TOTEM.sexes = {"male": "TOTEM.sexes.male", "female": "TOTEM.sexes.female"};

TOTEM.signs = {"wolf":"SIGNS.wolf.name","child": "SIGNS.child.name" ,
"tree": "SIGNS.tree.name" ,
"specter": "SIGNS.specter.name" ,
"whirlwind": "SIGNS.whirlwind.name" ,
"vulture": "SIGNS.vulture.name" ,
"ship": "SIGNS.ship.name" ,
"sword": "SIGNS.sword.name" ,
"cat": "SIGNS.cat.name" }

TOTEM.origins = {"aon":"Aon",
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
