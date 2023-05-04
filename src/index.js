import './css/styles.css';
import Notiflix from 'notiflix'
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const refs = {
  DEBOUNCE_DELAY: 300,
  input: document.querySelector("#search-box"),
  countriesList: document.querySelector(".country-list"),
  countryInfo: document.querySelector(".country-info"),
}

const { DEBOUNCE_DELAY, input, countriesList, countryInfo } = refs;

input.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));
function onInput() {
  const name = input.value.trim();
  console.log(name);

  clearList();

  fetchCountries(name)
  .then((countries) => {
    if (countries.length > 10) {
        return notifyToManyMatches();
    } else if (countries.length === 1) {
        return countryInfo.insertAdjacentHTML("beforeend", createContryInfo(countries))
    } else if (name === '') {
      clearList();

      controller.abort();
    };

    countriesList.insertAdjacentHTML('beforeend', createCountriesList(countries))
  })
  .catch(onError);
}

function clearList() {
        return (countriesList.innerHTML = ''), (countryInfo.innerHTML = '');
}

function notifyToManyMatches() {
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
}

function createCountriesList(countries) {
  return markup = countries
  .map(({ name, flags }) => {
    return  `
    <li> <img src="${flags.svg}" alt="${name.official} flag" width="40">
    <span>${name.official}</span>
    </li>
    `
  }).join('');
}

function createContryInfo(countries) {
    return markup = countries.map(({ name, flags, capital, population, languages }) => {
        return `
        <img src="${flags.svg}" alt="${name.official} flag" width="64"> 
        <b class="country-name">${name.official}</b>
        <p><b>Capital: </b>${capital}</p>
        <p><b>Population: </b>${population}</p>
        <p><b>Languages: </b>${Object.values(languages)}</p>
        `
    }).join('');
}

function onError(err) {
  if (err.name === 'AbortError') {
    console.log("fetch was aborted");

    return;
  }

  Notiflix.Notify.failure('Oops, there is no country with that name');
}