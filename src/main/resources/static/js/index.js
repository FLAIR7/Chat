/* Global data */
/*const url = 'https://fast-chatapp.herokuapp.com/ws'*/
const url = 'http://localhost:8080/ws';
let stompClient = null;
var username = null;
var message = document.querySelector('#msg');

function fetch(){
    let a = document.getElementById('history-msg');
    a.innerHTML = "";
    $.ajax({
        method: "GET",
        url: "messages",
        dataType: "json",
        success: function(res) {
            console.log(res[0]);
            res.forEach(function (response, index) {
                if(res[index].senderName == username)
                    a.innerHTML += '<p style="color:white">' + response.message + '</p>';
            });
        }
    })
}

function logout(){
    if(username){
        var chatMessage = {
            senderName: username,
            status: "LEAVE"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }
}

function history(){
    if(username) {
        let chat = document.getElementsByClassName('container')[0];
        chat.classList.add('d-none');
        let history = document.getElementById('history');
        history.classList.remove('d-none');
        fetch();
    } else {
        alert("You must login to see your messages");
    }
}

function chat(){
    if(username) {
        let chat = document.getElementsByClassName('container')[0];
        chat.classList.remove('d-none');
        let history = document.getElementById('history');
        history.classList.add('d-none');
    } else {
        alert("You Must Login to enter in the chat");
    }
}

function date(){
    var data = new Date();
    hour = data.getHours();
    minutes = data.getMinutes();
    return hour + ":" + minutes;
}

function registration(){
    username = document.querySelector('#inputName').value.trim();
    if(!username || !username.replace(/\s/g, '').length || username.length < 3)
        alert('Name Invalid. Must have at least 3 letters.');
    else
        connectToChat();
}

function connectToChat(){
    console.log('connecting to chat...');

    // Change the login page to the chat
    let login = document.getElementsByClassName('login-page')[0];
    login.classList.add('d-none');
    let chat = document.getElementsByClassName('container')[0];
    chat.classList.remove('d-none');

    var socket = new SockJS(url);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}

/* Create a websocket to the public chat */
function onConnected(){
    stompClient.subscribe('/chatroom/public', onMessageReceived);
    userJoin();
}

function onError(err){
    console.log(err);
}

function userJoin(){
    var chatMessage = {
        senderName: username,
        status: "JOIN"
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
}

function onMessageReceived(response){
    var responseData = JSON.parse(response.body);
    var messageDiv = document.getElementById("messages");
    var content = null;

     if(responseData.status == "JOIN") {
            content = '<div class="container" style="text-align: center">' +
                '<b style="color:gray" class="right">' +
                 responseData.senderName +
                "</b><p>" + 'Joined!</p></div>';
     } else if(responseData.status == "LEAVE") {
        content = '<div class="container" style="text-align: center">' +
                '<b style="color:gray" class="right">' +
                 responseData.senderName +
                "</b><p>" + 'Exit!</p></div>';
     } else if(responseData.senderName == username){
        content = '<div class="container darker" style="text-align: right">' +
            '<b style="color:#000" class="right">' +
             responseData.senderName +
            "</b><p>" +
            responseData.message +
            '</p><span>' +
            date() +
         '</span></div>';
    } else {
        content = '<div class="container">' +
            '<b style="color:#000" class="left">' +
             responseData.senderName +
            "</b><p>" +
            responseData.message +
            '</p><span>' +
            date() +
         '</span></div>';
    }
    messageDiv.innerHTML += content;
    messageDiv.scrollTop = messageDiv.scrollHeight;
    document.getElementById('msg').value = '';
}

function sendMessage(){
    let message = document.getElementById('msg').value;
    if(stompClient && message.replace(/\s/g, '').length) {
        var chatMessage = {
            senderName: username,
            message: message,
            status: "MESSAGE"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }
}
