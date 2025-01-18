/*
const getHTML = async () => {
    const response = await fetch(chrome.runtime.getURL('landing.html'));

    const html = await response.text();

    return html;
    }

const getCSS = async () => {
    const response = await fetch(chrome.runtime.getURL('landingstyles.css'));

    const css = await response.text();

    return css;
    }

*/

// user input fills this inshaAllah    
let blockedSites = ["www.youtube.com"];

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
    document.innerHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="landingstyles.css">
    <script src="landingscript.js"></script>
  </head>
  <body>
    <div class="text-container">
    </div>
    <div class="text-container"></div>
    <div class="gradient-bg">
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div class="gradients-container">
        <div class="g1"></div>
        <div class="g2"></div>
        <div class="g3"></div>
        <div class="g4"></div>
        <div class="g5"></div>
        <div class="interactive"></div>
      </div>
    </div>
  </body>
</html>`;
}

document.addEventListener('DOMContentLoaded', () => {
    let donationLink = document.querySelector("#donation-link");
    let num = Math.floor(Math.random() * placesToDonateTo.length);
    donationLink.href = placesToDonateTo[num][0];
    let messageHolder = document.querySelector(".donation");
    let message = document.createTextNode(placesToDonateTo[num][1]);
    messageHolder.appendChild(message);
  });