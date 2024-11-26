export class VermineUtils {
  /**
   * Méthode pour effectuer un jet de dés avec différentes options
   * @param {Object} options - Les options du jet de dés
   * @returns {Roll} - Le résultat du jet de dés
   */
  static async roll({ actor, NoD, Reroll = 0, difficulty = 7, self_control = 0, rollLabel = "jet custom", totems = { human: false, adapted: false }, max_effort = 0 }) {
    // Déclaration des variables
    let formula = "";
    let modFormula = null;

    // Vérification des totems humains
    if (totems.human) {
      NoD--;
      modFormula = "(1D10cs>=" + difficulty + `[human_${game.user.name}]*2)`;

    }
    // Vérification des totems adaptés
    if (totems.adapted) {
      NoD--;
      // Construction de la formule modifiée
      if (modFormula != null) {
        modFormula = modFormula + "+(1D10cs>=" + difficulty + `[adapted_${game.user.name}]*2)`;
      } else {
        modFormula = "(1D10cs>=" + difficulty + `[adapted_${game.user.name}]*2)`;
      }

    };

    // Construction de la formule de base
    let baseFormula = '' + NoD + "d10";
    baseFormula += (difficulty != undefined) ? "cs>=" + difficulty : "cs>=7";
    baseFormula += `[regular_${game.user.name}]`

    // Construction de la formule finale
    if (modFormula != null) {
      formula = baseFormula + "+" + modFormula;
    } else { formula = baseFormula }

    // Création du jet de dés
    let roll = new Roll(formula, actor.getRollData());
    //effectuer le lancé
    await roll.evaluate();
    //afficher le lancer 3d
    await VermineUtils.showDiceSoNice(roll);
    // afficher le résultat dans le chat
    VermineUtils.diplayChatRoll(roll, ...arguments);
    return roll;
  }

  /**
   * Méthode pour gérer les événements de relance de dés
   * @param {Object} message - Le message contenant l'événement de relance
   * @param {Object} ev - L'événement de relance
   */
  static async onReroll(message, ev) {
    // Vérification de l'utilisateur
    if (game.user._id != message.user._id || !game.user.isGM) {
      ui.notifications.warn('vous ne pouvez pas relancer un dés sur ce jet')
      return false
    }

    // Récupération du nombre de relances autorisé
    let rerollCount = ev.currentTarget.closest('div.vermine-roll-message').querySelector('#allowed_reroll')?.innerText;
    // Vérification du nombre de relances restantes
    if (!rerollCount || parseInt(rerollCount) < 1) {
      console.log('no reroll')
      ui.notifications.warn("plus de relance possible");
      let rerollables = ev.currentTarget.closest('ul').querySelectorAll('.rerollable');
      rerollables.forEach(el => el.classList.remove('rerollable'));

      // Mise à jour du nombre de relances restantes
      ev.currentTarget.closest('div.vermine-roll-message').querySelector('#allowed_reroll').innerText = rerollCount - 1;

      let content = ev.currentTarget.closest('div.message-content').outerHTML;

      await message.update({
        content: content
      })
      return false
    }
    ev.currentTarget.classList.add('rerolled');

    // Mise en place de la relance
    await message.setFlag("world", "reroll", true);

    // Récupération de la difficulté et du type de dé
    let difficulty = ev.currentTarget.closest('ul').dataset.difficulty;
    let diceType = ev.currentTarget.dataset.diceType;

    // Mise à jour du nombre de relances restantes
    ev.currentTarget.closest('div.vermine-roll-message').querySelector('#allowed_reroll').innerText = rerollCount - 1;

    // Construction de la formule de relance
    let formula = `1d10cs>=${difficulty}`;
    console.log(diceType)
    switch (diceType.trim()) {
      case 'human':
        formula = `(1d10cs>=${difficulty}[human_${game.user.name}])*2`
        break;
      case 'adapted':
        formula = `(1d10cs>=${difficulty}[adapted_${game.user.name}])*2`
        break;
      default:
        formula += `[regular_${game.user.name}]`
        break;
    };

    // Création et évaluation du jet de dés de relance
    let reroll = await new Roll(formula);
    await reroll.evaluate();

    //afficher les dés 3d
    await VermineUtils.showDiceSoNice(reroll);
    // mise à jour de l'affichage du dés 
    console.log(reroll)
    let result = reroll.dice[0].results[0].result;
    ev.currentTarget.querySelector('span').innerText = result;
    //mise à jour du total
    let success = reroll.dice[0].results[0].success;
    if (success) {
      ev.currentTarget.classList.add('success')
      let total = parseInt(ev.currentTarget.closest('.vermine-roll-message').querySelector('#total').innerText) + reroll.total
      ev.currentTarget.closest('.vermine-roll-message').querySelector('#total').innerText = total
    }
    // Mise à jour de l'affichagedu message
    ev.currentTarget.classList.remove("rerollable")
    let content = ev.currentTarget.closest('div.message-content').outerHTML;
    console.log(reroll, message);

    await message.update({
      content: content
    })
  }

  /** 
   * Méthode pour gérer les événements de chat 
   * @param {HTMLElement} html - L'élément HTML contenant les événements de chat 
   */
  static async chatListenners(html) {
    // Récupérer le nombre de relances autorisées 
    let reroll = html.find('#allowed_reroll')[0]?.innerText;
    // Vérifier s'il n'y a pas de relances ou si le nombre est inférieur à 1 
    if (!reroll || parseInt(reroll) < 1) {
      // Désactiver les relances pour chaque dé 
      for (let die of html.find('.die')) {
        die.classList.remove("rerollable")
      };
    } else {
      // Activer les relances pour chaque dé 
      for (let die of html.find('.die')) {
        die.classList.add("rerollable")
      };
    }

    // Ajouter un événement de clic pour les dés pouvant être relancés 
    html.find('.rerollable').click(async (ev) => {
      ev.preventDefault();
      // Récupérer l'ID du message 
      let msgId = ev.currentTarget.closest("li.message").dataset.messageId;
      // Récupérer le message correspondant à l'ID 
      let message = await game.messages.get(msgId);
      // Appeler la fonction onReroll de VermineUtils 
      await VermineUtils.onReroll(message, ev);
    });

    // Mettre à jour l'étiquette en fonction de la valeur sélectionnée 
    html.find("#effort-reroll").change(ev => {
      let label = html.find("#granted-reroll")[0]
      label.innerText = ev.currentTarget.value
    });

    // Ajouter un événement de clic pour accorder une relance 
    html.find("button.grant-reroll").click(async (ev) => {
      // Mettre à jour le nombre de relances autorisées 
      html.find("#allowed_reroll")[0].innerText = html.find('#granted-reroll')[0].innerText
      let mesEl = ev.currentTarget.closest('[data-message-id]')
      let messageId = mesEl.dataset.messageId;
      // Quand relance accorder masquer la zone pour accorder les relances
      ev.currentTarget.closest('.reroll-from-effort').style.display = "none"
      let content = ev.currentTarget.closest(".vermine-roll-message").outerHTML;
      // Mettre à jour le contenu du message avec la relance accordée 
      let message = await game.messages.get(messageId);
      await message.update({ content: content });
    });
  }

  /**
   * Méthode pour afficher les résultats des dés de manière graphique
   * @param {Roll} roll - Le jet de dés à afficher
   * @param {string} rollMode - Le mode d'affichage du jet de dés
   */
  static async showDiceSoNice(roll, rollMode) {
    if (game.dice3d) {
      let whisper = null;
      let blind = false;
      rollMode = rollMode ?? game.settings.get("core", "rollMode");
      switch (rollMode) {
        case "blindroll": //GM only
          blind = true;
        case "gmroll": //GM + rolling player
          whisper = this.getUsers(user => user.isGM);
          break;
        case "roll": //everybody
          whisper = this.getUsers(user => user.active);
          break;
        case "selfroll":
          whisper = [game.user.id];
          break;
      }
      await game.dice3d.showForRoll(roll, game.user, true, whisper, blind);
    }
    else { return false }
  }

  /**
   * Méthode pour afficher un jet de dés dans le chat
   * @param {Roll} roll - Le jet de dés à afficher
   * @param {Object} param - Les paramètres du jet de dés
   * @returns {ChatMessage} - Le message affichant le jet de dés
   */
  static async diplayChatRoll(roll, param) {
    let content = await renderTemplate("systems/vermine2047/templates/roll-message.hbs", { roll, param })
    let chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: content,
      roll: roll
    };
    let msg = await ChatMessage.create(chatData);
    await msg.setFlag('world', 'roll', roll);
    return msg
  }


}



