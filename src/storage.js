'use strict';

import parseISO from 'date-fns/parseISO';
import { formatISO, differenceInDays } from 'date-fns';

const DataBase = (function () {
  let _storage = [];
  let _todayTasks = [];
  let projectList = [];

  function updateDB() {
    localStorage.setItem('storage', JSON.stringify(_storage));
    projectList = _storage;
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

  function returnProject(index) {
    return _storage[index];
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
        if (task.dueDate == today && task.statusCompleted === false) {
          _todayTasks.push(task);
        }
      });
    });
    console.log(_todayTasks);
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
  }

  static checkDuplicate(project, taskName) {
    return project.tasksContainer.includes(taskName);
  }
}

class Task {
  creationDate;
  name;
  note;
  parentProject;
  statusCompleted = false;
  dueDate;

  constructor(name, note, parentProject, dueDate = false) {
    this.creationDate = formatISO(new Date(), { representation: 'date' });
    this.name = name;
    this.note = note;
    this.parentProject = parentProject;
    this.statusCompleted;
    this.dueDate = dueDate;
  }

  static modifyNote(task, note) {
    task.note = note;
  }
  static modifyName(task, name) {
    task.name = name;
  }

  static modifyStatus(task) {
    task.statusCompleted === false
      ? (task.statusCompleted = true)
      : (task.statusCompleted = false);
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
}

DataBase.readDB();

export { DataBase, Project, Task };
