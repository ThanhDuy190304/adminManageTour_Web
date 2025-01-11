const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');
const userListElement = document.getElementById('userList');

searchButton.addEventListener('click', async function() {
        
    const searchItem = searchInput.value;
    
    const xhr = new XMLHttpRequest();
    
    xhr.onload == function(){
        if(xhr.status==200){
            const users = JSON.parse(xhr.responseText);
            console.log(xhr);
        }
        else{
            console.error('Error: '+ xhr.status);
        }
    }

    xhr.open('GET',);
    xhr.send();

});

function displayUserList(users) {
    userListElement.innerHTML = ''; // Xóa danh sách cũ

    if (users.length === 0) {
        userListElement.innerHTML = '<li>No users found</li>';
    }

    users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = user.name; // Hiển thị tên người dùng
        userListElement.appendChild(listItem);
    });
}