function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}




function playSound() {
    const audio = new Audio('public/notifications/notification.wav');
    audio.play();
}

var avatar = 'a-1';

const formdata = document.getElementById('choose-avatar');

const select = document.getElementById('btn2');


const changeHandler = (selected) => {
    avatar = selected.value;
    document.querySelectorAll('.picture').forEach(pic => {
        pic.src = `public/avatar/${avatar}.svg`;
    })
    console.log(selected.value);
}

const clientID = uuidv4();
const params = new URLSearchParams(window.location.search)
const roomID = params.get('id');
var socket;
try {
    socket = io('https://enchatt.onrender.com/', { transport: ['websocket'] });
} catch (error) {
    alert("Check your internet connection and try again.");
    window.location.reload();
}

const input = document.getElementById('message');
const topSide = document.getElementById('top-side');
const form = document.getElementById('form')
const typing = document.getElementById('typing');
const reply = document.getElementById('reply');
const replyText = document.getElementById('reply-text');
const closeReply = document.getElementById('close-reply');
var previousMessage = '';

function focusElement(e) {
    if (e.target.dataset.id.toString()) {
        document.getElementById(e.target.dataset.id.toString()).style = 'background-color:#4a5ee6';
        setTimeout(() => {
            document.getElementById(e.target.dataset.id.toString()).style = '';
        }, 1000)
    }
}


closeReply.addEventListener('click', () => {
    addReply = '';
    replyText.innerText = '';
    reply.style.display = 'none';
})


var addReply = '';

form.addEventListener('submit', function (e) {
    e.preventDefault();
    element.classList.remove('em-active');
    var event = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    
    reply.style.display = 'none';
    const item = document.createElement('div');
    
    item.addEventListener('dblclick', (e) => {
        if (e.target.id == '') {
            return e.target.parentNode.dispatchEvent(event);
        }
        window.getSelection().removeAllRanges();
        input.focus();
        reply.style.display = 'flex';
        replyText.innerText = e.target.lastChild.textContent.trim();
        addReply = { id: e.target.id, text: replyText.innerText };
    })
    
    const chat = input.value.trim().replace(new RegExp('<', 'g'), '&lt;').replace(new RegExp('>', 'g'), '&gt;');
    const localChat = anchorme({
        input: chat,
        options: {
            attributes: {
                target: "_blank",
            },

            specialTransform: [
                {
                    test: /youtube\.com\/watch\?v\=/,
                    transform: str =>
                        `${anchorme(chat)}<br><iframe allowfullscreen src="https://www.youtube.com/embed/${str.replace(
                            /.*watch\?v\=(.*)$/,
                            "$1"
                        )}"/>`
                },
                {
                    test: /youtu\.be\/.+$/,
                    transform: str =>
                        `${anchorme(chat)}<br><iframe allowfullscreen src="https://www.youtube.com/embed/${str.replace(
                            /.*youtu\.be\//,
                            ""
                        )}"/>`
                }

            ]
        }
    })
    if (localChat && localChat.length < 1000) {
        const messageId = uuidv4();

        if (addReply != '') {
            item.innerHTML = `<div class="text-card right">
            <div class="pic right-pic"><img class="picture" style="${previousMessage === clientID ? 'visibility: hidden' : ''}" src="public/avatar/${avatar}.svg" alt="avatar" width="50" height="50">
            </div>
            <div class="chat right-chat text-opacity">
            <p class="text right-text" id=${messageId}>
            <a class="reply-contentbox reply-contentbox-me" onclick="focusElement(event)" href="#${addReply.id}" data-id="${addReply.id}">${addReply.text}</a>
            ${localChat}</p>
            </div>
            </div>`;
        }
        else
            item.innerHTML = `<div class="text-card right">
            <div class="pic right-pic"><img class="picture" style="${previousMessage === clientID ? 'visibility: hidden' : ''}" src="public/avatar/${avatar}.svg" alt="avatar" width="50" height="50">
            </div>
            <div class="chat right-chat text-opacity">
            <p class="text right-text" id=${messageId}>${localChat}</p>
            </div>
            </div>`;
            
        topSide.appendChild(item);
        topSide.scrollTo(0, topSide.scrollHeight);
        input.value = '';
        previousMessage = clientID;
        socket.emit('chat-message', { chat, clientID, avatar, messageId, addReply });
        replyText.innerText = '';
        addReply = ''
        input.focus();
    } else if (localChat.length === 0) {
        return;
    }
    else {
        input.value = '';
        alert('Text length should not exceed 1000 characters.');
    }
});


