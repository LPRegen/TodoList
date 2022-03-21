'use strict';

import { add } from 'date-fns';
import { differenceInMinutesWithOptions } from 'date-fns/fp';
import { DataBase, Project, Task } from './storage';

class TaskElements {
  static completedTask = document.querySelector('#completed-tasks-list');
  static uncompletedTask = document.querySelector('#uncompleted-tasks-list');

  static createTaskElement(name, note, parentProject, dueDate) {
    const newInstance = new Task(name, note, parentProject, dueDate);

    const taskItem = document.createElement('div');
    const taskContent = document.createElement('div');
    const taskTitle = document.createElement('p');
    const actionsContainer = document.createElement('div');
    const noteContent = document.createElement('div');
    const checkBtn = document.createElement('span');
    const deleteBtn = document.createElement('span');
    const noteBtn = document.createElement('span');
    const expandMoreBtn = document.createElement('span');

    taskTitle.textContent = name;
    noteContent.textContent = note;
    taskTitle.classList.add('task-title');
    checkBtn.textContent = 'done';
    deleteBtn.textContent = 'delete_sweep';
    noteBtn.textContent = 'description';
    expandMoreBtn.textContent = 'expand_more';

    taskItem.classList.add('task-item');
    taskContent.classList.add('task-content');
    taskTitle.classList.add('task-title');
    actionsContainer.classList.add('actions');
    noteContent.classList.add('note-content');
    expandMoreBtn.classList.add('material-icons-outlined', 'btn-action');
    checkBtn.classList.add('material-icons-outlined', 'btn-action');
    deleteBtn.classList.add('material-icons-outlined', 'btn-action');
    noteBtn.classList.add('material-icons-outlined', 'btn-action');

    actionsContainer.append(checkBtn, deleteBtn, noteBtn, expandMoreBtn);
    taskContent.append(taskTitle, actionsContainer);
    taskItem.append(taskContent, noteContent);
    this.uncompletedTask.append(taskItem);

    return newInstance;
  }

  static checkInput(name, note, parentProject, dueDate) {
    const taskName = document.querySelector('#task-name');
    if (taskName.value !== '' && taskName.value !== ' ') {
      Task.linkToProject(
        this.createTaskElement(name, note, parentProject, dueDate),
        DataBase.returnProject(DataBase.returnIndex(parentProject))
      );
      DataBase.updateDB();
    }
  }
}

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
  const _currentProject = document.querySelector('#project-name');
  const _insertSelect = document.querySelector('#insert-select');

  function _deleteSelectedProjectClass() {
    let allProjects = document.querySelectorAll('.projects');
    allProjects.forEach((element) => {
      element.classList.remove('selected-project');
    });
  }

  function _updateName(e) {
    _currentProject.textContent = e.target.childNodes[0].textContent;
  }

  function removeProject(e) {
    if (e.target.matches('.delete-btn')) {
      DataBase.removeProject(e.target.parentElement.childNodes[0].textContent);
      e.target.parentElement.remove();
    }
    _currentProject.textContent = 'Today';
  }

  function selectProject(e) {
    _deleteSelectedProjectClass();
    if (e.target.classList.contains('projects')) {
      e.target.classList.add('selected-project');
      _updateName(e);
    } else if (
      e.target.parentElement.classList.contains('projects') &&
      e.target.nodeName !== 'SPAN'
    ) {
      e.target.parentElement.classList.add('selected-project');
      _updateName(e);
    }
  }

  function selectGroup(e) {
    _deleteSelectedProjectClass();
    if (e.target.matches('.sb-groups')) {
      _currentProject.textContent = e.target.textContent;
    }
  }

  function createSelectElement() {
    const selectElement = document.createElement('select');
    selectElement.name = 'select-project';
    selectElement.id = 'all-projects';
    selectElement.classList.add('task-input');
    DataBase.projectList.forEach((project) => {
      const optionElement = document.createElement('option');
      optionElement.value = `${project}`;
      optionElement.textContent = `${project}`;
      selectElement.append(optionElement);
    });
    _insertSelect.after(selectElement);
  }

  return {
    removeProject,
    selectProject,
    selectGroup,
    createSelectElement,
  };
})();

export { UserInterface, ProjectElements, TaskElements };
