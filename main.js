const result = document.querySelector("#result");
const wordDisplayed = document.querySelector("#word");
const errorDiv = document.querySelector("#error")
const errorHeading = document.querySelector("#error-heading");
const phoneticsTextDisplayed = document.querySelector("#phoneticsText");
const audioButton = document.querySelector("#audio-button");
const definitionsList = document.querySelector("#definitions");
const originDisplayed = document.querySelector("#origin");
const inputField = document.querySelector("#word-input-field");
const searchButton = document.querySelector("#search-button");
const definitionsHeader = document.querySelector("#definitions-header");
const originHeader = document.querySelector("#origin-header");
const phoneticsHeader = document.querySelector("#phonetics-header");
const historyButton = document.querySelector("#history-button");
const historyList = document.querySelector("#history-list")
const wordsHistory = [];

async function getData(word) {
  await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_GB/${word}`)
    .then(async function (response) {
      let data = await response.json();
      let dataObject = data[0];
      console.log(dataObject)
      let wordObject = {
        word: dataObject.word,
        phoneticsText: dataObject.phonetics[0].text,
        phoneticsAudio: `https:${dataObject.phonetics[0].audio}`,
        meanings: dataObject.meanings,
        origin: dataObject.origin,
      };
      wordsHistory.push(wordObject.word)
      displayResult(wordObject);
    })
    .catch(function (err) {
      console.log(err)
      displayError();
    });
}

function displayResult(obj) {
  wordDisplayed.innerText = obj.word[0].toUpperCase() + obj.word.slice(1);
  phoneticsTextDisplayed.innerText = ` ∙ ${obj.phoneticsText} ∙ `;
  let audioObject = new Audio(obj.phoneticsAudio);
  audioObject.setAttribute("controls", "true")
  audioButton.innerHTML ="";
  audioButton.appendChild(audioObject);
  definitionsHeader.innerText = "Definitions:";
  appendDefinitionToList(obj.meanings);
  originHeader.innerText = "Origin:";
  originDisplayed.innerText = obj.origin;
  errorDiv.classList.add("hidden");
  historyList.classList.add("hidden")
  result.classList.remove("hidden");
  result.classList.add("grid")
}

function displayError() {
  result.classList.add("hidden");
  result.classList.remove("grid")
  historyList.classList.add("hidden")
  errorDiv.classList.remove("hidden")
}

function appendDefinitionToList(array) {
  definitionsList.innerText = "";
  for (let i = 0; i < array.length; i++) {
    let newLi = document.createElement("li");
    newLi.innerText = array[i].definitions[0].definition;
    definitionsList.appendChild(newLi);
  }
}

function searchWord() {
  let wordToSearch = inputField.value;
  getData(wordToSearch);
  inputField.value = "";
}

function showHistory() {
  errorDiv.classList.add("hidden");
  result.classList.add("hidden");
  result.classList.remove("grid")
  for (let i = 0; i < wordsHistory.length; i++) {
    let newLi = document.createElement("li");
    newLi.innerText = wordsHistory[i];
    historyList.appendChild(newLi);
  }
  historyList.classList.remove("hidden");
}

searchButton.addEventListener("click", searchWord);
inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchWord();
  }
});

historyButton.addEventListener("click", showHistory);
