const mayaTasks = [...document.querySelectorAll('.maya-task')];
const cub = document.querySelector('.cub-dragger');
const dropZones = [...document.querySelectorAll('.drop-zone')];
const instructions = document.querySelector('#handoff-instructions');
const status = document.querySelector('.handoff-status');

const mayaFinished = () => mayaTasks.every((task) => task.checked);

function updateCubState() {
  const ready = mayaFinished();
  cub.classList.toggle('is-ready', ready);
  instructions.textContent = ready
    ? 'Maya’s tasks are complete. Drag the project cub to Jordan or Alex.'
    : 'Finish Maya’s two tasks, then drag the project cub to Jordan or Alex.';
  if (!ready) status.textContent = '';
}

function handoff(target) {
  if (!mayaFinished()) {
    status.textContent = 'Finish Maya’s two tasks first.';
    return;
  }
  dropZones.forEach((zone) => {
    zone.classList.remove('notified');
    zone.querySelector('p').textContent = 'Drop the cub here';
  });
  target.classList.add('notified');
  target.querySelector('p').textContent = 'Maya finished — you’re notified';
  status.textContent = `Project cub passed to ${target.dataset.name}.`;
  instructions.textContent = `${target.dataset.name} has the project cub and can continue the work.`;
}

mayaTasks.forEach((task) => task.addEventListener('change', updateCubState));
cub.addEventListener('dragstart', (event) => {
  if (!mayaFinished()) {
    event.preventDefault();
    status.textContent = 'Finish Maya’s two tasks first.';
    return;
  }
  event.dataTransfer.setData('text/plain', 'project-cub');
  event.dataTransfer.effectAllowed = 'move';
});
cub.addEventListener('click', () => {
  status.textContent = mayaFinished()
    ? 'Choose Jordan or Alex to receive the project cub.'
    : 'Finish Maya’s two tasks first.';
});
dropZones.forEach((zone) => {
  zone.addEventListener('dragover', (event) => {
    if (!mayaFinished()) return;
    event.preventDefault();
    zone.classList.add('is-over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('is-over'));
  zone.addEventListener('drop', (event) => {
    event.preventDefault();
    zone.classList.remove('is-over');
    handoff(zone);
  });
  zone.addEventListener('click', (event) => {
    if (event.target.closest('.todo-item')) return;
    handoff(zone);
  });
  zone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handoff(zone);
    }
  });
});

updateCubState();
