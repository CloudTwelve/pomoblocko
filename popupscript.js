let minutes = document.querySelector('.minutes');
let seconds = document.querySelector('.seconds');
let timerID;

let breakTime = false;

if (!chrome.storage.local.get("currentTime")) {
  chrome.storage.local.set({ currentTime: 25 * 60 * 1000 });
}

const startTimer = (time) => {
  if (time.getTime() > Date.now()) {
    timerID = setInterval(() => {
      let timeDiff = time.getTime() - Date.now();
      let timeSecs = Math.floor(timeDiff / 1000);
      minutes.textContent = Math.floor(timeSecs / 60);
      seconds.textContent = timeSecs % 60;
      chrome.storage.local.set({ currentTime: timeDiff });
    }, 1000);
  }
};

const startTime = (time) => {
  if (breakTime) {
    chrome.runtime.sendMessage({ cmd: 'START_BREAK_TIMER', when: time }, (response) => {
      console.log(response);
    });
  } else {
    chrome.runtime.sendMessage({ cmd: 'START_TIMER', when: time }, (response) => {
      startTime(time);
    });
  }
  startTimer(time);
}

chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, (response) => {
  if (response.time) {
    const time = new Date(response.time);
    startTimer(time);
    breakTime = response.breakTime;
  }
});

// This section handles the timer and timer buttons.
let beginButton = document.querySelector('#start-stop');
let resetButton = document.querySelector('#reset');

beginButton.addEventListener('click', () => {
  let buttonContent = beginButton.innerText;
  if (buttonContent === "Start") {
    let time = new Date(Date.now() + chrome.storage.local.get("currentTime"));
    startTime(time);
    beginButton.innerText = "Stop";
  } else {
    clearInterval(timerID);
    beginButton.innerText = "Start";
  }
});

resetButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({ cmd: 'RESET_TIMER' });
  clearInterval(timerID);
  minutes.textContent = "25";
  seconds.textContent = "00";
});

// This section has the button actions for the sitelist,
// todolist, and bwlist toggle buttons.

// sitelist stuff
let sitelistButton = document.querySelector("#sitelist");
let addSiteButton = document.querySelector("#add-site");
let siteX = document.querySelector("#sitelist-x");
let updateSites = () => {
  let sites = document.querySelectorAll(".todo-item");
  let siteArray = [];
  sites.forEach((site) => {
    sites.push(site.innerText);
  });
  chrome.storage.local.set("sites", JSON.stringify(siteArray));
}

sitelistButton.addEventListener('click', () => {
  displayLightbox("#todo-lightbox");
});

addSiteButton.addEventListener('click', () => {
  let siteInput = document.querySelector("#site-input");
  let siteList = document.querySelector(".site-container");
  let site = siteInput.value;
  let newSiteElement = document.createElement("div");
  newSiteElement.classList.add("item");
  let newSiteText = document.createTextNode(site);
  newSiteElement.appendChild(newSiteText);
  siteList.appendChild(newSiteElement);
  updateSites();
})

siteX.addEventListener('click', () => {
  hideLightbox("#site-lightbox");
});

// todo stuff
let todoButton = document.querySelector("#todo");
let addTodoButton = document.querySelector("#add-todo");
let todoX = document.querySelector("#todo-x");
let updateTodos = () => {
  let todos = document.querySelectorAll(".todo-item");
  let todoArray = [];
  todos.forEach((todo) => {
    todoArray.push(todo.innerText);
  });
  chrome.storage.local.set("todos", JSON.stringify(todoArray));
}

todoButton.addEventListener('click', () => {
  displayLightbox("#todo-lightbox");
});

addTodoButton.addEventListener('click', () => {
  let todoInput = document.querySelector("#todo-input");
  let todoList = document.querySelector(".todo-container");
  let todo = todoInput.value;
  let newTodoElement = document.createElement("div");
  newTodoElement.classList.add("item");
  let newTodoText = document.createTextNode(todo);
  newTodoElement.appendChild(newTodoText);
  todoList.appendChild(newTodoElement);
  updateTodos();
})

todoX.addEventListener('click', () => {
  hideLightbox("#todo-lightbox");
});

// bwList stuff
let bwListButton = document.querySelector("#bw-toggle");
let bwListMode = "blacklist";

if (chrome.storage.local.get("todos") === null) {
  chrome.storage.local.set("todos", []);
}

if (chrome.storage.local.get("sites") === null) {
  chrome.storage.local.set("sites", []);
}

if (chrome.storage.local.get("bwlist-mode") === null) {
  chrome.storage.local.set("bwlist-mode", "blacklist");
}

bwListButton.addEventListener('click', () => {
  if (bwListMode === "blacklist") {
    bwListMode = "whitelist";
    chrome.storage.local.set("bwlist-mode", "whitelist");
  } else {
    bwListMode = "blacklist";
    chrome.storage.local.set("bwlist-mode", "whitelist");
  }
});

// This has the lightbox functions for the buttons.
let displayLightbox = (id) => {
  let lightbox = document.querySelector(id);
  lightbox.style.display = "block";
}

let hideLightbox = (id) => {
  let lightbox = document.querySelector(id);
  lightbox.style.display = "none";
}


let placesToDonateTo = [
  ["https://irusa.org/middle-east/palestine/", "Palestine"],
  ["https://www.launchgood.com/communitypage/syria_1#!/community/syria_1/", "Syria"],
  ["https://sapa-usa.org/", "Sudan"],
  ["https://www.launchgood.com/v4/campaign/empowering_rohingya_children_through_education?", "Rohingyan Children"],
  ["https://www.launchgood.com/v4/campaign/mercy_bakery_yemen_5?src=internal_comm_page_support", "Yemen"],
  ["https://www.launchgood.com/v4/campaign/los_angeles_wildfires_emergency_2025?src=internal_comm_page", "Los Angeles Wildfire Relief"],
  ["https://www.launchgood.com/v4/campaign/fuel_your_health_building_a_free_clinic_in_uganda?src=", "a Ugandan Clinic"],
  ["https://www.launchgood.com/v4/campaign/palestine_mothers_and_babies?src=internal_discover", "Palestinian Mothers and Babies"]
];

document.addEventListener('DOMContentLoaded', () => {
  let donationLink = document.querySelector("#donation-link");
  let num = Math.floor(Math.random() * placesToDonateTo.length);
  let message = placesToDonateTo[num][1];
  donationLink.textContent = message;
  donationLink.href = placesToDonateTo[num][0];
});

/*

Stack Overflow reading (not mine, but it's where the code is from)
https://stackoverflow.com/questions/58132891/chrome-timer-extension-how-to-keep-timer-running-even-when-extension-is-closed

*/
