export const VERMINE = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */

VERMINE.AgeTypes = {
  1: { "name": "AGE_TYPES.young", "beginning": 0 },
  2: { "name": "AGE_TYPES.adult", "beginning": 18 },
  3: { "name": "AGE_TYPES.old", "beginning": 47 }
}

VERMINE.SkillLevels = {
  0: { "label": "SKILL_LEVELS.incompetent", "dicePool": 0, "reroll": 0 },
  1: { "label": "SKILL_LEVELS.beginner", "dicePool": 1, "reroll": 0 },
  2: { "label": "SKILL_LEVELS.proficient", "dicePool": 1, "reroll": 1 },
  3: { "label": "SKILL_LEVELS.expert", "dicePool": 2, "reroll": 1 },
  4: { "label": "SKILL_LEVELS.master", "dicePool": 2, "reroll": 2 },
  5: { "label": "SKILL_LEVELS.legend", "dicePool": 3, "reroll": 2 }
}

VERMINE.DifficultyLevels = {
  1: { "label": "DIFFICULTY_LEVELS.obvious", "difficulty": 3 },
  2: { "label": "DIFFICULTY_LEVELS.easy", "difficulty": 5 },
  3: { "label": "DIFFICULTY_LEVELS.hard", "difficulty": 7 },
  4: { "label": "DIFFICULTY_LEVELS.very_hard", "difficulty": 9 },
  5: { "label": "DIFFICULTY_LEVELS.impossible", "difficulty": 10 }
},

  VERMINE.ThreatLevels = {
    1: { "label": "THREAT_LEVELS.minor", "attack": 3, "vigor": 1, "minorWound": 1, "majorWound": 1, "deadlyWound": 1 },
    2: { "label": "THREAT_LEVELS.serious", "attack": 4, "vigor": 2, "minorWound": 2, "majorWound": 1, "deadlyWound": 1 },
    3: { "label": "THREAT_LEVELS.major", "attack": 5, "vigor": 3, "minorWound": 2, "majorWound": 1, "deadlyWound": 1 },
    4: { "label": "THREAT_LEVELS.deadly", "attack": 6, "vigor": 4, "minorWound": 2, "majorWound": 2, "deadlyWound": 2 },
  }

VERMINE.ExperienceLevels = {
  1: { "label": "SKILL_LEVELS.beginner", "action": 3, "specialties": 4, "rerolls": 0, "contact": "7" },
  2: { "label": "SKILL_LEVELS.proficient", "action": 3, "specialties": 5, "rerolls": 0, "contact": "5 ou 7" },
  3: { "label": "SKILL_LEVELS.expert", "action": 4, "specialties": 6, "rerolls": 1, "contact": "5,7 ou 9" },
  4: { "label": "SKILL_LEVELS.master", "action": 4, "specialties": 6, "rerolls": 2, "contact": "3,5,7 ou 9" },
}

VERMINE.RoleLevels = {
  1: { "label": "ROLE_LEVELS.minor", "reaction": 3, "reaction_bonus": 0, "pools": 0, "gear": 9, "gear_hindrance": 0, "protection": 1 },
  2: { "label": "ROLE_LEVELS.secondary", "reaction": 3, "reaction_bonus": 1, "pools": 1, "gear": 9, "gear_hindrance": 1, "protection": 2 },
  3: { "label": "ROLE_LEVELS.important", "reaction": 3, "reaction_bonus": 2, "pools": 2, "gear": 9, "gear_hindrance": 2, "protection": 3 },
  4: { "label": "ROLE_LEVELS.major", "reaction": 4, "reaction_bonus": 2, "pools": 4, "gear": 10, "gear_hindrance": 2, "protection": 3 },
}

VERMINE.PatternLevels = {
  1: { "label": "PATTERN_LEVELS.insect", "attack": 2, "damage": 0, "minorWound": 0, "majorWound": 0, "deadlyWound": 1 },
  2: { "label": "PATTERN_LEVELS.rat", "attack": 3, "damage": 1, "minorWound": 0, "majorWound": 1, "deadlyWound": 1 },
  3: { "label": "PATTERN_LEVELS.dog", "attack": 4, "damage": 3, "minorWound": 1, "majorWound": 1, "deadlyWound": 1 },
  4: { "label": "PATTERN_LEVELS.bear", "attack": 6, "damage": 6, "minorWound": 2, "majorWound": 2, "deadlyWound": 2 },
}

VERMINE.SizeLevels = {
  1: { "attack": 2, "vigor": 1, "minorWound": 0, "majorWound": 0, "deadlyWound": 1 },
  2: { "attack": 3, "vigor": 2, "minorWound": 0, "majorWound": 1, "deadlyWound": 1 },
  3: { "attack": 4, "vigor": 3, "minorWound": 1, "majorWound": 1, "deadlyWound": 1 }
}

