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

/**
 * renvoie le score de Sang froid (carac mental + social)
 * @param {VermineActor} 
 * @return {number||null}                   Data for rendering or null
 */
export function setCharacterSelfControl(actor) {
  let returnedValue = null;

  for(let i in actor.system.abilities){
    if (actor.system.abilities[i].category == 'mental' || actor.system.abilities[i].category == 'social'){
      returnedValue += actor.system.abilities[i].value;  
    }
  }
  /// gestion de l'age
  if (actor.system.identity.ageType == 1){
    returnedValue--;
  }
  
  actor.update({ "system.attributes.self_control.max": returnedValue });
  return returnedValue;
}

/**
 * renvoie le score d'Effort (carac physical + manual)
 * @param {VermineActor} 
 * @return {number||null}                   Data for rendering or null
 */
export function setCharacterEffort(actor) {
  let returnedValue = null;

  for(let i in actor.system.abilities){
    if (actor.system.abilities[i].category == 'physical' || actor.system.abilities[i].category == 'manual'){
      returnedValue += actor.system.abilities[i].value;  
    }
  }

  /// gestion de l'age
  if (actor.system.identity.ageType == 1){
    returnedValue--;
  } else if (actor.system.identity.ageType == 3){
    returnedValue -= 2;
  }

  actor.update({ "system.attributes.effort.max": returnedValue });
  
  return returnedValue;
}


/**
 * définis les scores de seuil
 * @param {VermineActor} 
 * @return {number||null}                   Data for rendering or null
 */
export function setCharacterThresholds(actor) {

  const health = actor.system.abilities.health.value;

  let returnedValue = null;

  actor.update({ "system.minorWound.threshold": health });
  actor.update({ "system.majorWound.threshold": health + 3});
  actor.update({ "system.deadlyWound.threshold": (health + 7 < 11) ? health + 7 : 10 });

  let lightWounds = 4;
  let heavyWounds = 3;
  let deadlyWounds = 2;

  if (actor.system.identity.ageType == 3){
    lightWounds--;
    heavyWounds--;
    deadlyWounds--;
  } else if (actor.system.identity.ageType == 1){
    deadlyWounds--;
  }

  actor.update({ "system.minorWound.max": lightWounds });
  actor.update({ "system.majorWound.max": heavyWounds });
  actor.update({ "system.deadlyWound.max": deadlyWounds });

  // console.log('wounds', actor.system.minorWound, actor.system.majorWound, actor.system.deadlyWound);
  
  return returnedValue;
}
