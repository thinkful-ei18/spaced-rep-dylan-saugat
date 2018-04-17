'use strict';
const questions = require('../db/seed/questions');

function updatePosition(list, newMValue) {
  list.head.value.mValue = newMValue;
  list.head.value.attempts += 1;
  if (newMValue !== 1) {
    list.head.value.correctAttempts += 1;
  }
  insertBefore(list, list.head.value, newMValue);
  list.head = list.head.next;
  
  return list;
}

function buildList(list) {
  questions.forEach(item => {
    item.attempts = 0;
    item.correctAttempts = 0;
    item.mValue = 1;
    list.insertLast(item);
  });
  return list;
}

function insertBefore(list, value, key) {
  let tempNode = list.head;
  let counter = 0;
  while (tempNode.next !== null) {
    if (counter === key) {
      let afterNode = tempNode.next;
      tempNode.next = {
        value,
        next: afterNode
      };
      return;
    }
    tempNode = tempNode.next;
    counter++;
  }
  tempNode.next = {
    value,
    next: null
  };
  return;
}

module.exports = { buildList, updatePosition };
