/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([


    // Actor partials.
    "systems/vermine2047/templates/actor/parts/actor-spells.html",
    "systems/vermine2047/templates/actor/parts/actor-features.html",
    "systems/vermine2047/templates/actor/parts/actor-spells.html",
    "systems/vermine2047/templates/actor/parts/actor-id.hbs",
    "systems/vermine2047/templates/actor/parts/actor-totem.hbs",
    "systems/vermine2047/templates/actor/parts/character-features.hbs",
    "systems/vermine2047/templates/actor/parts/character-header.hbs",
    "systems/vermine2047/templates/actor/parts/actor-items.html",
    "systems/vermine2047/templates/actor/parts/actor-weapons.hbs",
    "systems/vermine2047/templates/actor/parts/actor-defenses.hbs",
    "systems/vermine2047/templates/actor/parts/actor-stories.hbs",
    "systems/vermine2047/templates/actor/parts/actor-effects.html",

    // Group partials
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

  // return skill level information
  Handlebars.registerHelper('skillLevel', function (property, level, options) {
    if (level < 1 || level > 5) 
      return "";
    let levelData = CONFIG.VERMINE.SkillLevels[level];
    return (levelData !== undefined) ? levelData[property] : "";
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
  
  Handlebars.registerHelper('getCombatTrackerColor', function (isPlayer, isNpc) {
      if (isPlayer) return "player";
      if (isNpc) return "npc";
  });
  
}