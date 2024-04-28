export const registerSettings = function () {
    game.settings.register("vermine2047", "game-mode", {
        name: game.i18n.localize("SETTINGS.world.game_mode.name"),
        hint: game.i18n.localize("SETTINGS.world.game_mode.hint"),
        scope: "system",
        config: true,
        type: String,
        choices: {
            "1": "Survie",
            "2": "Cauchemar",
            "3": "Apocalypse"
        },
        default: 'e',
        onChange: value => {
            let el = document.querySelector('.game-mode');
            el.id = 'game-mode-' + game.settings.get('vermine2047', 'game-mode')
            switch (game.settings.get('vermine2047', 'game-mode')) {
                case '1':
                    el.innerText = 'mode survie';

                    break;
                case '2':
                    el.innerText = 'mode cauchemard'
                    break;
                case '3':
                    el.innerText = 'mode apocalypse'
                    break;
            }
        }
    });

    game.settings.register("vermine2047", "first-run-tips-shown", {
        name: game.i18n.localize("SETTINGS.world.first_run.name"),
        hint: game.i18n.localize("SETTINGS.world.first_run.hint"),
        scope: "system",
        config: true,
        type: Boolean,
        default: false
    });
}  