const getHTML = async () => {
    const response = await fetch(chrome.runtime.getURL('landing.html'));

    const html = await response.text();

    return html;
    }

/*    
const getCSS = async () => {
    const response = await fetch(chrome.runtime.getURL('landingstyles.css'));

    const css = await response.text();

    return css;
    }

*/

// user input fills this inshaAllah    
let blockedSites = ["www.youtube.com"];

const genSiteURL = (url) => {
    return url += "/*";
}

/*
    
if (blockedSites.includes(window.location.hostname)) {
    getHTML().then(htmlContent => {
      document.body.innerHTML = htmlContent;
    }).catch(error => {
      console.error("Error loading HTML:", error);
    });
  
    getCSS().then(cssContent => {
      const styleElement = document.createElement('style');
      styleElement.textContent = cssContent;
      document.head.appendChild(styleElement);
    }).catch(error => {
      console.error("Error loading CSS:", error);
    });

    
  }

*/

if (blockedSites.includes(window.location.hostname)) {
    const cssUrl = chrome.runtime.getURL("landingstyles.css");
    const styles = document.createElement('link');
    styles.rel = "stylesheet";
    styles.href = cssUrl;
    document.head.appendChild(styles);
    getHTML().then(htmlContent => {
        document.documentElement.innerHTML = htmlContent;
      }).catch(error => {
        console.error("Error loading HTML:", error);
      });
    if (document.body.contains('iframe')) {
        document.querySelector('iframe').remove();
    }
    }

    let messages = [
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
    
    document.addEventListener('DOMContentLoaded', () => {
         const interBubble = document.querySelector<HTMLDivElement>('.interactive');
         let curX = 0;
         let curY = 0;
         let tgX = 0;
         let tgY = 0;
    
         function move() {
             curX += (tgX - curX) / 20;
             curY += (tgY - curY) / 20;
             interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
             requestAnimationFrame(() => {
                 move();
             });
         }
    
         window.addEventListener('mousemove', (event) => {
    tgX = event.clientX;
             tgY = event.clientY;
         });
    
         move();
     });
    
    document.addEventListener('DOMContentLoaded', () => {
      let num = Math.floor(Math.random() * messages.length);
      let messageHolder = document.querySelector(".text-container");
      let message = document.createTextNode(messages[num]);
      messageHolder.appendChild(message);
    });

document.addEventListener('DOMContentLoaded', () => {
    let donationLink = document.querySelector("#donation-link");
    let num = Math.floor(Math.random() * placesToDonateTo.length);
    donationLink.href = placesToDonateTo[num][0];
    let messageHolder = document.querySelector(".donation");
    let message = document.createTextNode(placesToDonateTo[num][1]);
    messageHolder.appendChild(message);
  });