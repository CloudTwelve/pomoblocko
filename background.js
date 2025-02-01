let seconds = 0;
let minutes = 0;
let timerID;

chrome.runtime.onInstalled.addListener((details) => {
    console.log("Extension installed/updated:", details);
    // Clear any existing alarms and timers
    chrome.alarms.clearAll();
    
    if (details.reason === "install") {
        chrome.storage.local.set({
            currentTime: 25 * 60 * 1000,
            breakTime: false,
            timerTime: null,
            timerRunning: false,
            bwlistMode: "blacklist",
            sites: [],
            todos: []
        });
    } else if (details.reason === "update") {
        chrome.storage.local.set({
            timerTime: null,
            timerRunning: false,
            currentTime: 25 * 60 * 1000,
            breakTime: false
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Background received message:", request);
    
    if (request.cmd === 'START_BREAK_TIMER') {
        let timerTime = new Date(request.when).getTime();
        let timeDiff = timerTime - Date.now();
        console.log("Starting break timer for", timeDiff/1000, "seconds");

        chrome.alarms.create("breakTimer", { delayInMinutes: timeDiff / 60000 });
        chrome.storage.local.set({ 
            timerTime: timerTime, 
            breakTime: true,
            timerRunning: true 
        }, () => {
            sendResponse({ status: "Break timer started", time: timerTime });
        });

    } else if (request.cmd === 'START_TIMER') {
        let timerTime = new Date(request.when).getTime();
        let timeDiff = timerTime - Date.now();
        console.log("Starting work timer for", timeDiff/1000, "seconds");

        chrome.alarms.create("workTimer", { delayInMinutes: timeDiff / 60000 });
        chrome.storage.local.set({ 
            timerTime: timerTime, 
            breakTime: false,
            timerRunning: true 
        }, () => {
            sendResponse({ status: "Work timer started", time: timerTime });
        });

    } else if (request.cmd === 'STOP_TIMER') {
        chrome.alarms.clearAll();
        chrome.storage.local.set({ 
            timerRunning: false,
            timerTime: null 
        }, () => {
            sendResponse({ status: "Timer stopped" });
        });
        return true;
    } else if (request.cmd === 'GET_TIME') {
        chrome.storage.local.get(["timerTime", "breakTime"], (data) => {
            sendResponse({ time: data.timerTime, breakTime: data.breakTime });
        }); 
        return true; 
    } else if (request.cmd === 'RESET_TIMER') {
        chrome.alarms.clearAll();
        chrome.storage.local.set({ 
            timerTime: null,
            breakTime: false,
            currentTime: 25 * 60 * 1000
        }, () => {
            sendResponse({ status: "Timer reset complete" });
        });
        return true;
    }
    return true; // Keep message channel open for async response
});


chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "breakTimer") {
        chrome.storage.local.set({ 
            breakTime: false,
            currentTime: 25 * 60 * 1000  // Set to 25 minutes work time
        });
    } else if (alarm.name === "workTimer") {
        chrome.storage.local.set({ 
            breakTime: true,
            currentTime: 5 * 60 * 1000   // Set to 5 minutes break time
        });
    }
});

