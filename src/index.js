import './style.css';

import { UserInterface, ProjectElements } from './elements.js';

const Events = (function () {
  const _createProjectBtn = document.querySelector('#create-project');
  const _projectElements = document.querySelector('#project-container');

  _createProjectBtn.addEventListener('click', () => {
    ProjectElements.createFromInput();
  });

  _projectElements.addEventListener('click', (e) => {
    UserInterface.removeProject(e);
  });

  _projectElements.addEventListener('click', (e) => {
    let allProjects = Array.from(document.querySelectorAll('.projects'));
    allProjects.forEach((project) => {
      project.classList.remove('selected-project');
    });
    UserInterface.selectProject(e);
  });
})();
