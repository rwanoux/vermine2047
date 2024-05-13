/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([


    // Actor partials.
    "systems/vermine2047/templates/actor/parts/actor-features.hbs",
    "systems/vermine2047/templates/actor/parts/actor-items.hbs",
    "systems/vermine2047/templates/actor/parts/actor-weapons.hbs",
    "systems/vermine2047/templates/actor/parts/actor-defenses.hbs",

    // Character partials.
    "systems/vermine2047/templates/actor/character/character-id.hbs",
    "systems/vermine2047/templates/actor/character/character-totem.hbs",
    "systems/vermine2047/templates/actor/character/character-features.hbs",
    "systems/vermine2047/templates/actor/character/character-header.hbs",
    "systems/vermine2047/templates/actor/character/character-stories.hbs",
    "systems/vermine2047/templates/actor/character/character-combat.hbs",


    // Group partials
    "systems/vermine2047/templates/actor/group/group-header.hbs",
    "systems/vermine2047/templates/actor/group/group-vehicles.hbs",
    "systems/vermine2047/templates/actor/group/group-info.hbs",
    "systems/vermine2047/templates/actor/group/group-items.hbs",
    "systems/vermine2047/templates/actor/group/group-experience.hbs",

    // npc partials
    "systems/vermine2047/templates/actor/npc/npc-combat.hbs",

    // creature partials
    "systems/vermine2047/templates/actor/creature/creature-combat.hbs",

    // dialog templates
    "systems/vermine2047/templates/dialogs/roll-dialog.hbs",

    //items damages
    "systems/vermine2047/templates/item/partials/damages.html",

  ]);
};


/**
 * Produce a range of numbers (positive and/or negative), processing from
 * `start` up to, but not including, `end`.
 *
 * @param {number} start Range start value (inclusive)
 * @param {number} [end] Range end value (exclusive)
 * @param {number} [step=1] Value to increment by
 * @return {number[]} Array of numbers
 */
function range(start, end, step) {
  /* jshint eqeqeq:false, maxcomplexity:7 */
  start = Number(start) || 0;
  end = end == null ? end : Number(end);
  step = step == null ? 1 : Number(step);

  if (end == null) {
    end = start;
    start = 0;
  }

  var length = Math.max(Math.ceil((end - start) / (step || 1)), 0);
  var result = new Array(length);

  for (var i = 0; i < length; i += 1) {
    result[i] = start;
    start += step;
  }

  return result;
}

