import { VERMINE } from "./config.mjs";
import { getActorSkillScore, updateActorSkillScore } from "./functions.mjs";

export class VermineFight {

  async performTest(enemyAchievement, enemyConservation, skillKey, skill, params, actor) {
    const dicePool = (params.spleen != undefined || params.purpose != undefined) ? '5' : '4';
    const r = new Roll(dicePool + `d6`);
    let diceString = '';
    let dicePoolHint = '';
    let discardedRoll = false;
    let bonus = 0;
    let bonusText = '/+';
    let currentSkillScore = skill;


    r.roll(); // dice are rolled
    if (params.usure != undefined) {
      currentSkillScore += params.usure;
      bonus += params.usure;
    }

    if (params.specialization != undefined) {
      currentSkillScore += 2;
    }

    if (params.trait != undefined) {
      currentSkillScore += params.trait;
      bonus += params.trait;
    }

    bonusText += bonus;

    let targetText = game.i18n.format('VERMINE.Selected') + ' : ' + game.i18n.format(skillKey) + " " + skill + bonusText;
    if (params.specialization != undefined) {
      targetText += " (S)";
    }
    // tri par ordre croissant
    r.terms[0].results.sort((a, b) => a.result - b.result);

    if (params.purpose != undefined) {
      discardedRoll = r.terms[0].results.shift();
      dicePoolHint = ' - ' + game.i18n.format('VERMINE.PurposeTrait');
    } else if (params.spleen != undefined) {
      discardedRoll = r.terms[0].results.pop();
      dicePoolHint = ' - ' + game.i18n.format('VERMINE.SpleenTrait');
    }
    const discardedRollText = (discardedRoll.result != undefined) ? '<div class="discarded-roll">' + discardedRoll.result + '</div>' : "";

    for (let i = 0; i < r.terms[0].results.length; i++) {
      let result = r.terms[0].results[i].result;
      diceString += '<li class="roll die d6 die-' + i + '">' + result + '</li>';
    }

    let hintText = game.i18n.format('VERMINE.ConfrontationHint');

    // Build a dynamic html using the variables from above.
    const html = `
            <div class="vermine2047 roll confrontation">
                <div class="dice-roll">
                    <div class="dice-result">
                        <div class="dice-formula">
                        ` + dicePool + `d6 ` + dicePoolHint + `
                        </div>
                        <div class="dice-tooltip expanded">
                            <section class="tooltip-part">
                                <div class="parameters">
                                  ` + targetText + `
                                </div>
                                <div class="dice flexrow flex-between items-center">
                                    <ol class="dice-rolls">` + diceString + `</ol>
                                    <div class="discards text-right">` + discardedRollText + `</div>
                                </div>
                            </section>
                        </div>` +
      `<p class="step1-text" id="step1">` + hintText + `</p>
                          <div class="row">
                              <a class="inline-block button add-to-achievement">` + game.i18n.format('VERMINE.Achievement') + `</a>
                              <a class="inline-block button add-to-conservation">` + game.i18n.format('VERMINE.Conservation') + `</a>
                              <a class="inline-block button reset"><i class="fa-solid fa-rotate-right"></i></a>
                              <a class="inline-block button resolve"><i class="fa-solid fa-check"></i></a>
                          </div>                          
                    </div>
                </div>
            </div>
        `;

    // Check if the dice3d module exists (Dice So Nice). If it does, post a roll in that and then
    // send to chat after the roll has finished. If not just send to chat.
    if (game.dice3d) {
      game.dice3d.showForRoll(r).then((displayed) => {
        this.sendToChat(html, r, actor);
      });
    } else {
      this.sendToChat(html, r, actor);
    };

    // on fait les comptes

  }

  async sendToChat(content, roll, actor) {
    let conf = {
      user: game.user._id,
      content: content,
      roll: roll,
      // sound: 'sounds/dice.wav'
    };

    if (actor)
      conf.speaker = ChatMessage.getSpeaker({ actor: actor });
    // Send's Chat Message to foundry, if items are missing they will appear as false or undefined and this not be rendered.
    ChatMessage.create(conf).then((msg) => {
      return msg;
    });
  }

