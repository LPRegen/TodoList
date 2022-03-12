"use strict";

import parseISO from "date-fns/parseISO";
import { formatISO, differenceInDays } from "date-fns";

const DataBase = (function () {
  let _storage = [];
  let _projectList = [];

  function _updateDB() {
    localStorage.setItem("storage", JSON.stringify(_storage));
  }

  (function _checkStorage() {
    if (localStorage.getItem("storage")) {
      _storage = JSON.parse(localStorage.getItem("storage"));
    } else {
      _updateDB();
    }
  })();

  function readDB() {
    _storage.forEach((project) => {
      _projectList.push(project.name);
    });
  }

  function deleteDB() {
    _storage = [];
    _updateDB();
  }

  function addElement(project) {
    _storage.push(project);
    _updateDB();
  }

  function removeProject(project) {
    let projectName = project.name;
    let projectIndex;
    for (let i = 0; i < _storage.length; i++) {
      if (_storage[i].name === projectName) {
        projectIndex = i;
        break;
      }
    }
    _storage.splice(projectIndex, 1);
    _updateDB();
  }

  function isDuplicated(project) {
    return _projectList.includes(project.name);
  }

  return {
    readDB,
    deleteDB,
    addElement,
    removeProject,
    isDuplicated,
  };
})();

class Project {
  name;
  creationDate;
  tasksContainer = [];

  constructor(name) {
    this.name = name;
    this.creationDate = formatISO(new Date(), { representation: "date" });
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
    console.log(project.tasksContainer);
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

  constructor(name, note, parentProject, dueDate = undefined) {
    this.creationDate = formatISO(new Date(), { representation: "date" });
    this.name = name;
    this.note = note;
    this.parentProject = parentProject;
    this.statusCompleted;
    this.dueDate = dueDate;
  }

  static storeNote(task, newNote) {
    task.note = newNote;
  }
  static modifyName(task, newName) {
    task.name = newName;
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
  }

  static modifyStatus(task) {
    task.statusCompleted === false
      ? (task.statusCompleted = true)
      : (task.statusCompleted = false);
  }
}

DataBase.readDB();

export { DataBase, Project, Task };
