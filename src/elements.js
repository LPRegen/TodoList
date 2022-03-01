'use strict';

import parseISO from 'date-fns/parseISO';
import { formatISO, differenceInDays } from 'date-fns';
import { Storage } from './storage';

class Project {
  constructor(name) {
    this.name = name;
    this.creationDate = formatISO(new Date(), { representation: 'date' });
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
  constructor(name, note, parentProject) {
    super(name);
    this.note = note;
    this.parentProject = parentProject;
  }

  storeNote() {
    this.parentProject.tasks.push(this);
  }
}

const CreateElements = (function () {
  let _projectCount = 0;
  const _projectList = document.querySelector('#project-container');

  function _projectHTML(name) {
    let projectContainer = document.createElement('div');
    let projectName = document.createElement('p');
    projectContainer.dataset.projectCount = _projectCount++;
    projectName.textContent = name;
    projectContainer.classList.add('projects');
    projectContainer.append(projectName);
    _projectList.insertAdjacentElement('beforeend', projectContainer);
  }

  (function _readStorage() {
    Storage.showProjects().forEach((project) => {
      _projectHTML(project.name);
    });
  })();

  const createProjectInstance = function () {
    let projectInput = document.createElement('input');
    projectInput.type = 'text';
    projectInput.id = 'project-name';
    _projectList.insertAdjacentElement('beforeend', projectInput);
    projectInput.focus();
    projectInput.onblur = function () {
      if (projectInput.value !== '' && projectInput.value !== ' ') {
        const project = new Project(projectInput.value);
        Storage.addItem(project);
        _projectHTML(projectInput.value);
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
