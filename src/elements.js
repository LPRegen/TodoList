'use strict';

import parseISO from 'date-fns/parseISO';
import { formatISO, differenceInDays } from 'date-fns';
import { Storage } from './storage';

class Project {
  static #counter = 0;

  constructor(name) {
    this.name = name;
    this.creationDate = formatISO(new Date(), { representation: 'date' });
    this.id = Project.#counter++;
    this.uncompleteTasks = [];
    this.completeTask = [];
  }

  hasExpired() {
    if (
      differenceInDays(parseISO(this.dueDate), parseISO(this.creationDate)) <=
      -1
    ) {
      console.log('has expired');
    } else {
      console.log('still available');
    }
  }
}

class Task extends Project {
  static #counter = 0;

  constructor(name, note, parentProject) {
    super(name);
    this.id = Task.#counter++;
    this.note = note;
    this.parentProject = parentProject;
  }

  storeNote() {
    this.parentProject.tasks.push(this);
  }
}

const CreateElements = (function () {
  const createProjectInstance = function () {
    const projectContainer = document.querySelector('#project-container');
    let projectInput = document.createElement('input');
    projectInput.type = 'text';
    projectInput.id = 'project-name';
    projectContainer.insertAdjacentElement('afterbegin', projectInput);
    projectInput.focus();
    projectInput.onblur = function () {
      if (projectInput.value !== '' && projectInput.value !== ' ') {
        const project = new Project(projectInput.value);
        Storage.addItem(project);

        const newProjectContainer = document.createElement('div');
        const projectName = document.createElement('p');
        projectName.textContent = projectInput.value;
        newProjectContainer.classList.add('projects');
        newProjectContainer.append(projectName);
        projectContainer.insertAdjacentElement(
          'afterbegin',
          newProjectContainer
        );
        projectInput.value = '';
      }
      projectInput.remove();
    };
  };

  return {
    createProjectInstance,
  };
})();

export { CreateElements };
