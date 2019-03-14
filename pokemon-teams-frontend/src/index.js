const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const obj = {
  method: "POST",
  headers:{
    'Content-Type': 'application/json',
    "Accept":'application/json'
  },
  body: null
}

function requestObj(method, body) {
  return {
    method: method,
    headers:{
      'Content-Type': 'application/json',
      "Accept":'application/json'
    },
    body: body
  }
}

function getTrainersFromApi() {
  fetch(TRAINERS_URL)
    .then(response => response.json())
    .then(function(trainersJSON) {

      trainersJSON.forEach(function(trainerObj) {
        createTrainerCard(trainerObj);
      })
    })
}

function getPokemonFromApi(trainerId) {
  obj.method = "POST"
  obj.body = JSON.stringify({trainer_id: trainerId})

  return fetch(POKEMONS_URL, obj)
    .then(response => response.json())
    .then(function (pokemonJSON) {

      if (pokemonJSON.error === undefined) {
        const ulTag = document.querySelector(`div[data-id='${trainerId}'] > ul`);
        return ulTag.innerHTML += createPkmnLiTag(pokemonJSON);
      } else {
        alert(pokemonJSON.error)
      }

    })
}

function createPkmnLiTag(pkmn) {
  return `<li>${pkmn.nickname} (${pkmn.species}) <button class="release"onclick="deletePokemon('${pkmn.id}')" data-pokemon-id="${pkmn.id}">Release</button></li>`;
}

function createTrainerCard(trainer) {
  const mainTag = document.querySelector('main');

  mainTag.innerHTML +=
    `<div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
      <button data-trainer-id="${trainer.id}" onclick="getPokemonFromApi(${trainer.id})">Add Pokemon</button>
      <ul>
      </ul>
    </div>`;

  const ulTag = document.querySelector(`div[data-id='${trainer.id}'] > ul`);
  buttonTag = document.querySelector("button");

  trainer.pokemons.forEach(function(pkmn) {
    ulTag.innerHTML += createPkmnLiTag(pkmn);
    // `<li>${pkmn.nickname} (${pkmn.species}) <button class="release" data-pokemon-id="${pkmn.id}">Release</button></li>`;
  })

}

function deletePokemon(id) {
  return fetch(POKEMONS_URL + `/${id}`,requestObj("DELETE", null))
  .then(response => response.json())
  .then(function (pkmnObj) {
    // var pkmnLI = document.querySelector(`li[data-pokemon-id='${pkmnObj.id}']`)
    document.querySelector(`button[data-pokemon-id='${pkmnObj.id}']`).parentElement.remove();
  })
}

document.addEventListener('DOMContentLoaded', function(e) {
  getTrainersFromApi();
});
