const getHTML = async () => {
    const response = fetch('../landing.html');
    
    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    const html = await response.text();

    return html;
    }

const getCSS = async () => {
    const response = fetch('../landingstyles.css');
    
    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    const css = await response.text();

    return css;
    }

if (blockedSites.includes(window.location.hostname)) {
    document.body.innerHTML = getHTML();
    document.head.innerHTML = getCSS();

}

// user input fills inshaAllah
let blockedSites = ["https://youtube.com/*"];

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

document.addEventListener('DOMContentLoaded', () => {
    let donationLink = document.querySelector("#donation-link");
    let num = Math.floor(Math.random() * placesToDonateTo.length);
    donationLink.href = placesToDonateTo[num][0];
    let messageHolder = document.querySelector(".donation");
    let message = document.createTextNode(placesToDonateTo[num][1]);
    messageHolder.appendChild(message);
  });