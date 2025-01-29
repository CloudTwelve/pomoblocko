let minutes = document.querySelector('.minutes');
let seconds = document.querySelector('.seconds');

let breakTime = false;

const startTimer = (time) => {
  if (time.getTime() > Date.now()) {
    setInterval(() => {
      let timeSecs = time.getTime() / 1000;
      minutes.textContent = Math.floor(timeSecs / 60);
      seconds.textcontent = timeSecs % 60;
    })
  }
};

const startTime = (time) => {
  if (breakTime) {
    chrome.runtime.sendMessage({ cmd: 'START_BREAK_TIMER', when: time }, (response) => {
      chrome.runtime.sendMessage({ breakTime: response.breakTime });
    });
  } else {
    chrome.runtime.sendMessage({ cmd: 'START_TIMER', when: time }, (response) => {
      breakTime = true;
      startTime(time);
    });
  }
  startTimer(time);
}

let sitelistButton = document.querySelector("#sitelist");
let addSiteButton = document.querySelector("#add-site");
let siteX = document.querySelector("#site-x");
let updateSites = () => {
  let sites = document.querySelectorAll(".todo-item");
  let siteArray = [];
  sites.forEach((site) => {
    sites.push(site.innerText);
  });
  localStorage.setItem("sites", JSON.stringify(siteArray));
}

let todoButton = document.querySelector("#todo");
let addTodoButton = document.querySelector("#add-todo");
let todoX = document.querySelector("#todo-x");
let updateTodos = () => {
  let todos = document.querySelectorAll(".todo-item");
  let todoArray = [];
  todos.forEach((todo) => {
    todoArray.push(todo.innerText);
  });
  localStorage.setItem("todos", JSON.stringify(todoArray));
}

let bwListButton = document.querySelector("#bwlist");
let bwListMode = "blacklist";

if (localStorage.getItem("todos") === null) {
  localStorage.setItem("todos", []);
}

if (localStorage.getItem("sites") === null) {
  localStorage.setItem("sites", []);
}

if (localStorage.getItem("bwlist-mode") === null) {
  localStorage.setItem("bwlist-mode", "blacklist");
}

document.addEventListener('DOMContentLoaded', () => {
    let donationLink = document.querySelector("#donation-link");
    let num = Math.floor(Math.random() * placesToDonateTo.length);
    let message = placesToDonateTo[num][1];
    donationLink.textContent = message;
    donationLink.href = placesToDonateTo[num][0];
  });

let placesToDonateTo = [
    ["https://irusa.org/middle-east/palestine/", "Palestine"],
    ["https://www.launchgood.com/communitypage/syria_1#!/community/syria_1/", "Syria"],
    ["https://sapa-usa.org/", "Sudan"],
    ["https://www.launchgood.com/v4/campaign/empowering_rohingya_children_through_education?", "Rohingyan Children"],
    ["https://www.launchgood.com/v4/campaign/mercy_bakery_yemen_5?src=internal_comm_page_support", "Yemen"],
    ["https://www.launchgood.com/v4/campaign/los_angeles_wildfires_emergency_2025?src=internal_comm_page", "Los Angeles Wildfire Relief"],
    ["https://www.launchgood.com/v4/campaign/fuel_your_health_building_a_free_clinic_in_uganda?src=", "a Ugandan Clinic"],
    ["https://www.launchgood.com/v4/campaign/palestine_mothers_and_babies?src=internal_discover", "Palestinian Mothers and Babies"]
]


// let beginButton = ;

let displayLightbox = (id) => {
  let lightbox = document.querySelector(id);
  lightbox.style.display = "block";
}

let hideLightbox = (id) => {
  let lightbox = document.querySelector(id);
  lightbox.style.display = "none";
}


// localStorage.setItem('myData', JSON.stringify({ name: 'John', age: 30 }));



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

bwListButton.addEventListener('click', () => {
  if (bwListMode === "blacklist") {
    bwListMode = "whitelist";
    localStorage.setItem("bwlist-mode", "whitelist");
  } else {
    bwListMode = "blacklist";
    localStorage.setItem("bwlist-mode", "whitelist");
  }
});

let sitelist = [];
let blModeOn = true;
let wlModeOn = false;

let beginButton = document.querySelector('#start-stop');
let resetButton = document.querySelector('#reset');

let settingsButton = document.querySelector('#settings');
let todoButton = document.querySelector('#todo');
let sitelistButton = document.querySelector('#sitelist');
let bwToggle = document.querySelector('#bw-toggle');

beginButton.addEventListener('click', () => {
  let buttonContent = beginButton.innerText;
  if (buttonContent === "Start") {
    startTime(time);
  } else {
    stopTime(time);
  }
});



todoButton.addEventListener('click', () => {

});
sitelistButton.addEventListener('click'); //smth inshaAllah

chrome.runtime.sendMessage({cmd: 'GET_TIME' }, (response) => {
  if (response.time) {
    const time = new Date(response.time);
    startTimer(time);
  }
});



/*
background.js
let timerID;
let timerTime;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === 'START_TIMER') {
    timerTime = new Date(request.when);
    timerID = setTimeout(() => {
       // the time is app, alert the user.
    }, timerTime.getTime() - Date.now());
  } else if (request.cmd === 'GET_TIME') {
    sendResponse({ time: timerTime });
  }
});

Stack Overflow reading (not mine, but it's where the code is from)
https://stackoverflow.com/questions/58132891/chrome-timer-extension-how-to-keep-timer-running-even-when-extension-is-closed
*/

/*
timer.js

// Call this when the pop-up is shown
chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
  if (response.time) {
    const time = new Date(response.time);
    startTimer(time)
  }
});

functions startTimer(time) {
  if (time.getTime() > Date.now()) {
    setInterval(() => {
      // display the remaining time
    }, 1000)

  }
}

function startTime(time) {
  chrome.runtime.sendMessage({ cmd: 'START_TIMER', when: time });
  startTimer(time);
}


*/