// Student Management System demo (add, view, update, delete, search)
var students = [
  { id: 1, roll: 'CS101', name: 'Meena R', course: 'B.Sc. Computer Science' },
  { id: 2, roll: 'CS102', name: 'Karthik S', course: 'B.Sc. Computer Science' },
  { id: 3, roll: 'MA201', name: 'Divya P', course: 'B.Sc. Mathematics' }
];
var editingId = null;

var form = document.getElementById('student-form');
var fRoll = document.getElementById('f-roll');
var fName = document.getElementById('f-name');
var fCourse = document.getElementById('f-course');
var errorEl = document.getElementById('form-error');
var formTitle = document.getElementById('form-title');
var submitBtn = document.getElementById('submit-btn');
var cancelBtn = document.getElementById('cancel-btn');
var searchEl = document.getElementById('search');
var recordsEl = document.getElementById('records');
var emptyEl = document.getElementById('empty');
var recordsTitle = document.getElementById('records-title');

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = !msg;
}

function resetForm() {
  editingId = null;
  fRoll.value = '';
  fName.value = '';
  fCourse.value = '';
  formTitle.textContent = 'Add student';
  submitBtn.textContent = 'Add student';
  cancelBtn.hidden = true;
  showError('');
}

function render() {
  var q = searchEl.value.trim().toLowerCase();
  var shown = students.filter(function (s) {
    return !q || s.name.toLowerCase().indexOf(q) !== -1 || s.roll.toLowerCase().indexOf(q) !== -1;
  });

  recordsTitle.textContent = 'Records (' + students.length + ')';
  recordsEl.innerHTML = '';

  if (shown.length === 0) {
    emptyEl.hidden = false;
    emptyEl.textContent = students.length
      ? 'No student matches that search.'
      : 'No records yet. Add a student to begin.';
    return;
  }
  emptyEl.hidden = true;

  shown.forEach(function (s) {
    var li = document.createElement('li');
    if (s.id === editingId) li.className = 'active';

    var info = document.createElement('div');
    var strong = document.createElement('strong');
    strong.textContent = s.name;
    var span = document.createElement('span');
    span.textContent = s.roll + ' · ' + s.course;
    info.appendChild(strong);
    info.appendChild(span);

    var actions = document.createElement('div');
    actions.className = 'row';
    var editBtn = document.createElement('button');
    editBtn.className = 'link';
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', function () { startEdit(s.id); });
    var delBtn = document.createElement('button');
    delBtn.className = 'link danger';
    delBtn.type = 'button';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', function () { removeStudent(s.id); });
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(info);
    li.appendChild(actions);
    recordsEl.appendChild(li);
  });
}

function startEdit(id) {
  var s = students.filter(function (x) { return x.id === id; })[0];
  if (!s) return;
  editingId = id;
  fRoll.value = s.roll;
  fName.value = s.name;
  fCourse.value = s.course;
  formTitle.textContent = 'Update student';
  submitBtn.textContent = 'Save changes';
  cancelBtn.hidden = false;
  showError('');
  render();
}

function removeStudent(id) {
  students = students.filter(function (x) { return x.id !== id; });
  if (editingId === id) resetForm();
  render();
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var roll = fRoll.value.trim().toUpperCase();
  var name = fName.value.trim();
  var course = fCourse.value.trim();

  if (!roll || !name || !course) {
    showError('Fill in roll number, name and course.');
    return;
  }
  var duplicate = students.some(function (s) { return s.roll === roll && s.id !== editingId; });
  if (duplicate) {
    showError('Roll number ' + roll + ' already exists.');
    return;
  }

  if (editingId) {
    students = students.map(function (s) {
      return s.id === editingId ? { id: s.id, roll: roll, name: name, course: course } : s;
    });
  } else {
    students.push({ id: Date.now(), roll: roll, name: name, course: course });
  }
  resetForm();
  render();
});

cancelBtn.addEventListener('click', function () { resetForm(); render(); });
searchEl.addEventListener('input', render);

document.getElementById('year').textContent = new Date().getFullYear();
render();
