'use strict';

import parseISO from 'date-fns/parseISO';
import { formatISO, differenceInDays } from 'date-fns';

const DataBase = (function () {
  let creationDate = formatISO(new Date(), { representation: 'date' });
  let _storage = [
    {
      name: 'Uncategorized',
      creationDate: creationDate,
      tasksContainer: [
        {
          creationDate: creationDate,
          name: 'Interact with tasks',
          note: `
          When a project is being displayed, you can check the task as complete or uncheck it, delete, modify and display the note and information about the selected task.`,
          parentProject: 'Uncategorized',
          statusCompleted: false,
          dueDate: creationDate,
        },
        {
          creationDate: creationDate,
          name: 'Create a new task',
          note: `
          If you want to create a new task, you will have to click in the button on the top right corner, then you will have to complete the modal window with the related information.
          Only the name is mandatory and it cannot be duplicated, same as Projects.`,
          parentProject: 'Uncategorized',
          statusCompleted: false,
          dueDate: creationDate,
        },
        {
          creationDate: creationDate,
          name: 'Create a new project',
          note: `
          To create a new Project, you will have to click the button "New Project" and type a name for it. After the Project has been created, you can select it from the left side bar just clicking on it. Like tasks, is not possible to have two Projects with the same name.`,
          parentProject: 'Uncategorized',
          statusCompleted: false,
          dueDate: creationDate,
        },
        {
          creationDate: creationDate,
          name: 'Projects section explained',
          note: `
          In this section, you will be able to delete and modify project's name`,
          parentProject: 'Uncategorized',
          statusCompleted: false,
          dueDate: creationDate,
        },
        {
          creationDate: creationDate,
          name: 'Today section explained',
          note: `
          Here you will find all the tasks with today as due date.
          Also below the note, you will find the due date and creation date for this specific task
          With the icons in your right, you will be able to check, delete and display the note and the information related to the task.`,
          parentProject: 'Uncategorized',
          statusCompleted: false,
          dueDate: creationDate,
        },
      ],
    },
  ];
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
    let _todayTasks = [];
    const today = formatISO(new Date(), { representation: 'date' });
    _storage.forEach((project) => {
      project.tasksContainer.forEach((task) => {
        if (task.dueDate == today && !_todayTasks.includes(task)) {
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

  static changeParent(project, newParent) {
    project.tasksContainer.forEach((task) => {
      task.parentProject = newParent;
    });
  }

  static modifyName(project, newName) {
    const projectIndex = DataBase.projectList.indexOf(project.name);
    project.name = newName;
    DataBase.projectList.splice(projectIndex, 1, project.name);
    this.changeParent(project, newName);
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
