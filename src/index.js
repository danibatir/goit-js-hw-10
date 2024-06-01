import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_814FYNrKylPjsdCFnYr3hZfa7VwKdfyWv2yRIF0r08zGqHFGY4Xiq4qTcHx1JWPy';

async function fetchBreeds() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    return response.data;
  } catch (error) {
    console.error('Error loading breeds:', error);
    throw error;
  }
}

async function fetchCatByBreed(breedId) {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );
    return response.data[0];
  } catch (error) {
    console.error('Error loading cat information:', error);
    throw error;
  }
}

async function populateBreedsSelect() {
  try {
    document.querySelector('.loader').style.display = 'block';
    const breeds = await fetchBreeds();
    const select = document.querySelector('.breed-select');

    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      select.appendChild(option);
    });
    document.querySelector('.loader').style.display = 'none';
  } catch (error) {
    console.error('Error loading breeds:', error);
    document.querySelector('.error').style.display = 'block';
    document.querySelector('.loader').style.display = 'none';
  }
}

function handleBreedChange() {
  const select = document.querySelector('.breed-select');
  const breedId = select.value;

  if (!breedId) {
    document.querySelector('.cat-info').innerHTML = '';
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('.error').style.display = 'none';
    return;
  }

  document.querySelector('.loader').style.display = 'block';
  fetchCatByBreed(breedId)
    .then(catInfo => {
      displayCatInfo(catInfo);
    })
    .catch(error => {
      console.error('Error loading cat information:', error);
      document.querySelector('.error').style.display = 'block';
      document.querySelector('.loader').style.display = 'none';
    });
}

function displayCatInfo(catInfo) {
  const catInfoDiv = document.querySelector('.cat-info');
  const breed = catInfo.breeds[0];

  catInfoDiv.innerHTML = `
    <h2>${breed.name}</h2>
    <img src="${catInfo.url}" alt="Image of ${breed.name}">
    <p><strong>Breed:</strong> ${breed.name}</p>
    <p><strong>Description:</strong> ${breed.description}</p>
    <p><strong>Temperament:</strong> ${breed.temperament}</p>
  `;
  document.querySelector('.loader').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.error').style.display = 'none';
  document.querySelector('.loader').style.display = 'none';
  populateBreedsSelect();
  document
    .querySelector('.breed-select')
    .addEventListener('change', handleBreedChange);
});
