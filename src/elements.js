'use strict';

import subDays from 'date-fns/subDays';
import parseISO from 'date-fns/parseISO';
import { formatISO, differenceInDays } from 'date-fns';

class Project {
  static #counter = 0;

  constructor(name, dueDate) {
    this.name = name;
    this.creationDate = formatISO(new Date(), { representation: 'date' });
    this.dueDate = dueDate;
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

  storeNote() {
    this.parentProject.tasks.push(this);
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

export { Project, Task };
