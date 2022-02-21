'use strict';

let storedProjects = {};

(function checkStorage() {
  if (localStorage.getItem('projects')) {
    storedProjects = JSON.parse(localStorage.getItem('projects'));
  } else {
    localStorage.setItem('projects', JSON.stringify(storedProjects));
  }
})();

export { storedProjects };
