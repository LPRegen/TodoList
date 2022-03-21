import './style.css';

import { UserInterface, ProjectElements, TaskElements } from './elements.js';

const Events = (function () {
  const _createProjectBtn = document.querySelector('#create-project');
  const _projectElements = document.querySelector('#project-container');
  const _sbCategories = document.querySelector('.sidebar-categories');
  const _modalTask = document.querySelector('#modal');
  const _addTaskBtn = document.querySelector('#new-task');
  const _cancelTask = document.querySelector('#cancel-task');
  const _saveTask = document.querySelector('#submit-task');

  _createProjectBtn.addEventListener('click', () => {
    ProjectElements.createFromInput();
  });

  _projectElements.addEventListener('click', (e) => {
    UserInterface.removeProject(e);
    UserInterface.selectProject(e);
  });

  _sbCategories.addEventListener('click', (e) => {
    UserInterface.selectGroup(e);
  });

  _addTaskBtn.addEventListener('click', function () {
    _modalTask.style.display = 'block';
    UserInterface.createSelectElement();
  });

  _cancelTask.addEventListener('click', (e) => {
    e.preventDefault();
    const _selectElement = document.querySelector('#all-projects');

    _modalTask.style.display = 'none';
    _selectElement.remove();
  });

  _saveTask.addEventListener('click', (e) => {
    const _taskName = document.querySelector('#task-name');
    const _parentProject = document.querySelector('#all-projects');
    const _dueDate = document.querySelector('#task-date');
    const _note = document.querySelector('#task-note');

    TaskElements.checkInput(
      _taskName.value,
      _note.value,
      _parentProject.value,
      _dueDate.value
    );

    _modalTask.style.display = 'none';
    _parentProject.remove();
  });
})();