VERMINE.PackLevels = {
  1: { "attack": 1, "damage": 1, "minorWound": 0, "majorWound": 0, "deadlyWound": 1 },
  2: { "attack": 2, "damage": 2, "minorWound": 2, "majorWound": 2, "deadlyWound": 2 },
  3: { "attack": 5, "damage": 5, "minorWound": 3, "majorWound": 3, "deadlyWound": 3 }
}

VERMINE.abilityCategories = {
  "physical": {
    "label": "VERMINE.ability_category.physical"
  },
  "manual": {
    "label": "VERMINE.ability_category.manual"
  },
  "mental": {
    "label": "VERMINE.ability_category.mental"
  },
  "social": {
    "label": "VERMINE.ability_category.social"
  }
}

VERMINE.abilities = {
  "vigor": "ABILITIES.vigor.name",
  "health": "ABILITIES.health.name",
  "precision": "ABILITIES.precision.name",
  "reflexes": "ABILITIES.reflexes.name",
  "knowledge": "ABILITIES.knowledge.name",
  "perception": "ABILITIES.perception.name",
  "will": "ABILITIES.will.name",
  "empathy": "ABILITIES.empathy.name"
}

VERMINE.skillCategories = {
  "man": {
    "label": "VERMINE.skill_category.man"
  },
  "animal": {
    "label": "VERMINE.skill_category.animal"
  },
  "tool": {
    "label": "VERMINE.skill_category.tool"
  },
  "weapon": {
    "label": "VERMINE.skill_category.weapon"
  },
  "survival": {
    "label": "VERMINE.skill_category.survival"
  },
  "world": {
    "label": "VERMINE.skill_category.world"
  }
}

VERMINE.sexes = { "male": "VERMINE.sexes.male", "female": "VERMINE.sexes.female" };

VERMINE.totems = {
  "human": "TOTEMS.human.name",
  "predator": "TOTEMS.predator.name",
  "scavenger": "TOTEMS.scavenger.name",
  "symbiote": "TOTEMS.symbiote.name",
  "parasite": "TOTEMS.parasite.name",
  "builder": "TOTEMS.builder.name",
  "horde": "TOTEMS.horde.name",
  "hive": "TOTEMS.hive.name",
  "loner": "TOTEMS.loner.name",
  "adapted": "TOTEMS.adapted.name"
}
VERMINE.totem_opposites = {
  "human": "TOTEMS.adapted.name",
  "predator": "TOTEMS.scavenger.name",
  "scavenger": "TOTEMS.predator.name",
  "symbiote": "TOTEMS.parasite.name",
  "parasite": "TOTEMS.symbiote.name",
  "builder": "TOTEMS.horde.name",
  "horde": "TOTEMS.builder.name",
  "hive": "TOTEMS.loner.name",
  "loner": "TOTEMS.hive.name",
  "adapted": "TOTEMS.human.name"
}

