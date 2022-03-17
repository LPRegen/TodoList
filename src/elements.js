'use strict';

import { add } from 'date-fns';
import { differenceInMinutesWithOptions } from 'date-fns/fp';
import { DataBase, Project, Task } from './storage';

class ProjectElements {
  static projectList = document.querySelector('#project-container');

  static createInput() {
    let input = document.createElement('input');
    input.type = 'text';
    input.id = 'project-name';
    ProjectElements.projectList.insertAdjacentElement('beforeend', input);
    input.focus();
    return {
      input,
    };
  }

  static createHTMLList(name) {
    const container = document.createElement('div');
    const title = document.createElement('p');
    const deleteIcon = document.createElement('span');
    container.classList.add('projects');
    deleteIcon.classList.add('material-icons-outlined', 'delete-btn');
    deleteIcon.textContent = 'delete_sweep';
    container.append(title, deleteIcon);
    title.textContent = name;
    ProjectElements.projectList.insertAdjacentElement('beforeend', container);
  }

  static createFromInput() {
    let projectInput = ProjectElements.createInput().input;
    projectInput.onblur = () => {
      if (
        projectInput.value !== '' &&
        projectInput.value !== ' ' &&
        !DataBase.isDuplicated(projectInput.value)
      ) {
        let newProject = new Project(projectInput.value);
        DataBase.addProject(newProject);
        ProjectElements.createHTMLList(newProject.name);
      }
      projectInput.remove();
    };
  }

  static displayOnLoad() {
    DataBase.projectList.forEach((el) => {
      ProjectElements.createHTMLList(el);
    });
  }
}

ProjectElements.displayOnLoad();

const UserInterface = (function () {
  let _currentProject;

  function _displayAddTaskBtn() {
    const addTaskBtn = document.querySelector('#new-task');
    addTaskBtn.style.visibility = 'visible';
  }

  function removeProject(e) {
    if (e.target.matches('.delete-btn')) {
      e.target.parentElement.remove();
      DataBase.removeProject(e.target.parentElement.childNodes[0].textContent);
    }
    this.updateProjectName('Today');
  }

  function selectProject(e) {
    if (e.target.classList.contains('projects')) {
      e.target.classList.add('selected-project');
      _currentProject = e.target.childNodes[0].textContent;
    }

    if (e.target.parentElement.classList.contains('projects')) {
      e.target.parentElement.classList.add('selected-project');
      _currentProject = e.target.textContent;
    }
  }

  function updateProjectName(name = _currentProject) {
    const projectTitle = document.querySelector('#project-name');
    projectTitle.textContent = name;
    _displayAddTaskBtn();
  }

  return {
    removeProject,
    selectProject,
    updateProjectName,
  };
})();

export { UserInterface, ProjectElements };
