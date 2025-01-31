let seconds = 0;
let minutes = 0;
let timerID;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_BREAK_TIMER') {
        let timerTime = new Date(request.when);
        let timeDiff = timerTime.getTime() - Date.now();

        chrome.alarms.create("breakTimer", { delayInMinutes: timeDiff / 60000 });
        chrome.storage.local.set({ timerTime: timerTime.getTime(), breakTime: true });

        sendResponse({ status: "Break timer started" });

    } else if (request.cmd === 'START_TIMER') {
        let timerTime = new Date(request.when);
        let timeDiff = timerTime.getTime() - Date.now();

        chrome.alarms.create("workTimer", { delayInMinutes: timeDiff / 60000 });
        chrome.storage.local.set({ timerTime: timerTime.getTime(), breakTime: false });

        sendResponse({ status: "Work timer started" });

    } else if (request.cmd === 'GET_TIME') {
        chrome.storage.local.get(["timerTime", "breakTime"], (data) => {
            sendResponse({ time: data.timerTime, breakTime: data.breakTime });
        }); // OK OK OK THIS IS IMPORTANT inshaAllah
        return true; 
    } else if (request.cmd === 'RESET_TIMER') {
        chrome.alarms.clearAll();
        chrome.storage.local.set({ timerTime: null, breakTime: false });
        sendResponse({ status: "Timer reset" });
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "breakTimer") {
        chrome.storage.local.set({ breakTime: false });
        chrome.runtime.sendMessage({ cmd: 'UPDATE_BREAK_STATUS_CONT', breakTime: false });
    } else if (alarm.name === "workTimer") {
        chrome.storage.local.set({ breakTime: true });
        chrome.runtime.sendMessage({ cmd: 'UPDATE_BREAK_STATUS_CONT', breakTime: true });
    }
});
