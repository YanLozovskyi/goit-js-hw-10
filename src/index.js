import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);

function onInputChange(evt) {
  const inputValue = evt.target.value.trim();

  if (inputValue === '') {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(inputValue)
    .then(country => {
       onSuccess(country);
       console.log(country);
    })
    .catch(error => {
      onError(error);
    });
}

function onSuccess(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }
  if (countries.length === 1) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    createMarkupForOneCountry(countries);
    return;
  }
  createMarkupForManyCountries(countries);
}

function onError(error) {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  if (error.message === '404') {
    Notify.failure('Oops, there is no country with that name');
  }
  console.log(error);
}

function createMarkupForManyCountries(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li class="country-item"><img src="${flags.svg}" width="60" height= "40"></img>
          <p class="country-text">${name.official}</p></li>`;
    })
    .join('');
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = markup;
}

function createMarkupForOneCountry(countries) {
  const markup = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `
      <div class='country-info-item'>
        <div class='country-name'>
          <img width="55"
            src='${flags.svg}'>
          <p> ${name?.official}</p>
        </div>
        <p><b>Capital</b>: ${capital}</p>
        <p><b>Population</b>: ${population}</p>
        <p><b>Languages</b>: ${Object.values(languages)}</p>
      </div>`;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}

