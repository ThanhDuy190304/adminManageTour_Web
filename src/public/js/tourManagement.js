const addImageButton = document.getElementById('addImageButton');
const imagePreview = document.getElementById('imagePreview');
let selectedImages = [];  // Array lưu các file ảnh
let details=[];
let newImages = [];  // Array lưu các file ảnh
// Ấn vào để đến trang chi tiết của tour
function StoreId(button) {
    const id = button.value;
    window.location.href = `/tours/${id}`; // Chuyển đến tour_detail với ID
}

let currentPage = 1;
let totalpage;

// Mỗi lần ấn filter, chuyển trang di chuyển lên đầu
function scrollToProductList() {
    const productList = document.getElementById('divide'); // Phần tử danh sách sản phẩm
    if (productList) {
        productList.scrollIntoView({ behavior: 'smooth' }); // Cuộn mượt mà đến phần tử
    }
}


// Lấy container để hiển thị các lựa chọn
const selectedFiltersContainer = document.getElementById("selected-filters");

// Hàm khôi phục trạng thái filter từ URL
function restoreFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("query");
    if (searchParam) {
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.value = searchParam;  // Đặt giá trị tìm kiếm vào ô input
        }
    }

    const sortParam = params.get("sort"); // Lấy giá trị sort từ URL
    if (sortParam) {
        const sortSelect = document.getElementById("sortSelect");
        console.log(sortSelect)
        if (sortSelect) {
            // Chọn option có value khớp với `sortParam`
            const optionToSelect = Array.from(sortSelect.options).find(option => option.value === sortParam);
            if (optionToSelect) {
                sortSelect.value = sortParam; // Gán đúng giá trị value
            }
        }
    }

    const locationParam = params.get("location"); // Lấy giá trị sort từ URL
    if (locationParam) {
        const filterLocation = document.getElementById("filterLocation");
        // console.log(sortSelect)
        if (filterLocation) {
            // Chọn option có value khớp với `sortParam`
            const optionToSelect = Array.from(filterLocation.options).find(option => option.value === locationParam);
            if (optionToSelect) {
                filterLocation.value = locationParam; // Gán đúng giá trị value
            }
        }
    }

    const companyParam = params.get("company"); // Lấy giá trị sort từ URL
    if (companyParam) {
        const filterCommpany = document.getElementById("filterCommpany");
        console.log(filterCommpany)
        if (filterCommpany) {
            // Chọn option có value khớp với `sortParam`
            const optionToSelect = Array.from(filterCommpany.options).find(option => option.value === companyParam);
            if (optionToSelect) {
                filterCommpany.value = companyParam; // Gán đúng giá trị value
            }
        }
    }
    currentPage = params.get("page") || 1;
}

