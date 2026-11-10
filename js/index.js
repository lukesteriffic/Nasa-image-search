document.addEventListener('DOMContentLoaded', function() {
    
    const searchForm = document.getElementById('searchForm');
    const searchTermInput = document.getElementById('searchTerm');
    const resultsContainer = document.getElementById('results');

    if (searchForm && searchTermInput && resultsContainer) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const searchTerm = searchTermInput.value.trim(); //Gets the search term
            if (searchTerm) {
                searchNASAImages(searchTerm);  //calls the search function, otherwise alerts if the search term is empty
            } else {
                alert('Please enter a search term.'); 
            }
        });
    } else {
        console.error('One or more required elements are missing in the DOM.');
    }
});

function searchNASAImages(searchTerm) {
    const apiUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchTerm)}&media_type=image`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); // Handles HTTP errors
            }
            return response.json();
        })
        .then(data => {
            if (data.collection.items.length === 0) {
                displayNoResults(); //Handles no results
            } else {
                displayResults(data.collection.items);  //Displays results
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayError(); 
        });
}

function displayResults(items) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; 

    items.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        // Image
        const image = document.createElement('img');
        image.src = item.links ? item.links[0].href : 'https://via.placeholder.com/200'; 
        image.alt = item.data[0].title || 'No description available';

        // Title
        const title = document.createElement('h2');
        title.textContent = item.data[0].title || 'No title available';

        // Description
        const description = document.createElement('p');
        description.textContent = item.data[0].description || 'No description available';

        // Date
        const date = document.createElement('p');
        date.textContent = item.data[0].date_created ? new Date(item.data[0].date_created).toLocaleDateString() : 'No date available';


        resultItem.appendChild(image);
        resultItem.appendChild(title);
        resultItem.appendChild(description);
        resultItem.appendChild(date);

        
        resultsContainer.appendChild(resultItem);
    });
}

function displayNoResults() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '<p>No results found. Please try another search term.</p>';
}

function displayError() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '<p>An error occurred while fetching data. Please try again later.</p>';
}

// This function generates a random colour to be used to change the background colour
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


setInterval(() => {
    document.body.style.background = getRandomColor(); // This changes the background colour every 30 seconds
}, 30000);