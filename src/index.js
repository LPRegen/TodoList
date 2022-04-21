import './style.css';

import { UserInterface, ProjectElements, TaskElements } from './elements.js';

const Events = (function () {
  const _createProjectBtn = document.querySelector('.new-project');
  const _projectElements = document.querySelector('#project-container');
  const _modalTask = document.querySelector('#modal');
  const _addTaskBtn = document.querySelector('#new-task');
  const _cancelTask = document.querySelector('#cancel-task');
  const _saveTask = document.querySelector('#submit-task');
  const _sideBar = document.querySelector('#side-bar');
  const _taskItemsContainer = document.querySelector('#task-items');
  const _insertSelect = document.querySelector('#insert-select');
  const inputs = document.querySelectorAll('.task-input');

  _sideBar.addEventListener('click', (e) => {
    UserInterface.selectSection(e);
  });

  _createProjectBtn.addEventListener('click', () => {
    ProjectElements.createFromInput();
  });

  _projectElements.addEventListener('click', (e) => {
    UserInterface.removeProject(e);
  });

  _addTaskBtn.addEventListener('click', function () {
    inputs.forEach((input) => (input.value = ''));
    let taskName = document.querySelector('#task-name');
    _modalTask.style.display = 'block';
    _insertSelect.style.display = 'block';
    UserInterface.createSelectElement();
    taskName.focus();
  });

  _cancelTask.addEventListener('click', () => {
    const _selectElement = document.querySelector('#all-projects');
    _modalTask.style.display = 'none';
    if (_selectElement) _selectElement.remove();
    if (document.querySelector('#edit-task'))
      document.querySelector('#edit-task').replaceWith(_saveTask);
  });

  _saveTask.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.task-input');
    const _parentProjectInput = document.querySelector('#all-projects');
    // ! Change the order of parameters/arguments to use the spread operator.
    TaskElements.checkInput(
      inputs[0].value,
      inputs[3].value,
      inputs[1].value,
      inputs[2].value,
      UserInterface.checkRadioBtn()
    );
    _modalTask.style.display = 'none';
    _parentProjectInput.remove();
  });

  _taskItemsContainer.addEventListener('click', (e) => {
    UserInterface.actionButtons(e);
    UserInterface.selectProject(e);
  });
})();