// Áp dụng filter và lấy nội dung để render ra
function applyFilters() {
    const filters = {};

    const searchInput = document.getElementById("searchInput");
    if (searchInput && searchInput.value) {
        filters["query"] = searchInput.value;  // Thêm giá trị tìm kiếm vào filters
    }
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect && sortSelect.value) {
        filters["sort"] = sortSelect.value; // Giá trị sắp xếp
    }
    const filterLocation = document.getElementById('filterLocation');
    if (filterLocation && filterLocation.value) {
        filters["location"] = filterLocation.value; // Giá trị sắp xếp
    }
    const filterCommpany = document.getElementById('filterCommpany');
    if (filterCommpany && filterCommpany.value) {
        filters["company"] = filterCommpany.value; // Giá trị sắp xếp
    }
    filters["page"] = currentPage;

    // Tạo query parameters từ bộ lọc (filters)
    const queryParams = new URLSearchParams(filters).toString();
    console.log(`/tours/api?${queryParams}`)
    fetch(`/tour-management/api?${queryParams}`) // Yêu cầu bất đồng bộ
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi mạng: ' + response.status);
            }
            return response.json(); // Chuyển đổi phản hồi thành JSON
        })
        .then(data => {
            // Hiển thị nội dung HTML trả về từ server
            renderHTML(data.paginatedTours);

            // Hiển thị các nút phân trang
            renderPageButtons(data.totalPages);
            if(currentPage>data.totalPages){
                currentPage = 1;
                applyFilters()
            }
            totalpage = data.totalPages;
            // Cập nhật URL trên trình duyệt mà không tải lại trang
            updateURL(queryParams);
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
    scrollToProductList()
}

// Render ra List những tour
function renderHTML(paginatedTours) {
    const tourList = document.getElementById('showTours');
    let html = '';
            if (paginatedTours.length === 0) {
                html = '<p>No tours available</p>';
            }
            paginatedTours.forEach(tour => {
                html += `
                    <div class="w-full max-w-xs flex-shrink-0 mx-auto flex flex-col justify-between bg-white rounded-lg shadow-lg overflow-hidden h-full transition-transform duration-300 ease-in-out hover:scale-105">
                        <div class="flex flex-col h-full">
                            <!-- Giảm kích thước hình ảnh -->
                            <img src="${tour.img_url}" alt="" class="w-full h-36 object-cover rounded-t-lg">
                            <div class="p-4 flex flex-col justify-between flex-grow">
                                <!-- Tên và giá tour theo hàng ngang -->
                                <div class="flex justify-between items-center">
                                    <h3 class="name text-lg font-semibold">${tour.title}</h3>
                                    <p class="price text-gray-600">${tour.prices}</p>
                                </div>
                                <!-- Mô tả tour -->
                                <p class="text-gray-600 w-full overflow-hidden text-ellipsis line-clamp-2 mt-2">${tour.brief}</p>
                            </div>
                        </div>

                        <!-- Đánh giá và nút xem chi tiết -->
                        <div class="flex justify-between items-center px-4 pb-4">
                            <div class="flex">
                                <i class="fa-solid fa-star text-yellow-500"></i>
                                <i class="fa-solid fa-star text-yellow-500"></i>
                                <i class="fa-solid fa-star text-yellow-500"></i>
                                <i class="fa-solid fa-star text-yellow-500"></i>
                                <i class="fa-solid fa-star text-yellow-500"></i>
                            </div>
                            <button type="button" id="udateTourButton" class="self-end px-4 py-2 bg-green-900 text-white rounded-full hover:bg-green-950 transition-colors duration-200" value="${tour.tour_id}" onclick="handleUpdateClick(this)">Update</button>
                        </div>
                    </div>
                `;
            });
    tourList.innerHTML = html;  // Thay thế nội dung hiện tại bằng HTML mới
}

// Update URL người dùng thay đổi
function updateURL(queryParams) {
    const newURL = `${window.location.pathname}?${queryParams}`;
    history.pushState(null, '', newURL);  // Cập nhật URL mà không làm tải lại trang
}

// Hàm hiển thị các nút phân trang
function renderPageButtons(totalPages) {
    console.log(currentPage)
    const pageNumbersContainer = document.getElementById('pageNumbers');
    pageNumbersContainer.innerHTML = ''; // Xóa các nút phân trang hiện tại

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.onclick = () => {
            currentPage = i;
            applyFilters(); // Gọi AJAX khi nhấn vào số trang
        }

        if (i == currentPage) {
            pageButton.classList.add('active');
        }

        pageNumbersContainer.appendChild(pageButton);
    }
    // Cập nhật trạng thái nút Previous và Next
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}


function nextPage() {
    if (currentPage < totalpage) {
        currentPage++;
        applyFilters();
    }
}

// Hàm quay lại trang trước
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        applyFilters();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const filterLocation = document.getElementById('filterLocation');
    const filterCommpany = document.getElementById('filterCommpany');

    // Lắng nghe sự kiện thay đổi cho ô tìm kiếm
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            applyFilters();  // Gọi lại hàm applyFilters khi giá trị tìm kiếm thay đổi
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", function () {
            applyFilters();
        });
    }

    if (filterLocation) {
        filterLocation.addEventListener("change", function () {
            applyFilters();
        });
    }

    if (filterCommpany) {
        filterCommpany.addEventListener("change", function () {
            applyFilters();
        });
    }

    restoreFiltersFromURL();
    const totalPages = parseInt(document.querySelector('.pagination').getAttribute('value')) || 1;
    totalpage=totalPages
    renderPageButtons(totalPages)
});


