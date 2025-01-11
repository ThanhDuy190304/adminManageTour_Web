const venueList = document.getElementById('venueList');
const type = document.getElementById('type');
const sortBy = document.getElementById('sortBy');
const order = document.getElementById('order');
const viewButton = document.getElementById('viewButton');

let venue = [];

async function fetchMoneyByYear() {
    const sortByValue = sortBy.value;
    const orderValue = order.value;
    try {
        const response = await fetch(`/report/StatisticMoneyByYear/${sortByValue}/${orderValue}`);
        const data = await response.json();
        venue = data.venue;
        displayVenueList(venue);
    } catch (error) {
        console.error('Error fetchMoneyByYear: ', error);
    }
}

async function fetchMoneyByMonth() {
    const sortByValue = sortBy.value;
    const orderValue = order.value;
    try {
        const response = await fetch(`/report/StatisticMoneyByMonth/${sortByValue}/${orderValue}`);
        const data = await response.json();
        venue = data.venue;
        displayVenueList(venue);
    }
    catch (error) {
        console.error('Error fetchMoneyByMonth: ', error);
    }
}

async function fetchMoneyByDay() {
    const sortByValue = sortBy.value;
    const orderValue = order.value;
    try {
        const response = await fetch(`/report/StatisticMoneyByDay/${sortByValue}/${orderValue}`);
        const data = await response.json();
        venue = data.venue;
        displayVenueList(venue);
    }
    catch (error) {
        console.error('Error fetchMoneyByMonth: ', error);
    }
}

viewButton.addEventListener('click', async function(){
    const typeSelector = type.value;
    if (typeSelector == 'daySelector') {
        fetchMoneyByDay();
    }
    else if (typeSelector == 'monthSelector') {
        fetchMoneyByMonth();
    }
    else if (typeSelector == 'yearSelector') {
        fetchMoneyByYear();
    }
})


function displayVenueList(venue) {

    venueList.innerHTML = ''; // Xóa danh sách cũ

    if (venue.length === 0) {
        venueList.innerHTML = '<li>No venue found</li>';
    } else {
        venue.forEach(venue => {
            const row = document.createElement('tr');
            row.classList.add('border-b', 'user-row');
            row.setAttribute('data-time', venue.time);
            row.setAttribute('data-total-money', venue.total_money);
            row.innerHTML = `
                <td class="px-4 py-2 text-left">${venue.time}</td>
                <td class="px-4 py-2 text-left">${venue.total_money}</td>
            `;
            venueList.appendChild(row);
        });
    }

}

document.addEventListener('DOMContentLoaded', fetchMoneyByYear);