socket.on('sent', () => {
    const elems = document.querySelectorAll('.text-opacity');
    elems.forEach((el) => {
        el.classList.remove("text-opacity");
    });

})

socket.on('chat-message', (chatMessage) => {
    playSound();
    const item = document.createElement('div');
    if (chatMessage.userID === 'admin') {
        item.innerHTML = `<div class="admin-text" style="color:${chatMessage.type === 'join' ? 'green' : 'red'}">${chatMessage.chat}</div>`;
    }
    else {
        item.addEventListener('dblclick', (e) => {
            if (e.target.id == '') {
                return e.target.parentNode.dispatchEvent(event);
            }
            window.getSelection().removeAllRanges();
            input.focus();
            reply.style.display = 'flex';
            replyText.innerText = e.target.lastChild.textContent.trim();
            addReply = { id: e.target.id, text: replyText.innerText };
        })
    
        if (chatMessage.addReply != '') {
            item.innerHTML = `<div class="text-card left">
            <div class="pic left-pic"><img class="picture" src="public/avatar/${chatMessage.avatar}.svg" style="${previousMessage === chatMessage.userID ? 'visibility: hidden' : ''}" alt="avatar" width="50" height="50"></div>
            <div class="chat left-chat">
                <p class="text left-text" id=${chatMessage.messageId}><a class="reply-contentbox" href="#${chatMessage.addReply.id}">${chatMessage.addReply.text}</a>${chatMessage.chat}</p>
            </div>
        </div>`;
        }
        else
            item.innerHTML = `<div class="text-card left">
            <div class="pic left-pic"><img class="picture" src="public/avatar/${chatMessage.avatar}.svg" style="${previousMessage === chatMessage.userID ? 'visibility: hidden' : ''}" alt="avatar" width="50" height="50"></div>
            <div class="chat left-chat">
                <p class="text left-text" id=${chatMessage.messageId}>${chatMessage.chat}</p>
            </div>
        </div>`;
        
        previousMessage = chatMessage.userID;
    }
    topSide.appendChild(item);
    topSide.scrollTo(0, topSide.scrollHeight);
})

socket.on('typing', ({ text }) => {
    typing.innerHTML = text;
})

socket.on('closed', ({ text }) => {
    alert(text);
    window.location.replace('/');
})

//typing indicator
const _input = document.querySelector('#message')
const idleTime = 400;
var idleTimer = null;
var inputValue;

function showIndicator() {
    socket.emit('typing', { text: '...' });
}

function activateIndicator(el) {
    socket.emit('typing', { text: 'typing...' });
    inputValue = el.value;
    detectIdle(el);
}

function removeIndicator() {
    socket.emit('typing', { text: '' });
}

function detectIdle(el) {
    if (idleTimer) {
        clearInterval(idleTimer);
    }

    idleTimer = setTimeout(function () {
        if (getInputCurrentValue(el) === inputValue) {
            removeIndicator();
        }
    }, idleTime);
}

function getInputCurrentValue(el) {
    var currentValue = el.value;
    return currentValue;
}

function initTypingIndicator() {
    _input.onfocus = function () {
        showIndicator();
    };

    _input.onkeyup = function () {
        activateIndicator(this);
    };

    _input.onblur = function () {
        removeIndicator();
    };
}

initTypingIndicator();


document.addEventListener('visibilitychange', (e) => {
    if (document.visibilityState === 'hidden') {
        socket.emit('status', { status: 'Last seen: ' + new Date().toLocaleTimeString() });
    }
    else {
        socket.emit('status', { status: 'online' });
    }
})


const seen = document.getElementById('seen');
socket.on('status', ({ status }) => {
    seen.innerHTML = status;
    status === 'online' ? seen.style = 'color:green' : seen.style = 'color:""';
})

var modal = document.querySelector('.modal-bg');
var x = document.querySelectorAll('#X,#btn1');

select.addEventListener('click', (e) => {
    e.preventDefault();
    avatar = formdata.avatar.value;
    closeModal();
})

const openModal = () => {
    modal.classList.add('bg-active');
}

const closeModal = () => {
    socket.emit('join-room', { clientID, roomID, avatar });
    modal.classList.remove('bg-active');
}


for (items of x) {
    items.addEventListener('click', closeModal);
}

window.onload = openModal();