let currentTourId = null;

// Hiển thị modal khi người dùng click vào nút Add
document.getElementById('addTourButton').addEventListener('click', function() {
    showTourModal('add');  // Hiển thị modal để thêm tour mới
});

function handleUpdateClick(button) {
    const tourId = button.value;
    // Gửi yêu cầu fetch tới API để lấy dữ liệu chi tiết của tour
    fetch(`/tour-management/getTourById/${tourId}`)
        .then(response => response.json())
        .then(tourData => {
            // Hiển thị modal với dữ liệu tour lấy từ cơ sở dữ liệu
            console.log("fetch", tourData)
            showTourModal('update', tourData, tourId);
        })
        .catch(error => console.error('Error fetching tour data:', error));
}

// Đóng modal
document.getElementById('closeModalButton').addEventListener('click', function() {
    hideTourModal();
});

function showTourModal(action, tourData = null, tourId = null) {
    selectedImages = [];
    details=[];
    newImages = [];
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('tourForm');
    
    if (action === 'add') {
        modalTitle.textContent = 'Add New Tour';
        form.reset();
    } else if (action === 'update') {
        modalTitle.textContent = 'Update Tour';
        document.getElementById('tourTitle').value = tourData.title || '';
        document.getElementById('tourBrief').value = tourData.brief || '';
        document.getElementById('tourDetail').value = tourData.details || '';
        document.getElementById('tourLocation').value = tourData.locationName || '';
        document.getElementById('tourPrice').value = tourData.prices || '';
        document.getElementById('tourRate').value = tourData.rate || '';
        document.getElementById('tourVoucher').value = tourData.voucher || '';
        // document.getElementById('tourManufactory').value = tourData.manufactory || '';
        currentTourId = tourId;

        // Hiển thị hình ảnh cũ
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = '';  // Xóa các hình ảnh cũ
        
        console.log("Sau khi dua vao show model", tourData)
        if (tourData.imgArray && tourData.imgArray.length > 0) {
            tourData.imgArray.forEach(imageUrl => {
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'relative inline-block mr-2 mb-2';

                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;  // URL của ảnh
                imgElement.classList.add('w-16', 'h-16', 'object-cover');
                imgWrapper.appendChild(imgElement);

                const removeBtn = document.createElement('span');
                removeBtn.className = 'absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer';
                removeBtn.textContent = 'x';
                removeBtn.onclick = () => {
                    newImages = newImages.filter(imgUrl => imgUrl !== imageUrl);
                    console.log(newImages)
                    imgWrapper.remove();
                };
                imgWrapper.appendChild(removeBtn);

                imagePreview.appendChild(imgWrapper);
                newImages.push(imageUrl);
                
                console.log("Mang cac anh cu",newImages)
            });
        }

        const detailsContainer = document.getElementById('details-container');
        detailsContainer.innerHTML = '';  // Xóa các detail cũ
        if (tourData.schedulesTour && Array.isArray(tourData.schedulesTour)) {
            tourData.schedulesTour.forEach((detail, index) => {
                const detail_tour = { detail_tour_id: detail.schedule_id, date: detail.tour_date, status: detail.status, maxQuantity: detail.max_quantity };
                details.push(detail_tour);

                const detailItem = document.createElement('div');
                detailItem.className = 'detail-item p-4 border rounded-md mt-2 cursor-pointer';
                detailItem.innerHTML = `<strong>Ngày:</strong> ${detail.tour_date}, <strong>Trạng thái:</strong> ${detail.status}, <strong>Số lượng tối đa:</strong> ${detail.max_quantity}`;
                
                detailItem.onclick = null;  // Xóa sự kiện cũ trước khi thêm sự kiện mới
                detailItem.onclick = () => {
                    showDetailDialog(index);
                };

                detailsContainer.appendChild(detailItem);
            });
        }
    }

    document.getElementById('tourModal').classList.remove('hidden');
}

