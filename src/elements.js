'use strict';

import subDays from 'date-fns/subDays';
import parseISO from 'date-fns/parseISO';
import { formatISO } from 'date-fns/formatISO';

class Project {
  static #counter = 0;

  constructor(name, dueDate) {
    this.name = name;
    this.creationDate = formatISO(new Date(), { representation: 'date' });
    this.dueDate = dueDate;
    this.isCompleted = false;
    this.id = Project.#counter++;
    this.tasks = [];
  }
}

class Task extends Project {
  static #counter = 0;

  constructor(name, dueDate, note, parentProject) {
    super(name, dueDate);
    this.id = Task.#counter++;
    this.note = note;
    this.parentProject = parentProject;
  }
}

export { Project, Task };
