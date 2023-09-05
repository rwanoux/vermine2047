/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([


    // Actor partials.
    // "systems/vermine2047/templates/actor/parts/actor-features.html",
    "systems/vermine2047/templates/actor/parts/actor-id.hbs",
    "systems/vermine2047/templates/actor/parts/actor-totem.hbs",
    "systems/vermine2047/templates/actor/parts/character-features.hbs",
    "systems/vermine2047/templates/actor/parts/character-header.hbs",
    "systems/vermine2047/templates/actor/parts/actor-items.html",
    "systems/vermine2047/templates/actor/parts/actor-weapons.hbs",
    "systems/vermine2047/templates/actor/parts/actor-defenses.hbs",
    "systems/vermine2047/templates/actor/parts/actor-stories.hbs",
    "systems/vermine2047/templates/actor/parts/actor-combat.html",

    // Group partials
    "systems/vermine2047/templates/actor/parts/group-header.hbs",
    "systems/vermine2047/templates/actor/parts/group-vehicles.hbs",
    "systems/vermine2047/templates/actor/parts/group-info.hbs",
    "systems/vermine2047/templates/actor/parts/group-items.hbs",
    "systems/vermine2047/templates/actor/parts/group-experience.hbs",

    // additional templates
    "systems/vermine2047/templates/roll.hbs",
  ]);
};


export const registerHandlebarsHelpers = function () {
  Handlebars.registerHelper('concat', (...args) => args.slice(0, -1).join(''));
  Handlebars.registerHelper('lower', e => e.toLocaleLowerCase());

  Handlebars.registerHelper('toLowerCase', function(str) {
      return str.toLowerCase();
  });

  // search translation with variables
  Handlebars.registerHelper('smarttl', function (arrayLabel,objectLabel, options) {
    return game.i18n.localize(arrayLabel +"."+objectLabel+".name");
  });

  Handlebars.registerHelper('smarttlk', function (arrayLabel,objectLabel, key) {
    return game.i18n.localize(arrayLabel +"."+objectLabel+"."+key);
  });

  Handlebars.registerHelper('smartcfg', function (configLabel, objectLabel) {
    let text = "";
    text = game.i18n.localize(CONFIG.VERMINE[configLabel][objectLabel]);
    if (text == null){
      text = CONFIG.VERMINE[configLabel][objectLabel];
    }
    return text;
    
  });

    // return threat level information
    Handlebars.registerHelper('threatLevel', function (property, level, options) {
      if (level < 1 || level > 4) 
        return "";
      let levelData = CONFIG.VERMINE.ThreatLevels[level];    
      if (property == 'label'){
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
      if (property == 'label'){
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
      if (property == 'label'){
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
      if (property == 'label'){
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
    if (property == 'label'){
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
      if (property == 'label'){
        return (levelData !== undefined) ? game.i18n.localize(levelData[property]) : "";
      } else {
        return (levelData !== undefined) ? levelData[property] : "";
      }
    });


  // return skill level information
  Handlebars.registerHelper('skillLevel', function (property, level, options) {
    if (level < 1 || level > 5) 
      return "";
    let levelData = CONFIG.VERMINE.SkillLevels[level];    
    if (property == 'label'){
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
      if (property == 'label'){
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
      if (property == 'name'){
        return (ageData !== undefined) ? game.i18n.localize(ageData[property]) : "";
      } else {
        return (ageData !== undefined) ? ageData[property] : "";
      }
      
    });
  
  
  Handlebars.registerHelper('getCombatTrackerColor', function (isPlayer, isNpc) {
      if (isPlayer) return "player";
      if (isNpc) return "npc";
  });
  
}