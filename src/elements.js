'use strict';

import { DataBase, Project, Task } from './storage';
import formatISO from 'date-fns/formatISO';

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
    const _currentSection = document.querySelector('#section-name');
    const _todayDate = formatISO(new Date(), { representation: 'date' });
    const taskItem = document.createElement('div');
    const taskContent = document.createElement('div');
    const taskTitle = document.createElement('p');
    const actionsContainer = document.createElement('div');
    const noteContent = document.createElement('div');
    const infoContainer = document.createElement('div');
    const creationDate = document.createElement('p');
    const displayDueDate = document.createElement('p');
    const checkBtn = document.createElement('span');
    const deleteBtn = document.createElement('span');
    const expandMoreBtn = document.createElement('span');

    taskTitle.textContent = name;
    noteContent.textContent = note;
    checkBtn.textContent = 'done';
    deleteBtn.textContent = 'delete_sweep';
    expandMoreBtn.textContent = 'expand_more';
    creationDate.textContent = `Creation date: ${newInstance.creationDate}`;
    displayDueDate.textContent = `Due date: ${newInstance.dueDate}`;

    taskItem.classList.add('task-item');
    taskContent.classList.add('task-content');
    if (statusCompleted === true) taskContent.classList.add('completed-task');
    taskTitle.classList.add('task-title');
    actionsContainer.classList.add('actions');
    noteContent.classList.add('note-content');
    infoContainer.classList.add('info-container');
    creationDate.classList.add('creation-date');
    displayDueDate.classList.add('due-date');
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

    if (_currentSection.textContent !== 'Today') {
      const editBtn = document.createElement('span');
      editBtn.textContent = 'edit';
      editBtn.classList.add(
        'material-icons-outlined',
        'btn-edit',
        'btn-action'
      );
      actionsContainer.append(checkBtn, deleteBtn, editBtn, expandMoreBtn);
    }

    actionsContainer.append(checkBtn, deleteBtn, expandMoreBtn);
    infoContainer.append(displayDueDate, creationDate);
    noteContent.append(infoContainer);
    taskContent.append(taskTitle, actionsContainer);
    taskItem.append(taskContent, noteContent);

    if (_currentSection.textContent === 'Today') {
      actionsContainer.dataset.parent = newInstance.parentProject;
      if (
        newInstance.dueDate === _todayDate &&
        newInstance.statusCompleted === true
      ) {
        this.taskContainer.insertAdjacentElement('beforeend', taskItem);
      } else if (
        newInstance.dueDate === _todayDate &&
        newInstance.statusCompleted === false
      ) {
        this.taskContainer.insertAdjacentElement('afterbegin', taskItem);
      }
    } else {
      newInstance.statusCompleted === true
        ? this.taskContainer.insertAdjacentElement('beforeend', taskItem)
        : this.taskContainer.insertAdjacentElement('afterbegin', taskItem);
    }
    return newInstance;
  }

  static checkInput(name, note, parentProject, dueDate, statusCompleted) {
    const taskName = document.querySelector('#task-name').value.trim();
    const project = DataBase.returnProject(parentProject);
    if (taskName !== '' && !Project.checkDuplicate(project, taskName)) {
      Task.linkToProject(
        this.createTaskElement(
          name,
          note,
          parentProject,
          dueDate,
          statusCompleted
        ),
        project
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
    container.classList.add('projects', 'section');
    container.append(title);
    title.textContent = name;
    ProjectElements.projectList.insertAdjacentElement('beforeend', container);
  }

  static createFromInput() {
    let projectInput = ProjectElements.createInput().input;
    projectInput.onblur = () => {
      if (
        projectInput.value.trim() !== '' &&
        !DataBase.isDuplicated(projectInput.value)
      ) {
        let newProject = new Project(projectInput.value.trim());
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
  const _displayGroups = [_todaySection, _projectsSection];
  const _sideBar = document.querySelector('#project-container');

  function _displayOnLoad() {
    DataBase.projectList.forEach((el) => {
      ProjectElements.createHTMLList(el);
    });
    _todaySection();
  }

  _displayOnLoad();

  function _clearTaskContainer() {
    _taskContainer.textContent = '';
  }

  function _displayProject(e) {
    _clearTaskContainer();
    let projectName = _currentSection.textContent;
    if (projectName !== 'Today' && projectName !== 'Projects') {
      DataBase.returnProject(projectName).tasksContainer.forEach((task) => {
        TaskElements.createTaskElement(
          task.name,
          task.note,
          task.parentProject,
          task.dueDate,
          task.statusCompleted
        );
      });
    }
    if (e.target.dataset.group) {
      _displayGroups[e.target.dataset.group]();
    }
  }

  function selectProject(e) {
    if (e.target.classList.contains('project-title')) {
      let allSections = document.querySelectorAll('.section');
      let allProjects = document.querySelectorAll('.projects');
      const selectedProject = e.target.textContent;
      _clearTaskContainer();
      _currentSection.textContent = selectedProject;
      DataBase.returnProject(selectedProject).tasksContainer.forEach((task) => {
        TaskElements.createTaskElement(
          task.name,
          task.note,
          task.parentProject,
          task.dueDate,
          task.statusCompleted
        );
      });
      _deleteClass(allSections);
      allProjects.forEach((project) => {
        if (project.textContent === selectedProject) {
          project.classList.add('selected');
        }
      });
    }
  }

  function _todaySection() {
    _currentSection.textContent = 'Today';
    _clearTaskContainer();
    DataBase.todayTasks().forEach((task) => {
      TaskElements.createTaskElement(
        task.name,
        task.note,
        task.parentProject,
        task.dueDate,
        task.statusCompleted
      );
    });
  }

  function _projectsSection() {
    _currentSection.textContent = 'Projects';
    DataBase.projectList.forEach((project) => {
      const divContainer = document.createElement('div');
      const projectContent = document.createElement('div');
      const projectName = document.createElement('p');
      const actionBtnsContainer = document.createElement('div');
      const deleteBtn = document.createElement('span');
      const modifyBtn = document.createElement('span');

      projectContent.append(projectName);
      divContainer.append(projectContent);
      actionBtnsContainer.append(deleteBtn, modifyBtn);
      projectContent.append(actionBtnsContainer);
      _taskContainer.append(divContainer);

      projectName.textContent = project;
      deleteBtn.textContent = 'delete_sweep';
      modifyBtn.textContent = 'edit';

      divContainer.classList.add('task-item');
      projectContent.classList.add('task-content');
      projectName.classList.add('project-title');
      actionBtnsContainer.classList.add('actions');
      deleteBtn.classList.add(
        'material-icons-outlined',
        'delete-project',
        'btn-delete',
        'btn-action'
      );
      modifyBtn.classList.add(
        'material-icons-outlined',
        'edit-project',
        'btn-edit',
        'btn-action'
      );
    });
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
    if (e.target.matches('.delete-project')) {
      let projectName =
        e.target.parentElement.parentElement.childNodes[0].textContent;
      let elementToRemove = e.target.parentElement.parentElement.parentElement;
      DataBase.removeProject(projectName);
      elementToRemove.remove();
      let projectList = _sideBar.querySelectorAll('.projects');
      projectList.forEach((project) => {
        if (project.firstChild.textContent === projectName) {
          project.remove();
        }
      });
    }
  }

  function _editProject(e) {
    let projectName = e.target.parentElement.parentElement.childNodes[0];
    let textElement = e.target.parentElement.parentElement.firstChild;
    const input = document.createElement('input');
    input.value = projectName.textContent;
    textElement.replaceWith(input);
    input.focus();
    input.onblur = () => {
      if (
        input.value !== projectName.textContent &&
        input.value.trim() !== '' &&
        !DataBase.isDuplicated(input.value.trim())
      ) {
        let project = DataBase.returnProject(projectName.textContent);
        projectName.textContent = input.value.trim();
        Project.modifyName(project, projectName.textContent);
        DataBase.updateDB();
        while (_sideBar.firstChild) {
          _sideBar.removeChild(_sideBar.firstChild);
        }
        _displayOnLoad();
      }
      input.replaceWith(textElement);
      _clearTaskContainer();
      _projectsSection();
    };
  }

  function selectSection(e) {
    let allSections = document.querySelectorAll('.section');
    if (e.target.nodeName !== 'SPAN' && e.target !== _sideBar) {
      _deleteClass(allSections);
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
      if (_currentSection.textContent === project) {
        optionElement.setAttribute('selected', 'selected');
      }
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

  function _changeTaskStatus(e) {
    let taskName =
      e.target.parentElement.parentElement.firstElementChild.textContent;
    if (_currentSection.textContent !== 'Today') {
      let taskProject = DataBase.returnProject(_currentSection.textContent);
      let taskItem = Task.returnTask(taskName, taskProject);
      Task.modifyStatus(taskItem);
      if (taskItem.statusCompleted === true) {
        e.target.parentElement.parentElement.classList.add('completed-task');
      } else {
        e.target.parentElement.parentElement.classList.remove('completed-task');
      }
    } else {
      let parentDataset = e.target.parentElement.dataset.parent;
      let project = DataBase.returnProject(parentDataset);
      let taskDatabase = Task.returnTask(taskName, project);
      Task.modifyStatus(taskDatabase);
      if (taskDatabase.statusCompleted === true) {
        e.target.parentElement.parentElement.classList.add('completed-task');
      } else {
        e.target.parentElement.parentElement.classList.remove('completed-task');
      }
    }
  }

  function _deleteTask(e) {
    let taskName =
      e.target.parentElement.parentElement.firstElementChild.textContent;
    if (_currentSection.textContent !== 'Today') {
      let taskProject = DataBase.returnProject(_currentSection.textContent);
      let taskItem = Task.returnTask(taskName, taskProject);
      Project.deleteTask(taskProject, taskItem);
      e.target.parentElement.parentElement.parentElement.remove();
    } else {
      let parentDataset = e.target.parentElement.dataset.parent;
      let project = DataBase.returnProject(parentDataset);
      let taskDatabase = Task.returnTask(taskName, project);
      Project.deleteTask(project, taskDatabase);
      e.target.parentElement.parentElement.parentElement.remove();
    }
  }

  function _createEditBtn() {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.id = 'edit-task';
    return editBtn;
  }

  function _editTask(e) {
    const _modalTask = document.querySelector('#modal');
    let taskName =
      e.target.parentElement.parentElement.firstElementChild.textContent;
    let taskProject = DataBase.returnProject(_currentSection.textContent);
    let taskItem = Task.returnTask(taskName, taskProject);
    let taskElement = e.target.parentElement.parentElement.parentElement;

    const _editBtn = _createEditBtn();
    const _taskInputs = document.querySelectorAll('.task-input');
    const _saveBtn = document.querySelector('#submit-task');
    _saveBtn.replaceWith(_editBtn);

    _modalTask.style.display = 'block';
    _insertSelect.style.display = 'none';
    _taskInputs[0].value = taskItem.name;
    _taskInputs[1].value = taskItem.dueDate;
    _taskInputs[2].value = taskItem.note;
    _editBtn.addEventListener('click', () => {
      if (_taskInputs[0].value !== '') {
        Task.modifyTaskElement(
          taskItem,
          _taskInputs[0].value.trim(),
          _taskInputs[2].value,
          _taskInputs[1].value,
          checkRadioBtn()
        );
        _modalTask.style.display = 'none';
        if (taskItem.statusCompleted === true) {
          taskElement
            .querySelector('.task-content')
            .classList.add('completed-task');
        } else {
          taskElement
            .querySelector('.task-content')
            .classList.remove('completed-task');
        }
        taskElement.querySelector('.task-title').textContent = taskItem.name;
        taskElement.querySelector('.note-content').textContent = taskItem.note;
        _editBtn.replaceWith(_saveBtn);
      }
    });
  }

  function _showTaskNote(e) {
    let taskContent =
      e.target.parentElement.parentElement.parentElement.childNodes[1];
    taskContent.classList.contains('displayed-note')
      ? taskContent.classList.remove('displayed-note')
      : taskContent.classList.add('displayed-note');
  }

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
      case 'edit-project':
        _editProject(e);
        break;
      case 'delete-project':
        removeProject(e);
        break;
    }
  }

  return {
    selectProject,
    removeProject,
    selectSection,
    createSelectElement,
    checkRadioBtn,
    actionButtons,
  };
})();

export { UserInterface, ProjectElements, TaskElements };
