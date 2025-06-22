document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = "studentProjectTrackerData";
    const studentButtons = document.querySelectorAll('.student-btn');
    const overlay = document.getElementById('student-data-overlay');
    const closeOverlay = document.getElementById('close-overlay');
    const selectedStudentName = document.getElementById('selected-student-name');
    const studentDataBody = document.getElementById('student-data-body');
    
    // Sample initial data structure
    const initialData = {
        "Marco Antonio Prepotente": [],
        "Dexshielane Perdigones": [],
        "Aerielle Kate Berja": [],
        "Shyra Encinas": [],
        "Michelle Kayly Vermillio": [],
        "Angie Divinaflor": [],
        "Don Carlos Dacir": []
    };
    
    // Load student data from localStorage
    let allStudentData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialData;
    
    // Set up event listeners for student buttons
    studentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const studentName = this.getAttribute('data-student');
            showStudentData(studentName);
        });
    });
    
    // Close overlay button
    closeOverlay.addEventListener('click', function() {
        closeOverlayFunc();
    });
    
    // Close overlay when clicking outside content
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeOverlayFunc();
        }
    });
    
    function showStudentData(studentName) {
        selectedStudentName.textContent = `${studentName}'s Submission History`;
        displayStudentData(studentName);
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    function closeOverlayFunc() {
        overlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    
    function displayStudentData(studentName) {
        studentDataBody.innerHTML = '';
        
        const studentRecords = allStudentData[studentName] || [];
        
        if (studentRecords.length === 0) {
            const row = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 3;
            emptyCell.className = 'empty-message';
            emptyCell.textContent = 'No submissions yet';
            row.appendChild(emptyCell);
            studentDataBody.appendChild(row);
            return;
        }
        
        // Sort by date (newest first)
        studentRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        studentRecords.forEach((record, index) => {
            const row = document.createElement('tr');
            
            // Date cell
            const dateCell = document.createElement('td');
            dateCell.textContent = formatDate(record.date);
            row.appendChild(dateCell);
            
            // Status cell
            const statusCell = document.createElement('td');
            const statusBadge = document.createElement('span');
            statusBadge.textContent = record.status === "GaveProject" ? "Submitted" : "Not Submitted";
            statusBadge.className = record.status === "GaveProject" ? "status-present" : "status-absent";
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);
            
            // Action cell
            const actionCell = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.className = 'delete-btn';
            deleteBtn.title = 'Delete this entry';
            deleteBtn.addEventListener('click', function() {
                if (confirm(`Delete submission record for ${formatDate(record.date)}?`)) {
                    deleteRecord(studentName, index);
                }
            });
            actionCell.appendChild(deleteBtn);
            row.appendChild(actionCell);
            
            studentDataBody.appendChild(row);
        });
    }
    
    function deleteRecord(studentName, index) {
        allStudentData[studentName].splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allStudentData));
        displayStudentData(studentName);
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Initialize with empty data structure if none exists
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
});
