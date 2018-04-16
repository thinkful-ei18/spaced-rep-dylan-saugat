'use strict';

class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(value) {
    this.head = new _Node(value, this.head);
  }

  insertLast(value) {
    if (this.head === null) {
      this.insertFirst(value);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(value, null);
    }
  }

  remove(value) {
    if (this.head === null) return null;
    if (this.head.value === value) {
      this.head = this.head.next;
      return;
    }
    let tempNode = this.head;
    while (tempNode.next.value !== value) {
      if (tempNode.next === null) return null;
      tempNode = tempNode.next;
    }
    const oldNode = tempNode.next;
    tempNode.next = oldNode.next;
    return;
  }

  find(value) {
    if (this.head === null) return null;
    let tempNode = this.head;
    while (tempNode.next !== null) {
      if (tempNode.value === value) return tempNode;
      tempNode = tempNode.next;
    }
    return null;
  }

  insertBefore(value, key) {
    let tempNode = this.head;
    while (tempNode.next !== null) {
      if (tempNode.next.value === key) {
        let afterNode = tempNode.next;
        tempNode.next = new _Node(value, afterNode);
        return;
      }
      tempNode = tempNode.next;
    }
    return false;
  }

  insertAfter(value, key) {
    let tempNode = this.head;
    while (tempNode.next !== null) {
      if (tempNode.value === key) {
        let afterNode = tempNode.next;
        tempNode.next = new _Node(value, afterNode);
        return;
      }
      tempNode = tempNode.next;
    }
    return false;
  }

  insertAt(value, key) {
    let tempNode = this.head;
    let count = 0;
    while (tempNode.next !== null) {
      if (count + 1 === key) {
        let afterNode = tempNode.next;
        tempNode.next = new _Node(value, afterNode);
        return;
      }
      tempNode = tempNode.next;
      count++;
    }
    return false;
  }
}

module.exports = LinkedList;