/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([


    // Actor partials.
    "systems/totem/templates/actor/parts/actor-spells.html",
    "systems/totem/templates/actor/parts/actor-features.html",
    "systems/totem/templates/actor/parts/actor-spells.html",
    "systems/totem/templates/actor/parts/actor-id.hbs",
    "systems/totem/templates/actor/parts/actor-totem.hbs",
    "systems/totem/templates/actor/parts/character-features.hbs",
    "systems/totem/templates/actor/parts/character-header.hbs",
    "systems/totem/templates/actor/parts/actor-items.html",
    "systems/totem/templates/actor/parts/actor-weapons.hbs",
    "systems/totem/templates/actor/parts/actor-defenses.hbs",
    "systems/totem/templates/actor/parts/actor-effects.html",

    // additional templates
    "systems/totem/templates/roll.hbs",
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
}