  static instance = null;

  static get() {
    if (!VermineFight.instance)
      VermineFight.instance = new VermineFight();
    return VermineFight.instance;
  }


  // data injected to char data
  static previousValues = {
    dicePool: 4,
    skills: VERMINE.skillsList,
    cskills: VERMINE.cskills,
    cephalic: false,
    achievementReroll: VERMINE.achievementReroll,
    conservationReroll: VERMINE.conservationReroll
  };

  static rollerTemplate = 'systems/vermine2047/templates/fight.html';
  static CombatResultTemplate = 'systems/vermine2047/templates/fight-result.html';

  static async chatMessageHandler(message, html, data) {
    // console.log("accès au fin du fin", message._id);

    // sélection du dé actif
    html.on("click", '.confrontation .die.d6', event => {
      const diceResult = parseInt($(event.target).html(), 10);
      html.find('.confrontation .die.d6').removeClass('active');
      $(event.target).addClass('active');
    });

    // sélection des dés d'accomplissement
    html.on("click", '.confrontation .add-to-achievement', event => {
      const diceResult = parseInt(html.find('.confrontation .die.d6.active').html(), 10);
      html.find('.confrontation .die.d6.active').removeClass('min').addClass('max');
    });

    // sélection des dés de conservation
    html.on("click", '.confrontation .add-to-conservation', event => {
      const diceResult = parseInt(html.find('.confrontation .die.d6.active').html(), 10);
      html.find('.confrontation .die.d6.active').removeClass('max').addClass('min');
    });

    // reset de la sélection des pools
    html.on("click", '.confrontation .reset', event => {
      html.find('.confrontation .die.d6')
        .removeClass('max')
        .removeClass('min');
    });

    // résolution de la confrontation
    html.on("click", '.confrontation .resolve', async event => {
      let achievementDice = 0;
      let conservationDice = 0;
      let achievementBasis = 0;
      let conservationBasis = 0;
      html.find('.confrontation .die.d6.max').each(function (index) {
        achievementDice += parseInt($(this).html(), 10);
      });
      html.find('.confrontation .die.d6.min').each(function (index) {
        conservationDice += parseInt($(this).html(), 10);
      });

      // saisie des résultats  
      achievementBasis = html.find('td.achievement-result').data('achievement-basis');
      html.find('td.achievement-result').data('achievement-value', achievementDice);
      html.find('td.achievement-result').html(achievementBasis + achievementDice);

      conservationBasis = html.find('td.conservation-result').data('conservation-basis');
      html.find('td.conservation-result').data('conservation-value', conservationDice);
      html.find('td.conservation-result').html(conservationBasis + conservationDice);

      // calcul des marges
      const achievementMargin = achievementBasis + achievementDice - parseInt(html.find('td.adv-achievement-result').html(), 10);
      const conservationMargin = conservationBasis + conservationDice - parseInt(html.find('td.adv-conservation-result').html(), 10);
      html.find('td.achievement-margin').html(achievementMargin);
      html.find('td.conservation-margin').html(conservationMargin);

    });


    // fin de la résolution de la confrontation


  }

  static async chatListeners(html) {
    // supprime le masquage des résultats du dé
    html.off("click", ".dice-roll");
  }

