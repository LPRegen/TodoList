import './style.css';

import { UserInterface, ProjectElements } from './elements.js';

const Events = (function () {
  const _createProjectBtn = document.querySelector('#create-project');
  const _projectElements = document.querySelector('#project-container');
  const _sbCategories = document.querySelector('.sidebar-categories');

  _createProjectBtn.addEventListener('click', () => {
    ProjectElements.createFromInput();
  });

  _projectElements.addEventListener('click', (e) => {
    UserInterface.removeProject(e);
    UserInterface.selectGroup(e);
  });

  _projectElements.addEventListener('click', (e) => {
    UserInterface.selectProject(e);
  });

  _sbCategories.addEventListener('click', (e) => {
    UserInterface.selectGroup(e);
  });
})();
