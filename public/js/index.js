function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var uuid = uuidv4();


gsap.registerPlugin(ScrollTrigger);

gsap.from('.content', {
    y: 100,
    opacity: 0,
    duration: 1,
})
gsap.from('.section-1 .contain', {
    scrollTrigger: {
        trigger: '.section-1 .contain',
        start: '-20% 80%',
    },
    y: 100,
    duration: 1,

})
gsap.from('.section-2', {
    scrollTrigger: {
        trigger: '.section-2 .contain',
        start: '-20% 80%',
    },
    y: 100,
    duration: 1,

})
gsap.from('.section-3 .contain', {
    scrollTrigger: {
        trigger: '.section-3 .contain',
        start: '-20% 80%',
    },
    y: 100,
    duration: 1,

})
gsap.from('.create-join', {
    scrollTrigger: {
        trigger: '.create-join',
        start: 'top bottom',
    },
    y: 100,
    opacity: 0,
    duration: 1,

})
gsap.from('.foot', {
    scrollTrigger: {
        trigger: '.foot',
        start: 'top bottom',
    },
    opacity: 0,
    duration: 1.5,

})


var modal = document.querySelector('.modal-bg');
var btn = document.querySelectorAll('.item3,#item4,.create-server');
var joinButton = document.querySelectorAll('#join,#join-room');
var x = document.querySelectorAll('#X,#btn1');
var input = document.getElementById('linkcopy')
var started = document.getElementById('btn2')
var copyLink = document.getElementById('copybtn')
var copyText = document.getElementById('copytext')
var createText = document.getElementById('createtext')

copyLink.addEventListener('click', e => {
    e.preventDefault()
    copyText.value = `Join me on Enchatt.\nID: ${uuid}\nLink: https://sandeshhd.github.io/enchatt/chat?id=${uuid}`
    try {
        copyText.select();
        document.execCommand('copy');
        copyLink.innerHTML = 'Copied!'
        input.select();
    }
    catch (err) {
        alert('unable to copy text');
    }
})




function isUUID(uuid) {
    let s = "" + uuid;

    s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    if (s === null) {
        return false;
    }
    return true;
}

input.addEventListener('blur', (e) => {
    if (isUUID(input.value)) {
        started.disabled = false;
        input.classList.remove('invalid');
    }
    else {
        input.classList.add('invalid');
        started.disabled = true;
    }
})


input.addEventListener('keyup', (e) => {
    if (isUUID(input.value)) {
        started.disabled = false;
        input.classList.remove('invalid');
    }
    else {
        input.classList.add('invalid');
        started.disabled = true;
    }
})


started.addEventListener('click', (e) => {
    e.preventDefault()

    window.location.href = `https://sandeshhd.github.io/enchatt/chat/?id=${input.value}`

})

const openModalOne = () => {
    createText.innerText = 'Create Server'
    copyLink.style = 'display:inline';
    input.style = 'border-right:none;pointer-events:none;border-top-right-radius: 0;border-bottom-right-radius: 0;';
    input.value = uuid
    copyLink.innerText = 'Copy'
    modal.classList.add('bg-active');
}

const closeModal = () => {
    modal.classList.remove('bg-active');
    input.classList.remove('invalid');
    started.disabled = false;
}
const openModalTwo = () => {
    createText.innerText = 'Join Server'
    started.disabled = true;
    copyLink.style = 'display:none';
    input.value = '';
    input.style = 'border-right:#a7a19c solid 1.8px;pointer-events:auto;border-radius:5px';
    input.placeholder = 'Your Room ID...'
    modal.classList.add('bg-active');
}

for (item of btn) {
    item.addEventListener('click', openModalOne)
}
for (item of joinButton) {
    item.addEventListener('click', openModalTwo)
}

for (items of x) {
    items.addEventListener('click', closeModal)
}

