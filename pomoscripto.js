const messages = [
    "That was kinda uncool.",
    "... looks like SOMEBODY needs to finish some work.",
    "Patience. It's a virtue.",
    "bruh get back to work", 
    "If you can read this, get back on task.",
    "uh oh",
    "what are you even going to do here?",
    "caught in 4k... or whatever your device has lol",
    "idk, imo you should get to work.",
    "what's up? your work ethic should be."
];

let breakTime = false;

let blockedSites = ["www.youtube.com", "www.google.com", "www.pcss.schoology.com"];

const getHTML = async () => {
    const response = await fetch(chrome.runtime.getURL('landing.html'));
    const html = await response.text();
    return html;
}

const genSiteURL = (url) => {
    return url += "/*";
}
function injectContent() {
  getHTML().then(htmlContent => {
      // Insert HTML
      document.body.innerHTML = htmlContent;

      // Add CSS
      const cssUrl = chrome.runtime.getURL("landingstyles.css");
      const styles = document.createElement('link');
      styles.rel = "stylesheet";
      styles.href = cssUrl;
      document.head.appendChild(styles);

      // Wait for CSS to load
      styles.onload = () => {
          // Initialize bubble movement
          const interBubble = document.querySelector('.interactive');
          if (!interBubble) {
              console.error('Interactive bubble not found');
              return;
          }

          let curX = 0;
          let curY = 0;
          let tgX = 0;
          let tgY = 0;

          function move() {
              curX += (tgX - curX) / 20;
              curY += (tgY - curY) / 20;
              interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
              requestAnimationFrame(move);
          }

          window.addEventListener('mousemove', (event) => {
              tgX = event.clientX;
              tgY = event.clientY;
          });

          // Add random message
          const messageHolder = document.querySelector(".text-container");
          if (messageHolder) {
              let num = Math.floor(Math.random() * messages.length);
              let message = document.createTextNode(messages[num]);
              messageHolder.appendChild(message);
          }

          move();
      };
  }).catch(error => {
      console.error('Error:', error);
  });
}


if (blockedSites.includes(window.location.hostname) && !breakTime) {
    injectContent();
  }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'UPDATE_BREAK_STATUS') {
        breakTime = request.breakTime;
        if (blockedSites.includes(window.location.hostname) && !breakTime) {
            injectContent();
        } else {
            location.reload();
        }
        sendResponse({ status: "Break status updated" });
    }
});