function showDetailDialog(index) {
    const detail = details[index];

    document.getElementById('detail-date').value = detail.date;
    document.getElementById('detail-status').value = detail.status;
    document.getElementById('detail-quantity').value = detail.maxQuantity;

    const dialog = document.getElementById('add-detail-dialog');
    dialog.classList.remove('hidden');

    document.getElementById('save-detail-button').onclick = () => saveDetail(index);
    document.getElementById('cancel-detail-button').onclick = () => dialog.classList.add('hidden');
}

function saveDetail(index) {
    const date = document.getElementById('detail-date').value;
    const status = document.getElementById('detail-status').value;
    const maxQuantity = document.getElementById('detail-quantity').value;
    // Kiểm tra các trường trống
    if (!date || !status || !maxQuantity) {
        alert('Please fill in all fields.');
        return;
    }

    // Kiểm tra định dạng giá (ví dụ: chỉ cho phép số)
    if (isNaN(maxQuantity) || Number(maxQuantity) <= 0) {
        alert('Please enter a valid max quantity.');
        return;
    }
    const currentDate = new Date();
    const detailTourDateObj = new Date(date);
    // Kiểm tra ngày nhập vào có nhỏ hơn ngày hiện tại
    if (detailTourDateObj < currentDate) {
        alert('Schedual must be in the future.');
        return;
    }

    if (status !== "available" && status!== "not_available") {
        alert('Status are available or not_available.');
        return;
    }
    console.log(date,status,maxQuantity)
    // Cập nhật thông tin trong mảng details
    details[index] = {
        ...details[index],
        date,
        status,
        maxQuantity: parseInt(maxQuantity, 10)
    };

    // Xóa div cũ
    const detailsContainer = document.getElementById('details-container');
    const oldDetailItem = detailsContainer.children[index];
    detailsContainer.removeChild(oldDetailItem);

    // Tạo div mới với thông tin cập nhật
    const detailItem = document.createElement('div');
    detailItem.className = 'detail-item p-4 border rounded-md mt-2 cursor-pointer';
    detailItem.innerHTML = `<strong>Ngày:</strong> ${date}, <strong>Trạng thái:</strong> ${status}, <strong>Số lượng tối đa:</strong> ${maxQuantity}`;

    // Thêm sự kiện click để chỉnh sửa lại thông tin
    detailItem.onclick = () => {
        showDetailDialog(index);
    };

    // Thêm div mới vào đúng vị trí
    if (index < detailsContainer.children.length) {
        detailsContainer.insertBefore(detailItem, detailsContainer.children[index]);
    } else {
        detailsContainer.appendChild(detailItem);
    }

    // Ẩn dialog
    document.getElementById('add-detail-dialog').classList.add('hidden');
}

// Ẩn modal
function hideTourModal() {
    document.getElementById('tourModal').classList.add('hidden');
    const imgsContainer = document.getElementById('imagePreview');
            imgsContainer.innerHTML = '';

            const detailsContainer = document.getElementById('details-container');
            detailsContainer.innerHTML = '';
}

// Xử lý khi người dùng chọn ảnh
addImageButton.addEventListener('click', function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;  // Cho phép chọn nhiều ảnh
    fileInput.click();

    fileInput.addEventListener('change', function(event) {
        const files = event.target.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    });
});

// Hiển thị ảnh đã chọn
function handleFiles(files) {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.classList.add('w-16', 'h-16', 'mr-2', 'mb-2', 'object-cover');
            imagePreview.appendChild(imgElement);
            selectedImages.push(file);
        };
        reader.readAsDataURL(file);  // Đọc ảnh dưới dạng base64
    });
}