export const registerHandlebarsHelpers = function () {
  Handlebars.registerHelper('concat', (...args) => args.slice(0, -1).join(''));
  Handlebars.registerHelper('lower', e => e.toLocaleLowerCase());

  Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });

  // search translation with variables
  Handlebars.registerHelper('smarttl', function (arrayLabel, objectLabel, options) {
    return game.i18n.localize(arrayLabel + "." + objectLabel + ".name");
  });

  Handlebars.registerHelper('smarttlk', function (arrayLabel, objectLabel, key) {
    return game.i18n.localize(arrayLabel + "." + objectLabel + "." + key);
  });

  Handlebars.registerHelper('smartcfg', function (configLabel, objectLabel) {
    let text = "";
    text = game.i18n.localize(CONFIG.VERMINE[configLabel][objectLabel]);
    if (text == null) {
      text = CONFIG.VERMINE[configLabel][objectLabel];
    }
    return text;

  });
  //return damge data 
  Handlebars.registerHelper('getDamagesData', function (damageObject, prop) {
    let propObject = damageObject[prop]
    let propValue = propObject[damageObject.value - 1]
    return propValue
  });
  // return threat level information
  Handlebars.registerHelper('threatLevel', function (property, level, options) {
    if (level < 1 || level > 4)
      return "";
    let levelData = CONFIG.VERMINE.ThreatLevels[level];
    if (property == 'label') {
      return (levelData !== undefined) ? game.i18n.localize(levelData[property]) : "";
    } else {
      return (levelData !== undefined) ? levelData[property] : "";
    }
  });

  // return experience level information
  Handlebars.registerHelper('experienceLevel', function (property, level, options) {
    if (level < 1 || level > 4)
      return "";
    let levelData = CONFIG.VERMINE.ExperienceLevels[level];
    if (property == 'label') {
      return (levelData !== undefined) ? game.i18n.localize(levelData[property]) : "";
    } else {
      return (levelData !== undefined) ? levelData[property] : "";
    }
  });

  // return role level information
  Handlebars.registerHelper('roleLevel', function (property, level, options) {
    if (level < 1 || level > 4)
      return "";
    let levelData = CONFIG.VERMINE.RoleLevels[level];
    if (property == 'label') {
      return (levelData !== undefined) ? game.i18n.localize(levelData[property]) : "";
    } else {
      return (levelData !== undefined) ? levelData[property] : "";
    }
  });

  // return pattern level information
  Handlebars.registerHelper('patternLevel', function (property, level, options) {
    if (level < 1 || level > 4)
      return "";
    let levelData = CONFIG.VERMINE.PatternLevels[level];
    if (property == 'label') {
      return (levelData !== undefined) ? game.i18n.localize(levelData[property]) : "";
    } else {
      return (levelData !== undefined) ? levelData[property] : "";
    }
  });

  // return size level information
  Handlebars.registerHelper('sizeLevel', function (property, level, options) {
    if (level < 1 || level > 4)
      return "";
    let levelData = CONFIG.VERMINE.SizeLevels[level];
    if (property == 'label') {
      return (levelData !== undefined) ? game.i18n.localize(levelData[property]) : "";
    } else {
      return (levelData !== undefined) ? levelData[property] : "";
    }
  });

  // return pack level information
  Handlebars.registerHelper('packLevel', function (property, level, options) {
    if (level < 0 || level > 3)
      return "";
    let levelData = CONFIG.VERMINE.PackLevels[level];
    if (property == 'label') {
      return (levelData !== undefined) ? game.i18n.localize(levelData[property]) : "";
    } else {
      return (levelData !== undefined) ? levelData[property] : "";
    }
  });


  // return skill level information
  Handlebars.registerHelper('skillLevel', function (property, level, options) {
    if (level < 1 || level > 5)
      return "";
    level = parseInt(level);
    let levelData = CONFIG.VERMINE.SkillLevels[level];
    if (property == 'label') {
      return (levelData !== undefined) ? game.i18n.localize(levelData[property]) : "";
    } else {
      return (levelData !== undefined) ? levelData[property] : "";
    }
  });

  // return diff level information
  Handlebars.registerHelper('diffLevel', function (property, level, options) {
    if (level < 1 || level > 5)
      return "";
    let levelData = CONFIG.VERMINE.DifficultyLevels[level];
    if (property == 'label') {
      return (levelData !== undefined) ? game.i18n.localize(levelData[property]) : "";
    } else {
      return (levelData !== undefined) ? levelData[property] : "";
    }

  });

  // return age type information
  Handlebars.registerHelper('ageType', function (property, level, options) {
    if (level < 1 || level > 3)
      return "";
    let ageData = CONFIG.VERMINE.AgeTypes[level];
    if (property == 'name') {
      return (ageData !== undefined) ? game.i18n.localize(ageData[property]) : "";
    } else {
      return (ageData !== undefined) ? ageData[property] : "";
    }

  });


  Handlebars.registerHelper('getCombatTrackerColor', function (isPlayer, isNpc) {
    if (isPlayer) return "player";
    if (isNpc) return "npc";
  });



  // booleans if if equal if greater etc...
  Handlebars.registerHelper('ife', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  });
  Handlebars.registerHelper('ifgt', function (a, b, options) {
    if (a > b) { return options.fn(this); }
    return options.inverse(this);
  });
  Handlebars.registerHelper('iflt', function (a, b, options) {
    if (a < b) { return options.fn(this); }
    return options.inverse(this);
  });
  Handlebars.registerHelper('ifgteq', function (a, b, options) {
    if (a >= b) { return options.fn(this); }
    return options.inverse(this);
  });
  Handlebars.registerHelper('iflteq', function (a, b, options) {
    if (a <= b) { return options.fn(this); }
    return options.inverse(this);
  });
  Handlebars.registerHelper('ifincludes', function (arg1, arg2, options) {
    return (arg1.includes(arg2)) ? options.fn(this) : options.inverse(this);
  });


  //math operations

  Handlebars.registerHelper('math_add', function (a, b, options) {
    return (parseInt(a) + parseInt(b))
  });

  Handlebars.registerHelper('math_subs', function (a, b, options) {
    return (parseInt(a) - parseInt(b))
  });

  Handlebars.registerHelper('math_mult', function (a, b, options) {
    return (parseInt(a) * parseInt(b))
  });

  Handlebars.registerHelper('math_div', function (a, b, options) {
    return (parseInt(a) / parseInt(b))
  });



  // loop with named index
  Handlebars.registerHelper('repeat', function (times, start, indexLabel, block) {
    var accum = '';
    if (!indexLabel) { indexLabel = "index" }
    if (!start) { start = 0; }
    for (var i = start; i < times + start; ++i) {
      block.data[indexLabel] = i;
      block.data.first = i === start;
      block.data.last = i === (times + start - 1);
      accum += block.fn(this);
    }
    return accum;
  });

  Handlebars.registerHelper("setVar", function (varName, varValue, options) {
    options.data.root[varName] = varValue;
  });
}