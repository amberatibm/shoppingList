const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formButton = itemForm.querySelector('button');

let filter = '';
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach(item => addItemToDOM(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;
  // validate input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exist!');
      return;
    }
  }

  addItemToDOM(newItem);

  addItemToStorage(newItem);
  checkUI();

  itemInput.value = '';
}

function addItemToDOM(item) {
  // create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  
  // Add li to the DOM
  li.appendChild(button);
  itemList.appendChild(li);
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') == null) {
    itemsFromStorage = []
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function removeItemFromStorage(itemText) {
  let itemsFromStorage = getItemsFromStorage();

  itemsFromStorage = itemsFromStorage.filter((i) => i !== itemText);
  
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;

}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item.toLowerCase())
}

function setItemToEdit(item) {
  isEditMode = true;
  
  itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formButton.style.backgroundColor = '#228b22'
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    item.remove();

    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // Clear from local storage
  localStorage.removeItem('items')
  checkUI();
}

function checkUI() {
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearButton.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearButton.style.display = 'block';
    itemFilter.style.display = 'block';
  }
  formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formButton.style.backgroundColor = '#333';
  isEditMode = false;
  itemInput.value = '';
}

function filterItems(e) {
  if (e.target.value === 'Backspace') {
    filter = filter.slice(0, filter.length - 1).toLowerCase();
  } else {
    filter = e.target.value.toLowerCase();
  }

  console.log(filter)
  const items = itemList.querySelectorAll('li');
  items.forEach((item) => {
    const itemName = item.textContent.toLowerCase();

    if (itemName.indexOf(filter) != -1) {
      item.style.display ='flex';
    } else {
      item.style.display ='none';
    }
  })
}

// Initialize App
function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearButton.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  
  checkUI();
}

init();
