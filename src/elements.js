'use strict';

import { differenceInMinutesWithOptions } from 'date-fns/fp';
import { DataBase, Project, Task } from './storage';

class TaskElements {
  static completedTask = document.querySelector('#completed-tasks-list');
  static taskContainer = document.querySelector('#task-items');

  static createTaskElement(
    name,
    note,
    parentProject,
    dueDate,
    statusCompleted
  ) {
    const newInstance = new Task(
      name,
      note,
      parentProject,
      dueDate,
      statusCompleted
    );

    const taskItem = document.createElement('div');
    const taskContent = document.createElement('div');
    const taskTitle = document.createElement('p');
    const actionsContainer = document.createElement('div');
    const noteContent = document.createElement('div');
    const checkBtn = document.createElement('span');
    const deleteBtn = document.createElement('span');
    const editBtn = document.createElement('span');
    const expandMoreBtn = document.createElement('span');

    taskTitle.textContent = name;
    noteContent.textContent = note;
    taskTitle.classList.add('task-title');
    checkBtn.textContent = 'done';
    deleteBtn.textContent = 'delete_sweep';
    editBtn.textContent = 'edit';
    expandMoreBtn.textContent = 'expand_more';

    taskItem.classList.add('task-item');
    taskContent.classList.add('task-content');
    taskTitle.classList.add('task-title');
    actionsContainer.classList.add('actions');
    noteContent.classList.add('note-content');
    expandMoreBtn.classList.add(
      'material-icons-outlined',
      'btn-expand',
      'btn-action'
    );
    checkBtn.classList.add(
      'material-icons-outlined',
      'btn-check',
      'btn-action'
    );
    deleteBtn.classList.add(
      'material-icons-outlined',
      'btn-delete',
      'btn-action'
    );
    editBtn.classList.add('material-icons-outlined', 'btn-edit', 'btn-action');

    actionsContainer.append(checkBtn, deleteBtn, editBtn, expandMoreBtn);
    taskContent.append(taskTitle, actionsContainer);
    taskItem.append(taskContent, noteContent);
    this.taskContainer.append(taskItem);

    return newInstance;
  }

  static checkInput(name, note, parentProject, dueDate, statusCompleted) {
    const taskName = document.querySelector('#task-name');
    if (taskName.value !== '' && taskName.value !== ' ') {
      Task.linkToProject(
        this.createTaskElement(
          name,
          note,
          parentProject,
          dueDate,
          statusCompleted
        ),
        DataBase.returnProject(DataBase.returnIndex(parentProject))
      );
      DataBase.updateDB();
    }
  }
}

class ProjectElements {
  static projectCounter = 0;
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
    container.classList.add('projects', 'section');
    deleteIcon.classList.add('material-icons-outlined', 'delete-btn');
    deleteIcon.textContent = 'delete_sweep';
    container.dataset.project = this.projectCounter++;
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
}

const UserInterface = (function () {
  const _taskContainer = document.querySelector('#task-items');
  const _currentSection = document.querySelector('#section-name');
  const _insertSelect = document.querySelector('#insert-select');
  const _displayGroups = [_todayGroup, _thisWeek, _projects];

  (function _displayOnLoad() {
    DataBase.projectList.forEach((el) => {
      ProjectElements.createHTMLList(el);
    });
    _todayGroup();
  })();

  function _clearTaskContainer() {
    _taskContainer.textContent = '';
  }

  function _displayProject(e) {
    _clearTaskContainer();
    let projectNumber;
    e.target.dataset.project
      ? (projectNumber = e.target.dataset.project)
      : (projectNumber = e.target.parentElement.dataset.project);
    if (projectNumber) {
      DataBase.returnProject(projectNumber).tasksContainer.forEach((task) => {
        TaskElements.createTaskElement(
          task.name,
          task.note,
          task.parentProject,
          task.dueDate
        );
      });
    }
    // ! Refactor
    if (e.target.dataset.group) {
      _displayGroups[e.target.dataset.group]();
    }
  }

  function _todayGroup() {
    DataBase.todayTasks().forEach((task) => {
      TaskElements.createTaskElement(
        task.name,
        task.note,
        task.parentProject,
        task.dueDate
      );
    });
  }

  function _thisWeek() {
    console.log('This week');
  }

  function _projects() {
    console.log('Proyects');
  }

  function _deleteClass(element) {
    element.forEach((html) => {
      html.classList.remove(`selected`);
    });
  }

  function _updateName(e) {
    // ! Refactor
    _currentSection.textContent = e.target.childNodes[0].textContent;
  }

  function removeProject(e) {
    if (e.target.matches('.delete-btn')) {
      DataBase.removeProject(e.target.parentElement.childNodes[0].textContent);
      e.target.parentElement.remove();
    }
    // ! Refactor
    _currentSection.textContent = 'Today';
  }

  function selectSection(e) {
    let allSections = document.querySelectorAll('.section');
    _deleteClass(allSections);
    if (e.target.nodeName !== 'SPAN') {
      if (e.target.classList.contains('section')) {
        e.target.classList.add('selected');
        _updateName(e);
        _displayProject(e);
      } else if (e.target.parentElement.classList.contains('section')) {
        e.target.parentElement.classList.add('selected');
        _updateName(e);
        _displayProject(e);
      }
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

  function checkRadioBtn() {
    const _radioBtn = document.querySelectorAll('.radio-input');
    let selectedBtn;
    _radioBtn.forEach((radioBtn) => {
      if (radioBtn.checked) {
        selectedBtn = radioBtn;
      }
    });
    if (selectedBtn.value === 'completed') {
      return true;
    } else {
      return false;
    }
  }

  function _changeTaskStatus(e) {}

  function _deleteTask(e) {}

  function _editTask(e) {}

  function _showTaskNote(e) {}

  function actionButtons(e) {
    switch (e.target.classList[1]) {
      case 'btn-check':
        _changeTaskStatus(e);
        break;
      case 'btn-delete':
        _deleteTask(e);
        break;
      case 'btn-edit':
        _editTask(e);
        break;
      case 'btn-expand':
        _showTaskNote(e);
        break;
    }
  }

  return {
    removeProject,
    selectSection,
    createSelectElement,
    checkRadioBtn,
    actionButtons,
  };
})();

export { UserInterface, ProjectElements, TaskElements };
