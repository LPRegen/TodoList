'use strict';

import { differenceInMinutesWithOptions } from 'date-fns/fp';
import { DataBase, Project, Task } from './storage';

class ProjectElements {
  static projectList = document.querySelector('#project-container');

  static createInput() {
    let input = document.createElement('input');
    input.type = 'text';
    input.id = 'project-name';
    ProjectElements.projectList.insertAdjacentElement('afterbegin', input);
    input.focus();
    return {
      input,
    };
  }

  static createHTML(name) {
    const container = document.createElement('div');
    const title = document.createElement('p');
    container.classList.add('projects');
    container.append(title);
    title.textContent = name;
    ProjectElements.projectList.insertAdjacentElement('afterbegin', container);
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
        ProjectElements.createHTML(newProject.name);
      }
      projectInput.remove();
    };
  }

  static displayOnLoad() {
    DataBase.projectList.forEach((el) => {
      this.createHTML(el);
    });
  }
}

ProjectElements.displayOnLoad();

export { ProjectElements };
