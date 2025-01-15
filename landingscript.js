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
     const interBubble = document.querySelector<HTMLDivElement>('.interactive')!;
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