let minutes = document.querySelector('.minutes');
let seconds = document.querySelector('.seconds');
let timerID;

let breakTime = false;

chrome.storage.local.get("currentTime", (result) => {
  if (!result.currentTime) {
    chrome.storage.local.set({ currentTime: 25 * 60 * 1000 });
  }
});

const startTimer = (time) => {
  console.log("Starting timer with time:", time);
  clearInterval(timerID); // Clear any existing interval
  
  if (time > Date.now()) {
    timerID = setInterval(() => {
      let timeDiff = time - Date.now();
      let timeSecs = Math.floor(timeDiff / 1000);
      if (timeSecs <= 0) {
        clearInterval(timerID);
        chrome.storage.local.get("breakTime", (result) => {
          minutes.textContent = result.breakTime ? "05" : "25";
          seconds.textContent = "00";
        });
        return;
      }
      minutes.textContent = String(Math.floor(timeSecs / 60)).padStart(2, '0');
      seconds.textContent = String(timeSecs % 60).padStart(2, '0');
      chrome.storage.local.set({ currentTime: timeDiff });
    }, 1000);
  }
};

const startTime = (time) => {
  console.log("startTime called with:", time);
  if (breakTime) {
    chrome.runtime.sendMessage({ cmd: 'START_BREAK_TIMER', when: time }, (response) => {
      console.log("Break timer response:", response);
      minutes.textContent = "05";  // Show 5 minutes for break
      seconds.textContent = "00";
    });
  } else {
    chrome.runtime.sendMessage({ cmd: 'START_TIMER', when: time }, (response) => {
      console.log("Work timer response:", response);
      minutes.textContent = "25";  // Show 25 minutes for work
      seconds.textContent = "00";
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
    chrome.storage.local.get(["currentTime", "breakTime"], (result) => {
      let currentTime = result.currentTime || (result.breakTime ? 5 * 60 * 1000 : 25 * 60 * 1000);
      let targetTime = Date.now() + currentTime;
      console.log("Starting timer with remaining time:", currentTime/1000, "seconds");
      startTime(targetTime);
      beginButton.innerText = "Stop";
    });
  } else {
    clearInterval(timerID);
    chrome.runtime.sendMessage({ cmd: 'STOP_TIMER' });
    chrome.storage.local.set({ timerRunning: false });
    beginButton.innerText = "Start";
  }
});

resetButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({ cmd: 'RESET_TIMER' }, (response) => {
    clearInterval(timerID);
    // Reset the display
    minutes.textContent = "25";
    seconds.textContent = "00";
    // Reset the stored time and break state
    chrome.storage.local.set({ 
      currentTime: 25 * 60 * 1000,
      breakTime: false,
      timerTime: null
    });
    breakTime = false;
    beginButton.innerText = "Start";
  });
});

// This section has the button actions for the sitelist,
// todolist, and bwlist toggle buttons.

// sitelist stuff
let sitelistButton = document.querySelector("#sitelist");
let addSiteButton = document.querySelector("#add-site");
let siteX = document.querySelector("#sitelist-x");

// Initialize stored sites
const updateSites = () => {
    let siteList = document.querySelector(".site-container");
    let sites = Array.from(siteList.querySelectorAll(".item")).map(el => el.textContent);
    chrome.storage.local.set({ "sites": sites }, () => {
        console.log("Sites updated:", sites);
    });
}

sitelistButton.addEventListener('click', () => {
    displayLightbox("#sitelist-lightbox");
});

addSiteButton.addEventListener('click', () => {
    let siteInput = document.querySelector("#site-input");
    let siteList = document.querySelector(".site-container");
    let site = siteInput.value.trim().replace('www.', '');
    
    if (site) {
        let newSiteElement = document.createElement("div");
        newSiteElement.classList.add("item");
        newSiteElement.textContent = site;
        siteList.appendChild(newSiteElement);
        updateSites();
        siteInput.value = "";
    }
});

