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

  static createHTMLProject() {
    let projectInput = ProjectElements.createInput().input;
    projectInput.onblur = () => {
      if (
        projectInput.value !== '' &&
        projectInput.value !== ' ' &&
        !DataBase.isDuplicated(projectInput.value)
      ) {
        let newProject = new Project(projectInput.value);
        DataBase.addProject(newProject);
        const container = document.createElement('div');
        const title = document.createElement('p');
        container.classList.add('projects');
        container.append(title);
        console.log(newProject);
        title.textContent = newProject.name;
        ProjectElements.projectList.insertAdjacentElement(
          'afterbegin',
          container
        );
      }
      projectInput.remove();
    };
  }
}

export { ProjectElements };