  /**
   * main class function
   * @returns 
   */
  static async ui(externalData = {}) {
    let actor = {};

    // get the actor
    try {
      actor = game.user.character;
    } catch (e) {
      throw ("Aucun personnage défini !");
    }

    if (actor == null && externalData.speakerId != undefined && externalData.speakerId != null) {
      // on récupère le speakerId, et de là l'objet actor
      actor = game.actors.get(externalData.speakerId);
      VermineFight.previousValues['speakerName'] = actor.name;
      VermineFight.previousValues['speakerImg'] = actor.img;
    } else {
      VermineFight.previousValues['speakerName'] = "Anonyme";
    }

    // get the data
    let charData = (externalData) => {
      let o = Object.assign({ _template: VermineFight.rollerTemplate }, { ...VermineFight.previousValues, ...externalData });
      return o;
    };
    let data = charData(externalData);
    console.log(data);

    // render template    
    let html = await renderTemplate(data._template, data);

    let ui = new Dialog({
      title: game.i18n.localize("VERMINE.FightTool"),
      content: html,
      buttons: {
        roll: {
          label: game.i18n.localize('VERMINE.Roll4Fight'),
          callback: (html) => {
            let form = html.find('#dice-pool-form');
            if (!form[0].checkValidity()) {
              throw "Invalid Data";
            }
            let enemyAchievement, enemyConservation, skillKey, skill = 5, enemySkill, params = {};
            form.serializeArray().forEach(e => {
              switch (e.name) {
                case "skill":
                case "cephalic":
                  if (e.value !== '') {
                    skillKey = e.value;
                  }
                  break;
                case "skill-score":
                  skill = +e.value;
                  break;
                case "specialization":
                  params.specialization = true;
                  break;
                case "usure":
                  params.usure = +e.value;
                  break;
                case "trait":
                  params.trait = +e.value;
                  break;
                case "purpose":
                  params.purpose = true;
                  break;
                case "spleen":
                  params.spleen = true;
                  break;
                case "adv-skill":
                  enemySkill = +e.value;
                  break;
                case "achievement":
                  enemyAchievement = +e.value;
                  break;
                case "conservation":
                  enemyConservation = +e.value;
                  break;
              }
            });
            // prise en compte de l'usure sur la feuille de perso
            if (params.usure != undefined) {
              const newSpentScore = getActorSkillScore(actor, skillKey, 'spent') + params.usure;
              console.log(newSpentScore);
              updateActorSkillScore(actor, skillKey, 'spent', newSpentScore);
            }

            return VermineFight.get().performTest(enemyAchievement + enemySkill, enemyConservation + enemySkill, skillKey, skill, params, actor);
          }
        },
        cancel: {
          label: game.i18n.localize('Close'),
          callback: () => { }
        }
      },
      render: function (h) {
        h.on("change", 'select[name="skill"]', event => {
          const skillLabel = $(event.target).val();
          const currentSkillScore = getActorSkillScore(actor, skillLabel) - getActorSkillScore(actor, skillLabel, 'spent');
          if (parseInt(currentSkillScore, 10) >= 0) {
            h.find('input#skillScore').val(currentSkillScore);
          }
        });
      }
    }, { width: 601, height: 'fit-content' });
    ui.render(true);
    return ui;
  }
}

export class VermineCombat extends Combat {
  _encounterCheck() {
    console.log('encounter combat object', this);
  }

