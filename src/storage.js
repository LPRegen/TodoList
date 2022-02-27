'use strict';

const Storage = (function checkStorage() {
  let _storedProjects = [];

  (function _checkStorage() {
    if (localStorage.getItem('projects')) {
      _storedProjects = JSON.parse(localStorage.getItem('projects'));
    } else {
      localStorage.setItem('projects', JSON.stringify(_storedProjects));
    }
  })();

  const addItem = function (item) {
    _storedProjects.push(item);
    localStorage.setItem('projects', JSON.stringify(_storedProjects));
    console.log('pushed');
  };

  return {
    addItem,
  };
})();

export { Storage };
