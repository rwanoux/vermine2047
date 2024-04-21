export class VermineUtils {

  static roll(actorId, label, NoD, Reroll = 0, params = {}) {
    const actor = game.actors.get(actorId);
    let formula = '' + NoD + "d10";

    formula += (params.difficulty != undefined) ? "cs>=" + params.difficulty : "cs>=7";
    let roll = new Roll(formula, actor.getRollData());
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      flavor: label,
      rollMode: game.settings.get('core', 'rollMode'),
    });
    return roll;
  }

  /* -------------------------------------------- */
  static async showDiceSoNice(roll, rollMode) {
    if (game.modules.get("dice-so-nice")?.active) {
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
    }
  }

  /* -------------------------------------------- */
  static async chatListeners(html) {

    html.on("click", '.roll-dice-bonus', event => {
      let rollData = this.getRollDataFromMessage(event)

      let msgId = VermineRoll.findChatMessageId(event.currentTarget)
      nocUtility.removeChatMessageId(msgId)

      let nbDice = $(event.target).data('nb-dice')
      console.log(">>>>>", nbDice)
      this.rollBonus(rollData, nbDice)
    })

  }

}



