let seconds = 0;
let minutes = 0;

let timerID;
let timerTime;

let beginButton = document.getElementById("start-stop");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_BREAK_TIMER') {
        timerTime = new Date(request.when);
        timerID = setTimeout(() => {
            sendResponse({ breakTime: false });
        }, timerTime.getTime() - Date.now())
    } else if (request.cmd === 'START_TIMER') {
        timerTime = new Date(request.when);
        timerID = setTimeout(() => {
            sendResponse({ breakTime: true });
        }, timerTime.getTime() - Date.now())
    } else if (request.cmd === 'GET_TIME') {
        sendResponse({ time: timerTime })
    }
});