// Xử lý form submit để thêm hoặc cập nhật tour
document.getElementById('tourForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('tourTitle').value;
    const brief = document.getElementById('tourBrief').value;
    const detail = document.getElementById('tourDetail').value;
    const location = document.getElementById('tourLocation').value;
    const price = document.getElementById('tourPrice').value;
    const rate = document.getElementById('tourRate').value;
    const voucher = document.getElementById('tourVoucher').value;
    // Kiểm tra các trường trống
    if (!title || !brief || !detail || !location || !price || !rate || !voucher) {
        alert('Please fill in all fields.');
        return;
    }

    // Kiểm tra định dạng giá (ví dụ: chỉ cho phép số)
    if (isNaN(price) || Number(price) <= 0) {
        alert('Please enter a valid price.');
        return;
    }

    if (isNaN(voucher) || Number(voucher) <= 0) {
        alert('Please enter a valid voucher.');
        return;
    }

    // Kiểm tra định dạng đánh giá (ví dụ: từ 1 đến 5)
    if (isNaN(rate) || rate < 1 || rate > 5) {
        alert('Please enter a valid rate between 1 and 5.');
        return;
    }
    let formData = new FormData();
    selectedImages.forEach(image => {
        console.log(image); // Kiểm tra mỗi ảnh
        formData.append('images[]', image);  // Sử dụng 'images[]' để gửi mảng ảnh
    });
    console.log("Truoc khi update",newImages)
    // Append các trường dữ liệu text vào FormData
    formData.append('title', title);
    formData.append('brief', brief);
    formData.append('detail', detail);
    formData.append('location', location);
    formData.append('price', price);
    formData.append('rate', rate);
    formData.append('voucher', voucher);
    formData.append('details', JSON.stringify(details));
    if (currentTourId) {
        if (newImages.length > 0) {
            formData.append('newImages', JSON.stringify(newImages));  // Chỉ append nếu mảng không rỗng
        } else {
            formData.append('newImages', "[]");  // Nếu là mảng rỗng, truyền một chuỗi "[]"
        }
    }

    if (currentTourId) {
        // Nếu có currentTourId, thực hiện cập nhật tour
        updateTourAPI(currentTourId, formData);
    } else {
        // Nếu không có currentTourId, thực hiện thêm tour mới
        addTourAPI(formData);
    }
});

// Hàm gọi API để thêm tour mới
function addTourAPI(formData) {
    fetch('/tour-management/addTourId', {
        method: 'POST',
        body: formData  // Gửi formData, không cần set Content-Type vì sẽ tự động
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Tour added successfully!');
            applyFilters();  // Cập nhật danh sách tour
            hideTourModal();  // Ẩn modal
        } else {
            alert('Error adding tour!');
        }
    })
    .catch(error => console.error('Error:', error));
}


// Hàm gọi API để cập nhật thông tin tour
function updateTourAPI(tourId, formData) {
    fetch(`/tour-management/UpdateTour/${tourId}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Tour updated successfully!');
            applyFilters();  // Cập nhật danh sách tour
            hideTourModal();  // Ẩn modal
        } else {
            alert('Error updating tour!');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Hàm gọi API để xóa tour (đã có trong code cũ)
function deleteTour(button) {
    const tourId = button.value;
    if (confirm('Are you sure you want to delete this tour?')) {
        fetch(`/tour-management/api/${tourId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Tour deleted successfully!');
                applyFilters();  // Cập nhật danh sách tour
            } else {
                alert('Error deleting tour!');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

document.getElementById('add-detail-button').addEventListener('click', function() {
    document.getElementById('save-detail-button').onclick = function() {
        const date = document.getElementById('detail-date').value;
        const status = document.getElementById('detail-status').value;
        const maxQuantity = document.getElementById('detail-quantity').value;
        console.log(details)
    
        if (date && status && maxQuantity) {
            const detail = { date, status, maxQuantity };
            details.push(detail);
            
            const detailItem = document.createElement('div');
            detailItem.className = 'detail-item p-4 border rounded-md mt-2';
            detailItem.innerHTML = `<strong>Ngày:</strong> ${date}, <strong>Trạng thái:</strong> ${status}, <strong>Số lượng tối đa:</strong> ${maxQuantity}`;
            
            document.getElementById('details-container').appendChild(detailItem);
            document.getElementById('add-detail-dialog').classList.add('hidden');
        }
    };
    document.getElementById('add-detail-dialog').classList.remove('hidden');
});

document.getElementById('cancel-detail-button').addEventListener('click', function() {
    document.getElementById('add-detail-dialog').classList.add('hidden');
});