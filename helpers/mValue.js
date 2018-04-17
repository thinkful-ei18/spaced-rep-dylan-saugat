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
  while (tempNode.next !== null) {
    if (tempNode.value.mValue === key && tempNode.next.value.mValue >= key + 1) {
      let afterNode = tempNode.next;
      tempNode.next = {
        value,
        next: afterNode
      };
      return;
    }
    tempNode = tempNode.next;
  }
  tempNode.next = {
    value,
    next: null
  };
  return;
}

module.exports = { buildList, updatePosition };
