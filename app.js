import { Contact } from "./modules/contact.js";
import { HashTable } from "./modules/hashTable.js";

// ****** global variables **********

let contactList = [];
const size = 32;
let hashTable = new HashTable(size);

// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ****** select items **********

const contactsContainer = document.querySelector(".contacts-container");
let modalBtnAdd = document.querySelector(".add-contact");
const modalAdd = document.querySelector(".modal-overlay-add");
const closeBtnAdd = document.querySelector(".close-btn-add");
const search = document.querySelector(".search-icon");
const clearBtn = document.querySelector(".clear-search");
const searchBox = document.getElementById("inputBox");
const addForm = document.querySelector(".add-contact-form");
const addBtn = document.querySelector(".submit-btn");
const editBtn = document.getElementById("edit-form");

// add-form items

const name = document.getElementById("inputName");
const phone = document.getElementById("inputPhone");
const email = document.getElementById("inputEmail");
const label = document.getElementById("inputLabel");

// ****** event listeners **********

addForm.addEventListener("submit", addNewContact);
editBtn.addEventListener("click", editItem);

modalBtnAdd.addEventListener("click", function () {
  editBtn.style.display = "none";
  addBtn.style.display = "inline-flex";
  modalAdd.classList.add("open-modal");
});
closeBtnAdd.addEventListener("click", function () {
  modalAdd.classList.remove("open-modal");
  clearModal();
});

search.addEventListener("click", function () {
  alert("No implementado");
});

clearBtn.addEventListener("click", function () {
  searchBox.value = "";
});

// ****** local storage **********

function getLocalStorage() {
  return localStorage.getItem("contacts")
    ? JSON.parse(localStorage.getItem("contacts"))
    : [];
}

function addToLocalStorage(value) {
  let items = getLocalStorage();
  items.push(value);

  function organizeLocalStorage() {
    items.sort(function (a, b) {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
  }
  organizeLocalStorage();
  localStorage.setItem("contacts", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.name = value.name;
      item.phone = value.phone;
      item.email = value.email;
      item.label = value.label;
    }
    return item;
  });
  localStorage.setItem("contacts", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("contacts", JSON.stringify(items));
}

// ****** view functionality **********

function createListItem(contact) {
  const element = document.createElement("div");
  let attr = document.createAttribute("data-id");
  attr.value = contact.id;
  element.setAttributeNode(attr);
  element.classList.add("contact-card");
  element.innerHTML = `
		<div class="contact-photo">
			<img class="contact-photo-avatar" src="${contact.photo}" alt="contact avatar"/>
		</div>
		<div class="contact-name">
			<p class="get-name">${contact.name}</p>
		</div>
		<div class="contact-phone">
			<p>${contact.phone}</p>
		</div>
		<div class="contact-email">
			<p>${contact.email}</p>
		</div>
		<div class="contact-label">
			<p>${contact.label}</p>
		</div>
		<div class="action-btns">
			<i class="edit-btn fa-solid fa-user-pen"></i>
			<i class="delete-btn fa-solid fa-trash-can"></i>
		</div>
  `;
  // add event listeners to both buttons;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", showEditItem);

  // append child
  contactsContainer.appendChild(element);
}

function addNewContact(event) {
  event.preventDefault();
  let contact = new Contact(
    undefined,
    name.value.toLowerCase(),
    phone.value,
    email.value.toLowerCase(),
    label.value
  );

  if (contactList != null) {
    contactList.push(contact);
  } else {
    contactList = [{ contact }];
  }
  organizeContactList();
  addToLocalStorage(contact);
  hashTable.add(contact.name, contact);
  // console.log("hashTable: ", hashTable);

  const element = document.createElement("div");
  let attr = document.createAttribute("data-id");
  attr.value = contact.id;
  element.setAttributeNode(attr);
  element.classList.add("contact-card");
  element.innerHTML = `
	<div class="contact-photo">
		<img class="contact-photo-avatar" src="${contact.photo}" alt="contact avatar"/>
	</div>
	<div class="contact-name">
		<p class="get-name">${contact.name}</p>
	</div>
	<div class="contact-phone">
		<p>${contact.phone}</p>
	</div>
	<div class="contact-email">
		<p>${contact.email}</p>
	</div>
	<div class="contact-label">
		<p>${contact.label}</p>
	</div>
	<div class="action-btns">
		<i class="edit-btn fa-solid fa-user-pen"></i>
		<i class="delete-btn fa-solid fa-trash-can"></i>
	</div>
	`;

  // add event listeners to contact actions

  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const modalBtnEdit = element.querySelector(".edit-btn");
  modalBtnEdit.addEventListener("click", showEditItem);

  contactsContainer.appendChild(element);

  modalAdd.classList.remove("open-modal");
  clearModal();

  //location.reload();
}

function editItem() {
  const id = document.querySelector(".hide").getAttribute("data-id");
  let contact = new Contact(
    id,
    name.value,
    phone.value,
    email.value,
    label.value
  );
  editLocalStorage(id, contact);
  // edit contact list
  // re render contact card
  modalAdd.classList.remove("open-modal");
  clearModal();

  // short time, temp solution to render updates

  location.reload();
}

function showEditItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  const tmp = getLocalStorage();
  let contact = tmp.find((contact) => contact.id === id);
  name.value = contact.name;
  phone.value = contact.phone;
  email.value = contact.email;
  label.value = contact.label;
  addBtn.style.display = "none";
  editBtn.style.display = "inline-flex";
  const idHide = document.querySelector(".hide");
  let attr = document.createAttribute("data-id");
  attr.value = contact.id;
  idHide.setAttributeNode(attr);
  modalAdd.classList.add("open-modal");
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  // console.log(findContact(id));
  contactsContainer.removeChild(element);
  contactList.slice(id, 1);
  removeFromLocalStorage(id);
  let contactTmp = findContact(id);
  hashTable.remove(contactTmp.name);
  //   console.log("hashTable: ", hashTable);
}

function organizeContactList() {
  contactList.sort(function (a, b) {
    let x = a.name.toLowerCase();
    let y = b.name.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
}

function clearModal() {
  name.value = "";
  phone.value = "";
  email.value = "";
  label.value = "";
}

function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      let contact = new Contact(
        item.id,
        item.name,
        item.phone,
        item.email,
        item.label
      );
      if (contactList != null) {
        contactList.push(contact);
      } else {
        contactList = [{ contact }];
      }
      createListItem(contact);
      hashTable.add(contact.name, contact);
    });
  }
  //console.log("contactList: ", contactList);
  //   console.log("hashTable: ", hashTable);
}

function findContact(id) {
  return contactList.find((element) => element.id === id);
}