siteX.addEventListener('click', () => {
  hideLightbox("#sitelist-lightbox");
});

// todo stuff
let todoButton = document.querySelector("#todo");
let addTodoButton = document.querySelector("#add-todo");
let todoX = document.querySelector("#todo-x");

const updateTodos = () => {
  chrome.storage.local.get("todos", (result) => {
    if (result.todos) {
        const todoList = document.querySelector(".todo-container");
        result.todos.forEach(todo => {
            let newTodoElement = document.createElement("div");
            newTodoElement.classList.add("item");
            newTodoElement.textContent = todo;
            todoList.appendChild(newTodoElement);
        });
    }
});
}

todoButton.addEventListener('click', () => {
  displayLightbox("#todo-lightbox");
});

addTodoButton.addEventListener('click', () => {
  let todoInput = document.querySelector("#todo-input");
  let todoList = document.querySelector(".todo-container");
  let todo = todoInput.value;
  if (todo) {
      let newTodoElement = document.createElement("div");
      newTodoElement.classList.add("item");
      newTodoElement.textContent = todo;
      todoList.appendChild(newTodoElement);
      updateTodos();
      todoInput.value = "";
    }
})

todoX.addEventListener('click', () => {
  hideLightbox("#todo-lightbox");
});

// bwList stuff
let bwListButton = document.querySelector("#bw-toggle");
let bwIcon = document.querySelector(".fa-link-slash");
let bwListMode = "blacklist";

chrome.storage.local.get("todos", (result) => {
  if (!result.todos) {
    chrome.storage.local.set({ "todos" : [] });
  }
});

chrome.storage.local.get("sites", (result) => {
  if (!result.sites) {
    chrome.storage.local.set({ "sites" : [] });
  }
});

chrome.storage.local.get("bwlistmode", (result) => {
  if (!result.bwlistmode) {
    chrome.storage.local.set({ "bwlistmode": "blacklist" });
  }
});

bwListButton.addEventListener('click', () => {
  chrome.storage.local.get("bwlistmode", (result) => {
    let currentMode = result["bwlistmode"] || "blacklist";
    if (currentMode === "blacklist") {
      bwListMode = "whitelist";
      chrome.storage.local.set({ "bwlistmode": "whitelist" });
      bwListButton.style.background = "white";
      bwIcon.style.color = "black";
    } else {
      bwListMode = "blacklist";
      chrome.storage.local.set({ "bwlistmode": "blacklist" });
      bwListButton.style.background = "black";
      bwIcon.style.color = "white";
    }
  });
});

// Initialize the black/white list mode
chrome.storage.local.get("bwlistmode", (result) => {
    bwListMode = result.bwlistmode || "blacklist";
    updateBWButtonAppearance(bwListMode);
});

function updateBWButtonAppearance(mode) {
    if (mode === "whitelist") {
        bwListButton.style.background = "white";
        bwIcon.style.color = "black";
    } else {
        bwListButton.style.background = "black";
        bwIcon.style.color = "white";
    }
}

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
  chrome.storage.local.get(["timerTime", "breakTime", "timerRunning"], (result) => {
    if (result.timerTime && result.timerRunning) {
      startTimer(result.timerTime);
      beginButton.innerText = "Stop";
    } else {
      minutes.textContent = result.breakTime ? "05" : "25";
      seconds.textContent = "00";
      beginButton.innerText = "Start";
    }
    breakTime = result.breakTime;
  });
  let donationLink = document.querySelector("#donation-link");
  let num = Math.floor(Math.random() * placesToDonateTo.length);
  let message = placesToDonateTo[num][1];
  donationLink.textContent = message;
  donationLink.href = placesToDonateTo[num][0];
});

/*

Stack Overflow reading (not mine, but it's where some of the code is from)
https://stackoverflow.com/questions/58132891/chrome-timer-extension-how-to-keep-timer-running-even-when-extension-is-closed

*/
