console.log("AI Chat JS Loaded");
function getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");

        for (let cookie of cookies) {
            cookie = cookie.trim();

            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    return cookieValue;
}

const csrftoken = getCookie("csrftoken");
let currentSession = null;

const input = document.getElementById("chat-message-input");
const form = document.getElementById("chat-input-form");

const historyBox = document.getElementById("chat-history-track");
const newBtn=document.getElementById("new-chat-btn");

const deleteBtn=document.getElementById("delete-history-btn");

function newChat(){

    fetch("/ai-review/new/")
    .then(res=>res.json())
    .then(data=>{

        currentSession=data.session_id;

        historyBox.innerHTML="";

    });

}

newBtn.addEventListener("click",newChat);

async function sendMessage() {

    if (!currentSession) {

        const response = await fetch("/ai-review/new/");
        const data = await response.json();

        currentSession = data.session_id;
    }

    const message = input.value.trim();

    if (message === "") return;

    const formData = new FormData();

    formData.append("session_id", currentSession);
    formData.append("message", message);

    fetch("/ai-review/send/", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrftoken,
        },
        body: formData,
    })
    .then(res => res.json())
    .then(data => {
        addUserMessage(message);
        addBotMessage(data.reply);
        input.value = "";
    });
}

form.addEventListener("submit",function(e){

    e.preventDefault();

    sendMessage();

});

function loadHistory() {

    fetch("/ai-review/history/")
        .then(res => res.json())
        .then(data => {

            const historyList = document.getElementById("chat-history-list");

            historyList.innerHTML = "";

            data.forEach(session => {

                historyList.innerHTML += `
    <div class="history-item" onclick="loadSession(${session.id})">
        💬 Chat ${session.id}
        <span class="history-date">${session.date}</span>
    </div>
`;

            });

        });

}

loadHistory();

function loadSession(id){

fetch(`/ai-review/session/${id}/`)

.then(res=>res.json())

.then(messages=>{

historyBox.innerHTML="";

messages.forEach(msg=>{

historyBox.innerHTML+=`

<div class="chat-message ${msg.role}">

<p>${msg.content}</p>

</div>

`;

});

});

}

function deleteChat(id){

fetch(`/ai-review/delete/${id}/`)

.then(()=>{

loadHistory();

});

}

fetch("/ai-review/latest/")
    .then(res => res.json())
    .then(data => {

        if (data.session_id) {

            currentSession = data.session_id;
            loadSession(currentSession);

        }

    });
    
document.addEventListener("DOMContentLoaded", () => {
   
    loadHistory();
});