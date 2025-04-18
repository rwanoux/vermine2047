import RollDialog from "./dialogs/rollDialog.mjs";
import { initUserDice } from "./dice3d.mjs";
import { DiceSystem } from '../../../../modules/dice-so-nice/api.js';
import { VermineUtils } from "./roll.mjs";
import { registerTours } from "./tour.mjs";

export const registerHooks = function () {
    /**
     * Ready hook loads tables, and override's foundry's entity link functions to provide extension to pseudo entities
     */
    CONFIG.debug.hooks = true;
    Hooks.once('diceSoNiceReady', async (dice3d) => {
        const vermineSystem = new DiceSystem('Vermine2047', 'Vermine 2047', "preferred", 'totem')
        dice3d.addSystem(vermineSystem);

        game.users.forEach(user => {
            initUserDice(dice3d, user)
        });

        dice3d.addDicePreset({
            type: "d10",
            labels: [
                "systems/vermine2047/assets/images/die/d10-1.webp",
                "systems/vermine2047/assets/images/die/d10-2.webp",
                "systems/vermine2047/assets/images/die/d10-3.webp",
                "systems/vermine2047/assets/images/die/d10-4.webp",
                "systems/vermine2047/assets/images/die/d10-5.webp",
                "systems/vermine2047/assets/images/die/d10-6.webp",
                "systems/vermine2047/assets/images/die/d10-7.webp",
                "systems/vermine2047/assets/images/die/d10-8.webp",
                "systems/vermine2047/assets/images/die/d10-9.webp",
                "systems/vermine2047/assets/images/die/d10-0.webp",
            ],

            system: "Vermine2047",

        });

    });

    Hooks.on('renderChatMessage', async (message, html, data) => {
        let rerollTitle = html[0].querySelector(".reroll-fromroll h4");
        if (rerollTitle) {
            rerollTitle.addEventListener("click", () => { html[0].querySelector(".reroll").classList.toggle('visible') })
        }
        if (message.author?._id != game.user._id || !game.user.isGM) {
            // désactiver les inputs pour les joueurs non-auteurs du message
            html[0].querySelectorAll("input").forEach(inp => inp.disabled = true);
            //cacher le boutton reroll
            html[0].querySelectorAll("div.reroll-from-effort").forEach(el => el.style.display = "none")
            return
        }
        await VermineUtils.chatListenners(html)
    })


    Hooks.on('updateUser', async (user, updateData, options, id) => {
        if (game.dice3d) {
            initUserDice(game.dice3d, user)

        }
    })
    Hooks.once("ready", async () => {
        console.info("Vermine 2047 | System Initialized.");
        //await registerTours();

    });

    // changement de la pause 
    Hooks.on("renderPause", async function () {
        if ($("#pause").attr("class") !== "paused") return;
        $(".paused img").attr("src", 'systems/vermine2047/assets/images/ui/vermine_pause.webp');
        $(".paused img").css({ "opacity": 1 });
        $("#pause.paused figcaption").text("Communauté endormie...");
    });

    /**
     * Create a macro when dropping an entity on the hotbar
     * Item      - open roll dialog for item
     * Actor     - open actor sheet
     * Journal   - open journal sheet
     */
    Hooks.on("hotbarDrop", async (bar, data, slot) => {
        // console.log(data.type);
        // Create item macro if rollable item - weapon, spell, prayer, trait, or skill

        return false;
    });

    Hooks.on('getSceneControlButtons', async (controls) => {
        console.log;
        controls.find((c) => c.name === 'token').tools.push({
            name: 'Dice Roller',
            title: game.i18n.localize("VERMINE.RollTool"),
            icon: 'fas fa-dice-d10',
            button: true,
            onClick() {
                RollDialog.create().then(d => d.render(true));
            }
        });
    });

    /* -------------------------------------------- */
    /*  PreCreate Hooks                                */
    /* -------------------------------------------- */

    Hooks.on("preCreateActor", function (actor) {
        console.log('pre create actor', actor.img);
        if (actor.img == "icons/svg/mystery-man.svg") {
            actor.updateSource({ "img": `systems/vermine2047/assets/icons/actors/${actor.type}.webp` });
        }

    });

    Hooks.on("preCreateItem", function (item) {
        if (item.img == "icons/svg/item-bag.svg") {
            item.updateSource({ "img": `systems/vermine2047/assets/icons/items/${item.type}.webp` });
            // item.updateSource({"img": `systems/vermine2047/icons/competence.webp`});
        }
    });

    /* -------------------------------------------- */
    /*  Combat Hooks                                */
    /* -------------------------------------------- */

    /*
    Hooks.on("createCombatant", function (combatant) {
    if (game.user.isGM) {
        let actor = combatant.actor;
    
        console.log('create combatant', actor);
    }
    });*/

    Hooks.on("updateCombat", function () {
        if (game.user.isGM) {
            let combatant = (game.combat.combatant) ? game.combat.combatant.actor : "";

            console.log('update combat', game.combat);

            /*if (combatant.type == "marker" && combatant.system.settings.general.isCounter == true) {
                let step = (!combatant.system.settings.general.counting) ? -1 : combatant.system.settings.general.counting;
                let newQuantity = combatant.system.pools.quantity.value + step;
                combatant.update({"system.pools.quantity.value": newQuantity});
            }*/
        }
    });
    Hooks.on("createActor", function (actor, options, id) {
        actor.setFlag("world", "editMode", true)
    })
}