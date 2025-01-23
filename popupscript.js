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

const startTimer = () => {

};

document.addEventListener('DOMContentLoaded', () => {
    let donationLink = document.querySelector("#donation-link");
    let num = Math.floor(Math.random() * placesToDonateTo.length);
    donationLink.href = placesToDonateTo[num][0];
    let messageHolder = document.querySelector(".donation");
    let message = document.createTextNode(placesToDonateTo[num][1]);
    messageHolder.appendChild(message);
  });

document.addEventListener('click'); //smth inshaAllah

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