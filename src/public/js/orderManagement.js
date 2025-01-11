let reservations = [];

// Lấy dữ liệu đơn hàng từ server
async function getReservations() {
    try {
        const response = await fetch('/orderManagement/getReservations');
        const data = await response.json();
        if (data && Array.isArray(data.data) && data.data.length > 0) {
            reservations = data.data; // Lưu dữ liệu vào biến toàn cục
            filterAndDisplayData(); // Hiển thị dữ liệu ngay khi nhận được
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }
}
async function updateReservationStatus(reservationId, newStatus) {
    try {
        const response = await fetch('/orderManagement/updateReservationStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reservationId, status: newStatus }),
        });
        if (response.ok) {
            console.log('Status updated successfully');
        } else {
            const errorData = await response.json();  // Đọc thông báo lỗi
            alert('Error: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error updating reservation status:', error);
    }
}

// Hiển thị dữ liệu sau khi lọc và sắp xếp
function filterAndDisplayData() {
    const statusFilter = document.getElementById('statusFilter').value;
    const sortByDate = document.getElementById('sortByDate').value;

    let filteredData = reservations;
    if (statusFilter) {
        filteredData = filteredData.filter(reservation => reservation.status === statusFilter);
    }
    if (sortByDate === 'asc') {
        filteredData = filteredData.sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate));
    } else {
        filteredData = filteredData.sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate));
    }
    // Hiển thị dữ liệu
    const tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = '';  // Xóa các dòng cũ nếu có
    filteredData.forEach(reservation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2 border-b">${reservation.reservationId}</td>
            <td class="px-4 py-2 border-b">${reservation.touristName}</td>
            <td class="px-4 py-2 border-b">${reservation.touristContact}</td>
            <td class="px-4 py-2 border-b">${new Date(reservation.reservationDate).toLocaleString()}</td>
            <td class="px-4 py-2 border-b">
                <select class="bg-gray-100 border rounded p-1 status-select" data-reservation-id="${reservation.reservationId}">
                    <option value="waiting" ${reservation.status === 'waiting' ? 'selected' : ''}>Chưa thanh toán</option>
                    <option value="reserved" ${reservation.status === 'reserved' ? 'selected' : ''}>Đã thanh toán</option>
                </select>
            </td>            
            <td class="px-4 py-2 border-b">
                <button class="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded" onclick="viewDetails('${reservation.reservationId}')">Detail</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    // Gán sự kiện khi thay đổi trạng thái
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const reservationId = e.target.getAttribute('data-reservation-id');
            const newStatus = e.target.value;
            updateReservationStatus(reservationId, newStatus); // Gửi yêu cầu POST khi thay đổi trạng thái
        });
    });
}

// Lọc và sắp xếp khi nhấn nút "Apply Filters"
document.getElementById('applyFilters').addEventListener('click', filterAndDisplayData);

// Hàm chi tiết
async function viewDetails(reservationId) {
    try {
        // Gửi yêu cầu đến server để lấy dữ liệu chi tiết
        console.log('Reservation ID:', reservationId);
        const response = await fetch(`/orderManagement/getDetailReservation/${reservationId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch reservation details');
        }
        const data = await response.json();
        if (data && Array.isArray(data.data) && data.data.length > 0) {
            const reservationsDetails = data.data; // Dữ liệu chi tiết là một mảng
            showReservationDetails(reservationsDetails); // Gọi hàm hiển thị chi tiết
        } else {
            alert('No details found for this reservation.');
        }
    } catch (error) {
        console.error('Error fetching reservation details:', error);
    }
}


function showReservationDetails(reservations) {
    let modalContent = `
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl space-y-4 max-h-96 overflow-y-auto">
            <h3 class="text-xl font-bold mb-4">Reservation Details</h3>
    `;

    // Lặp qua tất cả các chi tiết và hiển thị chúng
    reservations.forEach(reservation => {
        modalContent += `
            <div class="space-y-2">
                <p><strong>Detail Reservation ID:</strong> ${reservation.detailReservationId}</p>
                <p><strong>Title:</strong> ${reservation.title}</p>
                <p><strong>Quantity:</strong> ${reservation.quantity}</p>
                <p><strong>Total Price:</strong> ${reservation.totalPrice}</p>
                <p><strong>Tour Date:</strong> ${new Date(reservation.tourDate).toLocaleString()}</p>
                <p><strong>Manufacturer Name:</strong> ${reservation.manufacturerName}</p>
            </div>
            <hr class="my-4" /> <!-- Đường phân cách giữa các đơn hàng -->
        `;
    });

    modalContent += `
            <div class="flex justify-end space-x-4">
                <button class="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;

    // Tạo modal container
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50';
    modal.innerHTML = modalContent;

    // Đưa modal vào trong body
    document.body.appendChild(modal);
}

// Hàm đóng dialog
function closeModal() {
    const modal = document.querySelector('.fixed');
    if (modal) {
        modal.remove();
    }
}

// Khi trang đã tải xong, gọi hàm để lấy dữ liệu
document.addEventListener('DOMContentLoaded', getReservations);
