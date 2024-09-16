const messageIcon = document.getElementById("chatbot-icon");
const closeButton = document.getElementById("closeChatbot");
const chatbotWindow = document.querySelector(".chatbot-window")


messageIcon.addEventListener("click",()=>{
   chatbotWindow.style.display = "flex";
});

closeButton.addEventListener("click",()=>{
   chatbotWindow.style.display = "none";
});