  async rollInitiative(ids, formula = undefined, messageOptions = {}) {
    // console.log(`${game.system.title} | Combat.rollInitiative()`, ids, formula, messageOptions);
    // Structure input data
    ids = typeof ids === "string" ? [ids] : ids;

    // étape 1 : on vérifie que le combattant est un pj
    /*if (ids.length == 1){
      console.log("il n'y a qu'un actor en lice");
    } else {
      console.log("il faut prendre le premier pj pour lancer la confrontation");
    }*/
    const combatant = this.combatants.get(ids[0]);
    let token = canvas.scene.tokens.get(combatant.tokenId);
    combatant.type = game.actors.get(combatant.actorId)?.type;
    combatant.disposition = token.disposition;
    let enemies = [];

    let adversaries = this.combatants.filter((cbt) => {
      let token = canvas.scene.tokens.get(cbt.tokenId);
      let enemy = token.actor;
      const isEnemy = (token.disposition == -1) ? true : false;
      if (isEnemy) {
        enemies.push({
          id: enemy.id,
          name: enemy.name,
          img: enemy.img,
          achievement: parseInt(enemy.system.reroll.achievement.value) + 7,
          conservation: 7 - parseInt(enemy.system.reroll.conservation.value)
        })
      }
      return isEnemy;
    });

    let allies = this.combatants.filter((cbt) => {
      let token = canvas.scene.tokens.get(cbt.tokenId);
      return (token.disposition == 1 && cbt.id != combatant.id) ? true : false;
    });

    if (combatant.type != 'character') {
      let warningDialogHTML = await renderTemplate('systems/vermine2047/templates/dialogs/warning.html', {
        warningText: "Seuls les PJs peuvent initier des confrontations. Relancer l'opération au tour du PJ actif."
      });
      Dialog.prompt({
        title: "Avertissement",
        content: warningDialogHTML,
        label: 'Okay !',
        callback: () => {
          // console.log('Il a compris');
        },
      });
    } else {
      // étape 2 : on envoie les infos
      let fightingActor = game.actors.get(combatant.actorId);
      VermineFight.ui({
        speakerId: combatant.actorId,
        speakerWeapons: fightingActor.items.filter(item => item.type == 'weapon'),
        speakerExperience: fightingActor.system.attributes.experience.value,
        speakerEffects: token.actor.effects,
        adversaries: enemies,
        allies: allies
      });
    }

  }

  nextRound() {
    /*let combatants = this.combatants.contents
    for (let c of combatants) {
      let actor = game.actors.get( c.actorId )
      actor.clearRoundModifiers()
    }*/
    super.nextRound();
  }

  /************************************************************************************/
  startCombat() {
    /*let combatants = this.combatants.contents
    for (let c of combatants) {
      let actor = game.actors.get( c.actorId )
      actor.storeVitaliteCombat()
    }*/

    return super.startCombat();
  }

  /************************************************************************************/
  _onDelete() {
    /*let combatants = this.combatants.contents
    for (let c of combatants) {
      let actor = game.actors.get(c.actorId)
      actor.clearInitiative()
      actor.displayRecuperation()
    }
    super._onDelete()*/
  }
}

export class VermineCombatTracker extends CombatTracker {

  get template() {
    return "systems/vermine2047/templates/combat-tracker.hbs";
  }

  async getData(options) {
    const context = await super.getData(options);

    if (!context.hasCombat) {
      return context;
    }

    for (let [i, combatant] of context.combat.turns.entries()) {
      context.turns[i].hasActed = combatant.getFlag("world", "hasActed");
      context.turns[i].isPlayer = combatant.actor.type == "player";
      context.turns[i].isNpc = combatant.actor.type == "npc";
    }
    return context;
  }

  /* -------------------------------------------- */
  get template() {
    return "systems/vermine2047/templates/combat-tracker.hbs";
  }

  async getData(options) {
    const context = await super.getData(options);

    if (!context.hasCombat) {
      return context;
    }

    for (let [i, combatant] of context.combat.turns.entries()) {
      context.turns[i].attitude = combatant.getFlag("world", "attitude");
      context.turns[i].isPlayer = combatant.actor.type == "character";
      context.turns[i].isNpc = combatant.actor.type == "npc";
      context.turns[i].isCreature = combatant.actor.type == "creature";
    }
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find("[data-attitude]").click(this._setStatut.bind(this));
  }

  /**
   * @description Use to put an attitude to an actor
   * @param {*} event 
   */
  async _setStatut(event) {
    event.preventDefault();
    event.stopPropagation();
    const btn = event.currentTarget;
    const attitude = btn.dataset.attitude;
    const li = btn.closest(".combatant");
    const combat = this.viewed;
    const combatant = combat.combatants.get(li.dataset.combatantId);
    let flag = combatant.getFlag("world", "attitude");
    if (flag == attitude) {
      return await combatant.setFlag("world", "attitude", null);
    } else {
      return await combatant.setFlag("world", "attitude", attitude);
    }

  }
}