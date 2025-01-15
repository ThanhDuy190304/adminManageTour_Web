const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');
const userListElement = document.getElementById('userList');
const sortBy = document.getElementById('sortBy');
const order = document.getElementById('order');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const currentPage = document.getElementById('currentPage');

let users;
let pages;
let currentPageNumber = 1;

async function pageLoad() {
    loadUserList(currentPageNumber);
}

searchButton.addEventListener('click', async function () {
    currentPage.value = '1';
    currentPageNumber = 1;
    loadUserList(currentPageNumber);
});

sortBy.addEventListener('change', function () {
    currentPage.value = '1';
    currentPageNumber = 1;
    loadUserList(currentPageNumber);
});

order.addEventListener('change', function () {
    currentPage.value = '1';
    currentPageNumber = 1;
    loadUserList(currentPageNumber);
});

nextButton.addEventListener('click', function () {
    if (currentPageNumber < pages) {
        currentPageNumber = currentPageNumber + 1;
        currentPage.value = currentPageNumber;
        loadUserList(currentPageNumber);
    }
})

previousButton.addEventListener('click', function () {
    if (currentPageNumber > 1) {
        currentPageNumber = currentPageNumber - 1;
        currentPage.value = currentPageNumber;
        loadUserList(currentPageNumber);
    }
})

async function loadUserList(page) {
    const sortByValue = sortBy.value;
    const orderValue = order.value;
    const searchItem = searchInput.value;
    try {
        if (!searchItem) {
            const response2 = await fetch('/accountManagement/getNumberUsers');
            const response1 = await fetch(`/accountManagement/getAllUsers/${sortByValue}/${orderValue}/${page}`);

            const data1 = await response1.json();
            users = data1.users;
            displayUserList(users);

            const data2 = await response2.json();
            pages = data2.numberUser.total;
            console.log(data2);
            pages = Math.ceil(pages / 2);
            console.log(pages);
            numPage.textContent = `/${pages}`;
            currentPage.value = currentPageNumber;
        }
        else {
            const response2 = await fetch(`/accountManagement/getCountFilterUsers/${searchItem}`);
            const response1 = await fetch(`/accountManagement/getFilter/${searchItem}/${sortByValue}/${orderValue}/${page}`);

            const data1 = await response1.json();
            users = data1.users;
            displayUserList(users);

            const data2 = await response2.json();
            pages = data2.countUsers.count_users;
            console.log(data2);
            pages = Math.ceil(pages / 2);
            console.log(pages);
            numPage.textContent = `/${pages}`;
            currentPage.value = currentPageNumber;
        }
    }
    catch (error) {
        console.error('Error loading users:', error);
    }
}

//---------------------------------------

function displayUserList(users) {

    userListElement.innerHTML = ''; // Xóa danh sách cũ

    if (users.length === 0) {
        userListElement.innerHTML = '<li>No users found</li>';
    } else {
        users.forEach(user => {
            const row = document.createElement('tr');
            row.classList.add('border-b', 'user-row');
            row.setAttribute('data-user-id', user.user_id);
            row.setAttribute('data-user-name', user.user_name);
            row.setAttribute('data-email', user.email);
            row.setAttribute('data-role-name', user.role_name);
            row.setAttribute('data-isbanned', user.is_banned);
            row.innerHTML = `
                <td class="px-4 py-2 text-left">${user.user_name}</td>
                <td class="px-4 py-2 text-left">${user.email}</td>
                <td class="px-4 py-2 text-left">${user.role_name}</td>
                <td>
                    <button class="ml-2 hover:text-red-500" id="open_dialog">More</button>
                </td>
            `;
            userListElement.appendChild(row);
        });
    }

    const modal = document.getElementById('modal');
    const openModal = document.querySelectorAll('#open_dialog');
    const closeModal = document.getElementById('close_dialog');
    const banButton = document.getElementById('ban_button');
    let is_banned;
    let userId;

    openModal.forEach(button => {
        button.addEventListener('click', function () {
            // Lấy thông tin từ các thuộc tính data-* của dòng (tr)
            const row = button.closest('tr');
            userId = row.getAttribute('data-user-id');
            const userName = row.getAttribute('data-user-name');
            const email = row.getAttribute('data-email');
            const roleName = row.getAttribute('data-role-name');
            is_banned = row.getAttribute('data-isbanned') === "true";

            // Cập nhật thông tin người dùng vào modal
            document.getElementById('user_id').textContent = userId;
            document.getElementById('user_name').textContent = userName;
            document.getElementById('email').textContent = email;
            document.getElementById('role_id').textContent = roleName;

            if (roleName === 'admin') {
                banButton.style.display = 'none';
            } else {
                if (is_banned == false) {
                    banButton.textContent = "ban";
                    banButton.classList.remove('bg-green-500', 'hover:bg-green-400');
                    banButton.classList.add('bg-red-600', 'hover:bg-red-700'); // đổi màu khi ban
                }
                else {
                    banButton.textContent = "unban";
                    banButton.classList.remove('bg-red-600', 'hover:bg-red-700');
                    banButton.classList.add('bg-green-500', 'hover:bg-green-400'); // Đổi màu khi unban
                }
                banButton.style.display = 'inline-block';
            }

            // Hiển thị modal
            modal.showModal();
        });
    });

    closeModal.addEventListener('click', function () {
        modal.close();
    });

    banButton.addEventListener('click', async function () {

        if (is_banned == false) {
            banButton.textContent = "unban";
            banButton.classList.remove('bg-red-600', 'hover:bg-red-700');
            banButton.classList.add('bg-green-500', 'hover:bg-green-400'); // Đổi màu khi unban
            is_banned = true;
        }
        else {
            banButton.textContent = "ban";
            banButton.classList.remove('bg-green-500', 'hover:bg-green-400');
            banButton.classList.add('bg-red-600', 'hover:bg-red-700'); // đổi màu khi ban
            is_banned = false;
        }

        //console.log(userId);
        const response = await fetch('/accountManagement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, isBanned: JSON.parse(is_banned) })
        });

        const data = await response.json();
        alert(data.message);

        const row = document.querySelector(`[data-user-id='${userId}']`);
        row.setAttribute('data-isbanned', is_banned);

    });

}

function displayPagination(pagination) {
    paginationContainer.innerHTML = '';

    if (pagination && pagination.length > 0) {
        const ul = document.createElement('ul');
        ul.classList.add('flex');

        pagination.forEach(page => {
            const li = document.createElement('li');
            li.classList.add('mx-1');
            const a = document.createElement('a');
            a.href = `#`;
            a.classList.add('px-4', 'py-2', 'text-blue-500', 'hover:text-blue-700');
            a.textContent = page;
            a.addEventListener('click', function () {
                searchParams.page = page;
                loadUserList();
            });
            li.appendChild(a);
            ul.appendChild(li);
        });

        paginationContainer.appendChild(ul);
    }
}

document.addEventListener('DOMContentLoaded', pageLoad);