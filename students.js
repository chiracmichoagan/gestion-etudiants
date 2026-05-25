const STORAGE_KEY = 'gestionEtudiants';

const studentForm = document.getElementById('student-form');
const studentsTable = document.getElementById('students-table');
const studentsTableBody = studentsTable.querySelector('tbody');
const listMessage = document.getElementById('list-message');
const formStatus = document.getElementById('form-status');

let students = loadStudents();
renderStudents();

studentForm.addEventListener('submit', handleFormSubmit);

function loadStudents() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.warn('Impossible de lire les étudiants depuis localStorage.', error);
        return [];
    }
}

function saveStudents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function renderStudents() {
    studentsTableBody.innerHTML = '';

    if (students.length === 0) {
        studentsTable.classList.add('hidden');
        listMessage.textContent = 'Aucun étudiant ajouté pour le moment.';
        listMessage.classList.remove('hidden');
        return;
    }

    listMessage.classList.add('hidden');
    studentsTable.classList.remove('hidden');

    students.forEach((student, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${escapeHtml(student.nom)}</td>
            <td>${escapeHtml(student.prenom)}</td>
            <td>${escapeHtml(student.email)}</td>
            <td>${escapeHtml(student.age.toString())}</td>
            <td>${escapeHtml(student.classe)}</td>
            <td class="actions-column">
                <button type="button" class="delete-button" data-index="${index}">Supprimer</button>
            </td>
        `;

        const deleteButton = row.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => deleteStudent(index));

        studentsTableBody.appendChild(row);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(studentForm);
    const nom = formData.get('nom').trim();
    const prenom = formData.get('prenom').trim();
    const email = formData.get('email').trim();
    const ageValue = formData.get('age').trim();
    const classe = formData.get('classe').trim();

    if (!nom || !prenom || !email || !ageValue || !classe) {
        showFormStatus('Veuillez compléter tous les champs.', 'error');
        return;
    }

    const age = Number(ageValue);
    if (!Number.isInteger(age) || age < 10 || age > 100) {
        showFormStatus('Veuillez indiquer un âge valide entre 10 et 100.', 'error');
        return;
    }

    const newStudent = { nom, prenom, email, age, classe };
    students.push(newStudent);
    saveStudents();
    renderStudents();
    studentForm.reset();
    showFormStatus('Étudiant ajouté avec succès.', 'success');
}

function deleteStudent(index) {
    students.splice(index, 1);
    saveStudents();
    renderStudents();
    showFormStatus('Étudiant supprimé.', 'success');
}

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
    }, 4000);
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
