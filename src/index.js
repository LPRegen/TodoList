import './style.css';

import { UserInterface, ProjectElements, TaskElements } from './elements.js';

const Events = (function () {
  const _createProjectBtn = document.querySelector('#create-project');
  const _projectElements = document.querySelector('#project-container');
  const _modalTask = document.querySelector('#modal');
  const _addTaskBtn = document.querySelector('#new-task');
  const _cancelTask = document.querySelector('#cancel-task');
  const _saveTask = document.querySelector('#submit-task');
  const _sideBar = document.querySelector('#side-bar');

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

    inputs.forEach((input) => (input.value = ''));

    _modalTask.style.display = 'none';
    _parentProjectInput.remove();
  });
})();
