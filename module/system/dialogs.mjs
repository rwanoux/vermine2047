
export class CombatResultDialog extends Dialog {

  constructor(dialogData, options) {
    /*let options = { classes: ["combat", "result"], ...options };
    let conf = {
      title: "Résultat de la confrontation",
      content: dialogData.content      
    };
    super(conf, options);
    this.dialogData = dialogData;*/
  }

  /* -------------------------------------------- */
  activateListeners(html) {
    /*super.activateListeners(html);
    this.html = html;
    this.setEphemere(this.dialogData.signe.system.ephemere);
    html.find(".signe-aleatoire").click(event => this.setSigneAleatoire());
    html.find("[name='signe.system.ephemere']").change((event) => this.setEphemere(event.currentTarget.checked));
    html.find(".signe-xp-sort").change((event) => this.onValeurXpSort(event));
    html.find("input.select-actor").change((event) => this.onSelectActor(event));
    html.find("input.select-tmr").change((event) => this.onSelectTmr(event));*/
  }


  async onSelectActor(event) {
    /*const actorId = this.html.find(event.currentTarget)?.data("actor-id");
    const actor = this.dialogData.actors.find(it => it.id == actorId);
    if (actor) {
      actor.selected = event.currentTarget.checked;
    }*/
  }


}

export const getRollBox = async function (data) {
  let html = await renderTemplate('systems/vermine2047/templates/roll.hbs', data);
  let dial = new Dialog({
    title: game.i18n.localize("ROLLS.tool"),
    content: html,
    buttons: {
      roll: {
        label: game.i18n.localize('ROLLS.roll_dice'),
        callback: (html) => {
          let form = html.find('#dice-pool-form');
          if (!form[0].checkValidity()) {
            throw "Invalid Data";
          }
          let formData = {};
          form.serializeArray().map(item => {
            formData[item.name] = item.value;
          });
          // console.log("roll form data", formData);
          let NoD = parseInt(formData.abilityScore, 10);
          let Reroll = 0;
          // difficulty
          data.difficulty = (formData.difficulty != undefined) ? formData.difficulty : 7;
          // maîtrise bonus
          if (formData.rollType == 'skill') {
            NoD += CONFIG.VERMINE.SkillLevels[formData.skillScore].dicePool || 0;
            Reroll += CONFIG.VERMINE.SkillLevels[formData.skillScore].reroll || 0;
          }
          console.log('reroll', Reroll);

          // réserves
          if (formData.self_control > 0) {
            NoD += parseInt(formData.self_control, 10);
          }
          if (formData.group > 0) {
            NoD += parseInt(formData.group, 10);
          }
          // checks
          if (formData.usingSpecialization !== undefined && formData.usingSpecialization == 1) {
            NoD += 1;
          }
          if (formData.usingTools !== undefined && formData.usingTools == 1) {
            NoD += 1;
          }
          if (formData.helped !== undefined && formData.helped == 1) {
            NoD += 1;
          }
          if (formData.abilityScore == 0 || !formData.abilityScore) {
            ui.notifications.notify(`veuillez saisir une caractéristique`);
          } else return game.vermine2047.VermineRoll.roll(data.actorId, data.label, NoD, Reroll, data);
        }
      },
      close: {
        label: game.i18n.localize('Close'),
        callback: () => { }
      }
    },
    render: function (h) {
      if (h.find('input[name="abilityScore"]').val() == 0 && data.rollType == 'ability') {
        h.find('input[name="abilityScore"]').val(data.abilities[data.label].value);
      }

      h.find('select[name="ability"]').change((event) => {
        if (event.target.value != undefined) {
          const abilityScore = data.abilities[event.target.value].value;
          console.log('ability', abilityScore);
          // on enregistre la valeur de la caractéristique
          h.find('input[name="abilityScore"]').val(abilityScore);
        }
      });

      h.find('select[name="skill"]').change((event) => {
        if (data.rollType == 'skill' && event.target.value != undefined) {
          const skillScore = data.skills[event.target.value].value;
          // on enregistre la valeur de la compétence
          h.find('input[name="skillScore"]').val(skillScore);
          // on met à jour les infos de niveaux de compétence
          const skillLevel = CONFIG.VERMINE.SkillLevels[skillScore];
          if (skillLevel != undefined) {
            h.find('#skillLevel').text(game.i18n.localize(skillLevel.label));
            h.find('#skillDicePool').text(skillLevel.dicePool);
            h.find('#skillReroll').text(skillLevel.reroll);
          } else {
            h.find('#skillLevel').text('Inconnu');
            h.find('#skillDicePool').text(0);
            h.find('#skillReroll').text(0);
          }
        }
      });
    }
  });
  dial.render(true);
}  