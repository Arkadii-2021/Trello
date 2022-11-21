const todoCard = document.querySelector('h5[id="1"]');
const progressCard = document.querySelector('h5[id="2"]');
const doneCard = document.querySelector('h5[id="3"]');

!(function () {
  const trello = JSON.parse(localStorage.getItem('trello'));

  if (trello) {
    for (const todoEl of [...trello.todo]) {
      const el = new DOMParser().parseFromString(todoEl.elCard, 'text/html');
      todoCard.previousSibling.after(el.all[3]);
    }
    for (const progressEl of [...trello.progress]) {
      const el = new DOMParser().parseFromString(progressEl.elCard, 'text/html');
      progressCard.previousSibling.after(el.all[3]);
    }
    for (const doneEl of [...trello.done]) {
      const el = new DOMParser().parseFromString(doneEl.elCard, 'text/html');
      doneCard.previousSibling.after(el.all[3]);
    }

    document.querySelectorAll('.close-push-msg').forEach((elem) => {
      elem.remove();
    });
  }
  saveCards();
}());

function insertCardEl() {
  todoCard.addEventListener('click', (e) => {
    anotherCardEl(e);
  });

  progressCard.addEventListener('click', (e) => {
    anotherCardEl(e);
  });

  doneCard.addEventListener('click', (e) => {
    anotherCardEl(e);
  });
}

function anotherCardEl(e) {
  const textPush = document.createElement('textarea');
  textPush.classList.add('push-container');
  textPush.style = 'display: inline-block;';
  textPush.setAttribute('placeholder', 'Enter a title for this card...');

  const btnAddTask = document.createElement('div');
  btnAddTask.classList.add('btn-card');
  btnAddTask.textContent = 'Add card';
  btnAddTask.style = 'display: inline-block; text-align: center; padding-top: 9px;';

  const btnClose = document.createElement('div');
  btnClose.classList.add('close-push-btn');
  btnClose.style = 'display: inline-block;';
  btnClose.innerHTML = '&times;';

  e.target.before(textPush, btnAddTask, btnClose);
  e.target.classList.toggle('active__form');

  btnClose.addEventListener('click', () => {
    textPush.remove();
    btnAddTask.remove();
    btnClose.remove();
    e.target.classList.toggle('active__form');
  });

  btnAddTask.addEventListener('click', (ev) => {
    addTaskEl(e, ev, textPush, btnAddTask, btnClose);
    saveCards();
  });
}

function addTaskEl(e, ev, textPush, btnAddTask, btnClose) {
  const getRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  const cardEl = document.createElement('DIV');

  cardEl.classList.add('new-push-message');
  cardEl.setAttribute('draggable', 'true');
  cardEl.setAttribute('idMessage', getRandom(1, 999999));

  if (!(/^\s+$/.test(ev.target.previousSibling.value))
  && ev.target.previousSibling.value !== '') {
    cardEl.textContent = ev.target.previousSibling.value;
    ev.target.parentElement.firstChild.nextSibling.after(cardEl);
    ev.target.previousSibling.value = '';
    textPush.remove();
    btnAddTask.remove();
    btnClose.remove();
    e.target.classList.toggle('active__form');
  }

  cardEl.addEventListener('mouseenter', () => {
    crossMouseOver(e, cardEl);
  });

  cardEl.addEventListener('dragstart', dragStart);

  document.querySelectorAll('section').forEach((cardList) => {
    cardList.addEventListener('dragenter', dragEnter);
    cardList.addEventListener('dragover', dragOver);
    cardList.addEventListener('drop', drop);
  });
}

function dragStart(e) {
  e.dataTransfer.setData('dragItem', this.getAttribute('idMessage'));
}

function dragEnter(e) {
  e.preventDefault();
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  const messDataAttr = e.dataTransfer.getData('dragItem');
  const messDragEl = document.querySelector(`[idMessage='${messDataAttr}']`);
  this.firstChild.nextSibling.after(messDragEl);
  saveCards();
}

function crossMouseOver(e, cardEl) {
  const closeEl = document.createElement('div');
  closeEl.classList.add('close-push-msg');
  closeEl.innerHTML = '&times;';
  cardEl.append(closeEl);
  cardEl.addEventListener('mouseleave', () => {
    closeEl.remove();
  });
  closeEl.addEventListener('click', () => {
    cardEl.remove();
    saveCards();
  });
}

function runEventsMess() {
  const cardElements = document.querySelectorAll('.new-push-message');

  cardElements.forEach((cardEl) => {
    cardEl.addEventListener('mouseenter', (e) => {
      crossMouseOver(e, cardEl);
    });
    cardEl.addEventListener('dragstart', dragStart);
  });

  document.querySelectorAll('section').forEach((cardList) => {
    cardList.addEventListener('dragenter', dragEnter);
    cardList.addEventListener('dragover', dragOver);
    cardList.addEventListener('drop', drop);
  });
}

function saveCards() {
  localStorage.clear();
  const cardElements = document.querySelectorAll('.new-push-message');
  const objSaveCard = { todo: [], progress: [], done: [] };

  cardElements.forEach((cardEl, i) => {
    objSaveCard[cardEl.closest('section').id].push({ index: i, elCard: cardEl.outerHTML });
  });
  localStorage.setItem('trello', JSON.stringify(objSaveCard));
}

runEventsMess();
insertCardEl();
