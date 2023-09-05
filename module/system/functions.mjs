import { VERMINE } from './config.mjs'

/**
 * renvoie le score d'une compétence d'un actor existant
 * @param {VermineActor} 
 * @return {number||null}                   Data for rendering or null
 */
export function getActorSkillScore(actor, skillLabel, property = "value") {
  let returnedValue = null;

  for(let i in actor.system.skills){
    for(let j in actor.system.skills[i].data){
      if (actor.system.skills[i].data[j].label == skillLabel){
        returnedValue = actor.system.skills[i].data[j][property];  
      }
    }
  }
  
  return returnedValue;
}

/**
 * met à jour le score d'une compétence d'un actor existant
 * @param {VermineActor} 
 * @return {boolean}                   bool 
 */
export function updateActorSkillScore(selectedActor, skillLabel, property = "value", updatedValue) {
  try {
    let updated = false; 
    // on recherche le label parmi les compétences
    for (let st in selectedActor.system.skills){
      for (let s in selectedActor.system.skills[st].data){
        if (selectedActor.system.skills[st].data[s].label == skillLabel){
          selectedActor.system.skills[st].data[s][property] = updatedValue; // printing the new value
          const systemSkillKey = `system.skills.${st}.data.${s}.${property}`;
          selectedActor.update({[systemSkillKey]:updatedValue }); // updating actor's data
          updated = true;
        }
      }
    }

    return updated;
  } catch(e){
    return false;
  }
}

