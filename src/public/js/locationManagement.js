document.addEventListener('DOMContentLoaded', () => {
    loadLocations();
    document.getElementById('addLocationButton').addEventListener('click', addLocation);
});

document.getElementById('openDialogButton').addEventListener('click', function () {
    document.getElementById('locationDialog').classList.remove('hidden');
});

document.getElementById('cancelButton').addEventListener('click', function () {
    document.getElementById('locationDialog').classList.add('hidden');
});

// Load all locations and populate the table
async function loadLocations() {
    try {
        const response = await fetch('/locationManagement/getAllLocations');
        const locations = await response.json();
        const tableBody = document.querySelector('#locationTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows
        if (locations && locations.data && locations.data.length > 0) {
            locations.data.forEach(location => {
                const row = document.createElement('tr');
                row.classList.add('odd:bg-white', 'even:bg-gray-50');
                row.innerHTML = `
                    <td class="border border-gray-300 px-4 py-2">${location.id}</td>
                    <td class="border border-gray-300 px-4 py-2">${location.name}</td>
                    <td class="border border-gray-300 px-4 py-2">${location.details}</td>
                    <td class="border border-gray-300 px-4 py-2 text-center">
                        <div class="flex flex-col justify-center space-y-2">
                            <button
                                class="bg-blue-500 text-white px-3 py-1 w-24 rounded-md hover:bg-blue-600"
                                onclick="editLocation('${location.id}', '${location.name}', '${location.details}')">
                                Edit
                            </button>
                            <button 
                                class="bg-red-500 text-white px-3 py-1 w-24 rounded-md hover:bg-red-600"
                                onclick="deleteLocation('${location.id}')">
                                Delete
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4">No locations found.</td></tr>`;
        }
    } catch (error) {
        console.error('Error loading locations:', error);
    }
}

// Add a new location
async function addLocation() {
    const name = document.getElementById('locationName').value;
    const details = document.getElementById('locationDetails').value;

    if (!name || !details) {
        alert('Name and details are required!');
        return;
    }
    try {
        const response = await fetch('/locationManagement/postLocation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, details }),
        });
        const result = await response.json();
        if (response.ok) {
            alert('Location added successfully!');
            document.getElementById('addLocationForm').reset();
            loadLocations(); // Refresh the table
        } else {
            alert(result.error || 'Failed to add location.');
        }
    } catch (error) {
        console.error('Error adding location:', error);
    }
}

async function editLocation(id, name, details) {

    // Cập nhật thông tin location vào form chỉnh sửa
    document.getElementById('editLocationName').value = name || '';
    document.getElementById('editLocationDetails').value = details || '';
    // Cập nhật hint trong form để hiển thị giá trị cũ (name và details)
    document.getElementById('editLocationName').placeholder = name || 'Location Name';
    document.getElementById('editLocationDetails').placeholder = details || 'Location Details';

    // Hiển thị dialog chỉnh sửa
    const editDialog = document.getElementById('editLocationDialog');
    editDialog.classList.remove('hidden');

    // Handle save action
    const saveButton = document.getElementById('saveEditButton');
    const cancelButton = document.getElementById('cancelEditButton');

    // Save the new data
    const saveHandler = async (e) => {
        e.preventDefault();
        const newName = document.getElementById('editLocationName').value;
        const newDetails = document.getElementById('editLocationDetails').value;
        if (!newName || !newDetails) {
            alert('Name and details cannot be empty.');
            return;
        }
        const updates = { location_name: newName, details: newDetails };

        try {
            const updateResponse = await fetch(`/locationManagement/patchLocation/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            const updateResult = await updateResponse.json();
            if (updateResponse.ok) {
                alert('Location updated successfully!');
                loadLocations(); // Refresh the table
                // Reset form and hide the dialog
                document.getElementById('editLocationForm').reset();
                editDialog.classList.add('hidden');
            } else {
                alert(updateResult.error || 'Failed to update location.');
            }
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    // Cancel action
    const cancelHandler = () => {
        editDialog.classList.add('hidden');
        saveButton.removeEventListener('click', saveHandler);
        cancelButton.removeEventListener('click', cancelHandler);
    };

    saveButton.addEventListener('click', saveHandler);
    cancelButton.addEventListener('click', cancelHandler);
}


// Delete a location
async function deleteLocation(id) {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
        const response = await fetch(`/locationManagement/deleteLocation/${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (response.ok) {
            alert('Location deleted successfully!');
            loadLocations(); // Refresh the table
        } else {
            alert(result.error || 'Failed to delete location.');
        }
    } catch (error) {
        console.error('Error deleting location:', error);
    }
}
