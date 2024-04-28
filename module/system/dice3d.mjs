
// Ce fichier contient des fonctions pour initialiser des dés personnalisés pour chaque utilisateur du jeu.
// Les fonctions permettent de définir des couleurs de dés réguliers, de totem humain et adaptés en fonction de la couleur de l'utilisateur.
// De plus, il y a des fonctions pour assombrir et éclaircir une couleur donnée.


export async function initUserDice(dice3d, user) {
    let baseColor = game.user.color;
    dice3d.addColorset({
        name: 'regular_' + game.user.name,
        description: "regular dice for " + game.user.name,
        category: "vermine 2047",
        foreground: '#9F8003',
        background: baseColor,
        outline: 'black',
        texture: 'none',
        material: 'plastic',
        visibility: 'visible'
    });
    dice3d.addColorset({
        name: 'human_' + game.user.name,
        description: "human totem dice for " + game.user.name,
        category: "vermine 2047",
        foreground: '#9F8003',
        background: lightenColor(baseColor, 40),
        outline: 'black',
        material: 'plastic',
        visibility: 'visible'
    });
    dice3d.addColorset({
        name: 'adapted_' + game.user.name,
        description: "adapted totem dice for " + game.user.name,
        category: "vermine 2047",
        foreground: '#9F8003',
        background: darkenColor(baseColor, 40),
        outline: 'black',
        material: 'plastic',
        visibility: 'visible'
    });

    await game.user.setFlag("world", "diceInit", true);
}

export function darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

export function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R < 0 ? 0 : R > 255 ? 255 : R) * 0x10000 + (G < 0 ? 0 : G > 255 ? 255 : G) * 0x100 + (B < 0 ? 0 : B > 255 ? 255 : B)).toString(16).slice(1);
}