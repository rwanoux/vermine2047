export const registerSettings = function () {
    game.settings.register("vermine2047", "game-mode", {
        name: game.i18n.localize("VERMINE.WorldSettings.GameMode.Name"),
        hint: game.i18n.localize("VERMINE.WorldSettings.GameMode.Hint"),
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
        // console.log(value);
        }
    });
}  