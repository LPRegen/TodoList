'use strict';

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
    if (statusCompleted === true) taskContent.classList.add('completed-task');
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
    const deleteIcon = document.createElement('span');
    container.classList.add('projects', 'section');
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
  const _displayGroups = [_todayGroup];

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
    let projectName = _currentSection.textContent;
    if (
      projectName !== 'Today' &&
      projectName !== 'This week' &&
      projectName !== 'Projects'
    ) {
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
        task.dueDate,
        task.statusCompleted
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
    if (e.target.matches('.delete-btn')) {
      DataBase.removeProject(e.target.parentElement.childNodes[0].textContent);
      e.target.parentElement.remove();
      _currentSection.textContent = 'Today';
      _displayGroups[0]();
    }
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
    // ! refactor
    let taskName =
      e.target.parentElement.parentElement.firstElementChild.textContent;
    let taskProject = DataBase.returnProject(_currentSection.textContent);
    let taskItem = Task.returnTask(taskName, taskProject);
    Task.modifyStatus(taskItem);
    if (taskItem.statusCompleted === true) {
      e.target.parentElement.parentElement.classList.add('completed-task');
    } else {
      e.target.parentElement.parentElement.classList.remove('completed-task');
    }
  }

  function _deleteTask(e) {
    let taskName =
      e.target.parentElement.parentElement.firstElementChild.textContent;
    let taskProject = DataBase.returnProject(_currentSection.textContent);
    let taskItem = Task.returnTask(taskName, taskProject);
    Project.deleteTask(taskProject, taskItem);
    e.target.parentElement.parentElement.parentElement.remove();
  }

  function _editTask(e) {
    let taskName =
      e.target.parentElement.parentElement.firstElementChild.textContent;
    let taskProject = DataBase.returnProject(
      DataBase.returnIndex(document.querySelector('#section-name').textContent)
    );
    let taskItem = Task.returnTask(taskName, taskProject);
    const taskElement = e.target.parentElement.parentElement.parentElement;
    const _modalTask = document.querySelector('#modal');
    const _taskInputs = document.querySelectorAll('.task-input');
    const _saveBtn = document.querySelector('#submit-task');
    _saveBtn.dataset.modify = 'true';
    _modalTask.style.display = 'block';
    _insertSelect.style.display = 'none';
    _taskInputs[0].value = taskItem.name;
    _taskInputs[1].value = taskItem.dueDate;
    _taskInputs[2].value = taskItem.note;
    _saveBtn.addEventListener('click', () => {
      if (_taskInputs[0].value.trim() !== '') {
        Task.modifyTaskElement(
          taskItem,
          _taskInputs[0].value.trim(),
          _taskInputs[2].value,
          _taskInputs[1].value,
          checkRadioBtn()
        );
        _modalTask.style.display = 'none';
        delete _saveBtn.dataset.modify;

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