VERMINE.origins = {
  "aon": "Aon",
  "avhorae": "Avhorae",
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
VERMINE.traits = {
  "bien_conçu": {
    name: "bien conçu",
    description: "+1 Réussite automatique sur les jets de réparation. + 1 point de Fiabilité sur les jets de réparation de fortune.+ 1 Réussite automatique sur les jets de sabotage.",
    value: 0
  },
  "cassant": {
    name: "cassant",
    description: "Toutes les pertes de Fiabilité subies sont majorées de 1 point.",
    value: 0 // = la valeur "n" dans le tableau page 51 livre règles. 0 si pas de valeur
  },
  "coque": {
    name: "coque",
    description: "Ignore les (n) premiers Dommages. Quand (n) est atteint, l’objet perd ce Trait.",
    value: 1
  },
  "duree": {
    name: "Durée",
    description: "Les effets de l’arme ou de l’objet durent (n) Tours de combat.Les durées en minutes, en heures ou en jours sont toujours indiquées de façon claire, notamment dans le cas des maladies ou des empoisonnements.",
    value: 1
  },
  "etanche": {
    name: "Étanche.",
    description: "Tant que sa Fiabilité est à son maximum, l’objet ignore les Dommages dus à l’immersion prolongée.De plus, les vêtements et protections Étanches permettent d’éviter les effets de Zone liés aux gaz, et font baisser d’un cran le niveau d’exposition à une maladie(jusqu’à éventuellement éviter de lancer les Dés de Santé) – voir « Maladies et infections », page 105.",
    value: 0
  },
  "fetiche": {
    name: "Fétiche",
    description: "Le personnage possède un objet fétiche auquel il tient.Tant qu’il le possède, sa Réserve d’Effort ou de Sang- Froid est augmentée de 1D, et il ne subit pas les Malus d’Épuisement liés à la valeur de ses Réserves, même si elles sont réduites à 0. Si le personnage perd ou est privé de cet objet,   les règles d’Épuisement s’appliquent de nouveau et il perd immédiatement 2D dans chacune de ses Réserves, dont les valeurs maximales sont réduites de 1D.Un même personnage ne peut posséder qu’un seul objet avec le Trait Fétiche.",
    value: 0
  },
  "incapacitant": {
    name: "Incapacitant",
    description: "Ignore les (n) premiers Dommages. Quand (n) est atteint, l’objet perd ce Trait.",
    value: 1
  },
  "intimidant": {
    name: "Intimidant",
    description: "Tant que le personnage utilise cet objet, il bénéficie d’une Relance de 1D sur ses jets visant à effrayer, impressionner ou menacer. Il subit cependant un Malus de 1D à toutes ses Actions avec Psychologie.Le meneur peut décider qu’une créature est trop bête ou trop confiante pour se laisser intimider.De plus si votre personnage brandit un objet Intimidant mais démontre rapidement qu’il ne sait pas s’en servir, le meneur peut le priver de sa Relance.",
    value: 0
  },
  "lourd": {
    name: "Lourd",
    description: "L’objet est particulièrement lourd et demande une Vigueur minimum de(n) D pour être porté, manié ou utilisé correctement.Si la Vigueur du personnage est inférieure à(n), il subit un Malus de 1D. S’il porte plusieurs objets Lourds, comme une arme Lourde et une Protection blindée, les Malus éventuels se cumulent.",
    value: 1
  },
  "malus": {
    name: "Malus",
    description: "L’arme ou l’objet inflige un Malus de(n) D à toutes les actions des personnages affectés pendant toute la Durée de l’effet.C’est le cas notamment de certains gaz, venins, poisons ou maladies.",
    value: 1
  },
  "maniable": {
    name: "Maniable.",
    description: "L’objet n’inflige pas de Handicap de Mobilité à son porteur – voir « Handicap de Mobilité », page 70. Un objet peut être Maniable et Lourd(n).",
    value: 0
  },
  "ponctuel": {
    name: "Ponctuel",
    description: "Cet objet contient un certain nombre d’ingrédients, charges, batteries ou petites composantes qui peuvent être utilisés pour réduire les Handicaps infligés sur une action où ils peuvent être utiles.Pour chaque degré de Handicap que le joueur souhaite annuler, la valeur du Trait est réduite de 1. Quand cette valeur tombe à 0, l’objet perd définitivement ce Trait.",
    value: 1
  },
  "portee": {
    name: "Portée",
    description: "L’objet a une portée utile ou maximale de(n) mètres.Les armes de distance disposent de plusieurs Portées, qui peuvent être fixes ou modifiées par la Vigueur de l’attaquant, notamment pour les armes de tir ou de lancer.",
    value: 1
  },
  "pratique": {
    name: "Pratique",
    description: "Le matériel offre une prise en main exceptionnelle, une maniabilité étonnante, une simplicité d’usage remarquable.Utiliser un tel matériel pour une action adéquate accorde un Bonus de 2D au lieu de 1D.Rechercher ce Trait sur un matériel compte comme deux critères de Rareté à lui seul.De plus les réparations, améliorations et fabrications de matériel avec ce Trait souffrent de(I) Handicap en plus de ceux applicables normalement.",
    value: 0
  },
  "rapide": {
    name: "Rapide",
    description: "L’objet est particulièrement léger et permet de porter plusieurs attaques consécutives, au contact ou à distance.Ces(n) coups ou projectiles sont gérés par un seul jet d’attaque et imposent (n) Handicaps au défenseur.",
    value: 1
  },
  "rafale": {
    name: "Rafale",
    description: "Certaines armes à feu automatiques permettent de tirer en rafales.Le tireur n’effectue qu’un seul jet contre une Difficulté augmentée de 2, mais gagne(n) Réussites supplémentaires si son jet est réussi.",
    value: 1
  },
  "zone": {
    name: "Zone",
    description: "L’arme ou l’objet déclenche ses effets dans une zone de(n) mètres de diamètre.Si l’objet inflige des Dommages, tout ce qui se trouve dans la zone les subit.",
    value: 1
  },
  // etc...etc...
}
VERMINE.damageTypes = [
  "choc",
  "lame",
  "feu",
  "balle"
];

