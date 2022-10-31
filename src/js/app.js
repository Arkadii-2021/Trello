const newCard = document.querySelectorAll('.anotner-card');

function insertCardEl() {
  [...newCard].forEach((card, index) => {
    card.addEventListener('click', () => {
      setTimeout(() => {
        if (document.querySelectorAll('.btn-card').length < 1) {
          closeAddPushCard(card, index);
        }
      }, 300);
    });
  });
}

function closeAddPushCard(evt, index) {
  formToPush(evt);
  setTimeout(() => closeFormAddCard(evt), 300);
  document.querySelector('.btn-card').addEventListener('click', () => {
    const cardEl = document.createElement('DIV');
    cardEl.classList.add('new-push-message');
    if (!(/^\s+$/.test(document.querySelector('textarea.push-container').value))
       && document.querySelector('textarea.push-container').value !== '') {
      cardEl.textContent = document.querySelector('textarea.push-container').value;
      setTimeout(() => {
        document.querySelectorAll('.column-title')[index].nextSibling.after(cardEl);
      }, 200);
      document.querySelector('textarea.push-container').value = '';
      addCrossMouseOverPushMsg(evt, index);
    }
  });
}

function formToPush(evt) {
  const textPush = document.createElement('textarea');
  textPush.classList.add('push-container');
  textPush.setAttribute('placeholder', 'Enter a title for this card...');
  setTimeout(() => document.querySelector('.btn-card').previousSibling.after(textPush), 100);
  setTimeout(() => evt.style.display = 'none', 100);
  addNewTask(evt);
}

function closeFormAddCard(evt) {
  document.querySelector('.close-push-btn').addEventListener('click', () => {
    document.querySelector('.btn-card').remove();
    document.querySelector('.close-push-btn').remove();
    document.querySelector('textarea.push-container').remove();
    evt.style.display = 'inline-block';
  }, { once: true });
}

function addCrossMouseOverPushMsg(evt, index) {
  setTimeout(() => {
    document.querySelector('.new-push-message').addEventListener('mouseover', (e) => {
      crossMouseOver(e.target, index);
    });
    document.querySelector('.new-push-message').addEventListener('mouseout', () => {
      if (document.querySelector('.close-push-msg')) {
        document.querySelector('.close-push-msg').remove();
      }
    });
  }, 250);
}

function crossMouseOver(evt) {
  const closeEl = document.createElement('div');
  closeEl.classList.add('close-push-msg');
  closeEl.innerHTML = '&times;';
  const todoMsg = document.getElementById('todo').children;
  const progressMsg = document.getElementById('progress').children;
  const done = document.getElementById('done').children;

  if (evt.parentElement.getAttribute('id') === 'todo') {
    todoMsg[[...todoMsg].indexOf(evt)].append(closeEl);
  } else if (evt.parentElement.getAttribute('id') === 'progress') {
    progressMsg[[...progressMsg].indexOf(evt)].append(closeEl);
  } else if (evt.parentElement.getAttribute('id') === 'done') {
    done[[...done].indexOf(evt)].append(closeEl);
  }
}

function addNewTask(evt) {
  const btnAddTask = document.createElement('div');
  btnAddTask.classList.add('btn-card');
  btnAddTask.textContent = 'Add card';
  btnAddTask.style = 'text-align: center; padding-top: 7px;';
  evt.previousSibling.after(btnAddTask);
  closeBtnTask(evt);
}

function closeBtnTask() {
  const closeBtn = document.createElement('div');
  closeBtn.classList.add('close-push-btn');
  closeBtn.innerHTML = '&times;';
  setTimeout(() => document.querySelector('.btn-card').previousSibling.after(closeBtn), 100);
}

insertCardEl();
