const titleList = document.getElementById('tourName');
const sortBy = document.getElementById('sortBy');

let venue = [];

async function fetchAllTitle() {
    
    try {
        const response = await fetch('/reportByTour/getAllTitle');
        const data = await response.json();
        const optionsArray = data.titles;
        optionsArray.forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText.title;
            option.textContent = optionText.title;

            titleList.appendChild(option);
        })
    } catch (error) {
        console.error('Error fetchAllTitle: ', error);
    }
}

titleList.addEventListener('change', readyToFetch);

sortBy.addEventListener('change', readyToFetch);

async function readyToFetch(){
    const sortByValue = sortBy.value;
    console.log(sortByValue);
    if(sortByValue == 'yearSort'){
        fetchTourByYear();
    }
    else if(sortByValue == 'monthSort'){
        fetchTourByMonth();
    }
    else if(sortByValue == 'daySort'){
        fetchTourByDay();
    }
}

async function fetchTourByYear(){
    const tour_name = titleList.value;
    try{
        const response = await fetch(`/reportByTour/tourStatisticByYear/${tour_name}`);
        const data = await response.json();
        venue = data.venue;
        displayVenueList(venue);
    }
    catch (error) {
        console.error('Error fetchTourByYear: ', error);
    }
}

async function fetchTourByMonth(){
    const tour_name = titleList.value;
    try{
        console.log(tour_name);
        const response = await fetch(`/reportByTour/tourStatisticByMonth/${tour_name}`);
        const data = await response.json();
        venue = data.venue;
        displayVenueList(venue);
    }
    catch (error) {
        console.error('Error fetchTourByMonth: ', error);
    }
}

async function fetchTourByDay(){
    const tour_name = titleList.value;
    try{
        const response = await fetch(`/reportByTour/tourStatisticByDay/${tour_name}`);
        const data = await response.json();
        venue = data.venue;
        displayVenueList(venue);
    }
    catch (error) {
        console.error('Error fetchTourByDay: ', error);
    }
}

function displayVenueList(venue) {

    venueList.innerHTML = ''; // Xóa danh sách cũ

    if (venue.length === 0) {
        venueList.innerHTML = '<li>No venue found</li>';
    } else {
        venue.forEach(venue => {
            const row = document.createElement('tr');
            row.classList.add('border-b', 'user-row');
            row.setAttribute('data-time', venue.time);
            row.setAttribute('data-total-money', venue.money);
            row.innerHTML = `
                <td class="px-4 py-2 text-left">${venue.time}</td>
                <td class="px-4 py-2 text-left">${venue.money}</td>
            `;
            venueList.appendChild(row);
        });
    }

}

document.addEventListener('DOMContentLoaded', fetchAllTitle);