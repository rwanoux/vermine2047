# Vermine 2047 System


##TODO  

### fiche de perso 

-[X] création de spécialitées depuis le (+) des compétences
-[ ] fixer les cases hexas , comprtement chelou , piste = un click à l'air d'envoyer 2 update, verifier le onChange
-[ ] dialog d'edition des min-max

### les jets de dés

- [ ] envoyer les spécialités utilisables au rollDialog
- [ ] envoyer les items utilisables au rollDialog
- [ ] gérer le fait de choisir quel totem garder : recalcul des réussites
- [X] refacto des template chat de roll
- [X] gérer les dés de totems humains et adapté : couleur différente/double succès +update actor
- [X] gérer les rerolls depuis chat(cf noc)
- [X] gérer les rerolls après le jet en fonction du score d'effort et de la carac
- [X] faire l'update l' l'actor juste après s'etre accorder des rerolls, et avoir utiliser le sang-froid
- [X] update des reserves de sang-froids lors de jets 
- [X] ajout des domaines de prédilections

### le combat
faut s'y pencher

### les items
- [ ] gérer les rolls d'items dans le chat
- [ ] repasser sur les différents itemTypes et sheets
- [ ] construire une selecteur de traits, traits= CONFIG.VEERMINE.traits
        traits:[
            key:{
                name:string,
                description:string,
                value:number
            }
        ]
- [X] ajouter des dégats sur chaques fiches item
