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

import { VermineUtils } from "./system/roll.mjs";
import { VermineCombat, VermineCombatant, VermineCombatTracker } from "./system/fight.mjs";

// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates, registerHandlebarsHelpers } from "./system/handlebars-manager.mjs";
import { VERMINE } from "./system/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function () {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.vermine2047 = {
    VermineActor,
    VermineItem,
    VermineUtils,
    VermineCombat
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = VermineActor;
  CONFIG.Item.documentClass = VermineItem;

  CONFIG.ui.combat = VermineCombatTracker;
  CONFIG.Combatant.documentClass = VermineCombatant;
  CONFIG.Combat.documentClass = VermineCombat;


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
  });

  Actors.registerSheet('vermine2047', VermineGroupSheet, {
    types: ['group'],
    makeDefault: true,
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("vermine2047", VermineItemSheet, { makeDefault: true });

  registerHandlebarsHelpers(); // Register Handlebars helpers
  registerHooks(); // register Hooks
  registerSettings(); // register Vermine Settings


  //CONFIG AFTER INIT documentypes

  // Add custom constants for configuration.
  CONFIG.VERMINE = VERMINE;
  CONFIG.VERMINE.model = {
    Actor: game.system.template.Actor,
    Item: game.system.template.Item
  }

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "(@abilities.reflexes.value + @skills.alertness.value)d10cs>=@combatStatus.difficulty",
    decimals: 2
  };



  //afficher le mode de jeu
  let mode = game.settings.get('vermine2047', 'game-mode');
  if (!mode) { mode = '1'; await game.settings.set('vermine2047', 'game-mode', '1') }
  let el = document.createElement('SPAN');
  switch (mode) {
    case '1':
      el.innerText = 'mode survie';
      break;
    case '2':
      el.innerText = 'mode cauchemard';
      break;
    case '3':
      el.innerText = 'mode apocalypse';
      break;
  }
  el.classList.add('game-mode');
  el.id = 'game-mode-' + mode;
  document.querySelector('#ui-left').prepend(el);



  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();

});
