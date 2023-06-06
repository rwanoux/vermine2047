import { registerHooks } from "./system/hooks.mjs";
import { registerSettings } from "./system/settings.mjs";

// Import document classes.
import { VermineActor } from "./documents/actor.mjs";

import { VermineCharacterSheet } from "./sheets/character-sheet.mjs";
import { VermineNpcSheet } from "./sheets/npc-sheet.mjs";
import { VermineGroupSheet } from "./sheets/npc-group.mjs";
import { VermineCreatureSheet } from "./sheets/creature-sheet.mjs";

import { VermineItem } from "./documents/item.mjs";
import { VermineItemSheet } from "./sheets/item-sheet.mjs";

import { VermineRoll } from "./system/roll.mjs";
import { VermineCombat } from "./system/fight.mjs";

// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates, registerHandlebarsHelpers } from "./system/handlebars-manager.mjs";
import { VERMINE } from "./system/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.vermine2047 = {
    VermineActor,
    VermineItem,
    VermineRoll,
    VermineCombat
  };

  // Add custom constants for configuration.
  CONFIG.VERMINE = VERMINE;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d10 + @abilities.dex.mod",
    decimals: 2
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = VermineActor;
  CONFIG.Item.documentClass = VermineItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet('vermine2047', VermineCharacterSheet, {
      types: ['character'],
      makeDefault: true,
    });

  Actors.registerSheet('vermine2047', VermineNpcSheet, {
      types: ['npc'],
      makeDefault: true,
    });

  Actors.registerSheet('vermine2047', VermineCreatureSheet, {
    types: ['creature'],
    makeDefault: true,
  }); // Register vehicle Sheet

  Actors.registerSheet('vermine2047', VermineGroupSheet, {
    types: ['group'],
    makeDefault: true,
  }); // Register vehicle Sheet
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("vermine2047", VermineItemSheet, { makeDefault: true });

  registerHandlebarsHelpers(); // Register Handlebars helpers
  registerHooks(); // register Hooks
  registerSettings(); // register Engrenages Settings

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});
