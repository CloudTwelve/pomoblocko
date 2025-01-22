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

let blockedSites = ["www.youtube.com", "www.google.com", "www.pcss.schoology.com"];

const getHTML = async () => {
    const response = await fetch(chrome.runtime.getURL('landing.html'));
    const html = await response.text();
    return html;
}

const genSiteURL = (url) => {
    return url += "/*";
}

if (blockedSites.includes(window.location.hostname)) {
    document.querySelectorAll('iframe').forEach(iframe => iframe.remove());
    getHTML().then(htmlContent => {
        document.body.innerHTML = htmlContent;
      }).catch(error => {
        console.error("Error loading HTML:", error);
      });
    const cssUrl = chrome.runtime.getURL("landingstyles.css");
    const styles = document.createElement('link');
    styles.rel = "stylesheet";
    styles.href = cssUrl;
    document.head.appendChild(styles);
    const scriptElement = document.createElement('script');
    scriptElement.src = chrome.runtime.getURL('landingscript.js');
    document.head.appendChild(scriptElement);
}