import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_814FYNrKylPjsdCFnYr3hZfa7VwKdfyWv2yRIF0r08zGqHFGY4Xiq4qTcHx1JWPy';
async function fetchBreeds() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    return response.data;
  } catch (error) {
    console.error('Eroare la încărcarea raser:', error);
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
    console.error('Eroare la încărcarea informațiilor despre pisică:', error);
    throw error;
  }
}
async function populateBreedsSelect() {
  try {
    const breeds = await fetchBreeds();
    const select = document.querySelector('.breed-select');

    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Eroare la încărcarea raser:', error);
    document.querySelector('.error').style.display = 'block';
  }
}

populateBreedsSelect();
function handleBreedChange() {
  const select = document.querySelector('.breed-select');
  const breedId = select.value;

  if (!breedId) {
    document.querySelector('.cat-info').innerHTML = '';
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('.error').style.display = 'none';
    return;
  }

  fetchCatByBreed(breedId)
    .then(catInfo => {
      displayCatInfo(catInfo);
    })
    .catch(error => {
      console.error('Eroare la încărcarea informațiilor despre pisică:', error);
      document.querySelector('.error').style.display = 'block';
    });
}

document
  .querySelector('.breed-select')
  .addEventListener('change', handleBreedChange);
function displayCatInfo(catInfo) {
  const catInfoDiv = document.querySelector('.cat-info');
  catInfoDiv.innerHTML = `
    <h2>${catInfo.breed}</h2>
    <img src="${catInfo.url}" alt="Image of ${catInfo.breed}">
    <p><strong>Breed:</strong> ${catInfo.breed}</p>
    <p><strong>Description:</strong> ${catInfo.description}</p>
    <p><strong>Temperament:</strong> ${catInfo.temperament}</p>
  `;
  document.querySelector('.loader').style.display = 'none';
}
