let seconds = 0;
let minutes = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_BREAK_TIMER') {
        let timerTime = new Date(request.when);
        let timeDiff = timerTime.getTime() - Date.now();

        chrome.alarms.create("breakTimer", { delayInMinutes: timeDiff / 60000 });

        sendResponse({ status: "Break timer started" });

    } else if (request.cmd === 'START_TIMER') {
        let timerTime = new Date(request.when);
        let timeDiff = timerTime.getTime() - Date.now();

        chrome.alarms.create("workTimer", { delayInMinutes: timeDiff / 60000 });

        sendResponse({ status: "Work timer started" });

    } else if (request.cmd === 'GET_TIME') {
        chrome.storage.local.get("timerTime", (data) => {
            sendResponse({ time: data.timerTime });
        });
        return true; 
    } else if (request.cmd === 'RESET_TIMER') {
        chrome.storage.local.set({ timerTime: 25 * 60 * 1000 });
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "breakTimer") {
        chrome.storage.local.set({ breakTime: false });
        chrome.runtime.sendMessage({ cmd: 'UPDATE_BREAK_STATUS', breakTime: false });
    } else if (alarm.name === "workTimer") {
        chrome.storage.local.set({ breakTime: true });
        chrome.runtime.sendMessage({ cmd: 'UPDATE_BREAK_STATUS', breakTime: true });
    }
});
