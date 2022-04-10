'use strict';

import parseISO from 'date-fns/parseISO';
import { formatISO, differenceInDays } from 'date-fns';

const DataBase = (function () {
  let _storage = [
    {
      name: 'Uncategorized',
      creationDate: '2022-03-24',
      tasksContainer: [],
    },
  ];
  let _todayTasks = [];
  let projectList = [];

  function updateDB() {
    localStorage.setItem('storage', JSON.stringify(_storage));
  }

  (function _checkStorage() {
    if (localStorage.getItem('storage')) {
      _storage = JSON.parse(localStorage.getItem('storage'));
    } else {
      updateDB();
    }
  })();

  function readDB() {
    _storage.forEach((project) => {
      projectList.push(project.name);
    });
  }

  function returnProject(projectName) {
    let returnedProject;
    _storage.forEach((project) => {
      if (project.name === projectName) {
        returnedProject = project;
      }
    });
    return returnedProject;
  }

  function deleteDB() {
    _storage = [];
    projectList = [];
    updateDB();
  }

  function addProject(project) {
    projectList.push(project.name);
    _storage.push(project);
    updateDB();
  }

  function returnIndex(projectName) {
    let projectIndex;
    for (let i = 0; i < _storage.length; i++) {
      if (_storage[i].name === projectName) {
        projectIndex = i;
        break;
      }
    }
    return projectIndex;
  }

  function removeProject(projectName) {
    let index = returnIndex(projectName);
    _storage.splice(index, 1);
    projectList.splice(index, 1);
    updateDB();
  }

  function isDuplicated(project) {
    return projectList.includes(project);
  }

  function todayTasks() {
    const today = formatISO(new Date(), { representation: 'date' });
    _storage.forEach((project) => {
      project.tasksContainer.forEach((task) => {
        if (
          task.dueDate == today &&
          task.statusCompleted === false &&
          !_todayTasks.includes(task)
        ) {
          _todayTasks.push(task);
        }
      });
    });
    return _todayTasks;
  }

  return {
    projectList,
    updateDB,
    readDB,
    returnProject,
    deleteDB,
    addProject,
    returnIndex,
    removeProject,
    isDuplicated,
    todayTasks,
  };
})();

class Project {
  name;
  creationDate;
  tasksContainer = [];

  constructor(name) {
    this.name = name;
    this.creationDate = formatISO(new Date(), { representation: 'date' });
  }

  static deleteTask(project, task) {
    let taskIndex;
    for (let i = 0; i < project.tasksContainer.length; i++) {
      if (project.tasksContainer[i].name === task.name) {
        taskIndex = i;
        break;
      }
    }
    project.tasksContainer.splice(taskIndex, 1);
    DataBase.updateDB();
  }

  static checkDuplicate(project, taskName) {
    let isDuplicated;
    project.tasksContainer.forEach((task) => {
      if (task.name.includes(taskName)) {
        isDuplicated = true;
      }
    });
    return isDuplicated;
  }
}

class Task {
  creationDate;
  name;
  note;
  parentProject;
  statusCompleted;
  dueDate;

  constructor(name, note, parentProject, dueDate = false, statusCompleted) {
    this.creationDate = formatISO(new Date(), { representation: 'date' });
    this.name = name;
    this.note = note;
    this.parentProject = parentProject;
    this.dueDate = dueDate;
    this.statusCompleted = statusCompleted;
  }

  static modifyTaskElement(task, name, note, dueDate = '', statusCompleted) {
    task.name = name;
    task.note = note;
    task.dueDate = dueDate;
    task.statusCompleted = statusCompleted;
    DataBase.updateDB();
  }

  static modifyStatus(task) {
    task.statusCompleted === false
      ? (task.statusCompleted = true)
      : (task.statusCompleted = false);
    DataBase.updateDB();
  }

  static checkDate(task) {
    let status;
    if (
      differenceInDays(parseISO(task.dueDate), parseISO(task.creationDate)) <=
      -1
    ) {
      return (status = false);
    } else {
      return (status = true);
    }
  }

  static linkToProject(task, project) {
    project.tasksContainer.push(task);
    DataBase.updateDB();
  }

  static returnTask(taskName, project) {
    let taskItem;
    for (let i = 0; i < project.tasksContainer.length; i++) {
      if (taskName === project.tasksContainer[i].name) {
        taskItem = project.tasksContainer[i];
        break;
      }
    }
    return taskItem;
  }
}

DataBase.readDB();

export { DataBase, Project, Task };
