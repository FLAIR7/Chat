const url = "https://localhost:8080/ws";
const getElemId = id => document.getElementById(id);
const getElemClass = className => document.getElementsByClassName(className)[0];
const username = () => getElemId('inputName').value; // get the input from the login page
const setUsername = value => getElemId('inputName').value = value; // set the valud from the login page
const stompClient = null;

/* VALIDATIONS */

const exists = (value) => !value;
const validateString = (value) => !value.replace(/\s/g, '').length
const validateLength = (value) => value.length < 3

/* UTILS */

const on = R.curry(function(eventType, element, fn) {
    element.addEventListener(eventType, fn);

    return function(){
        element.removeEventListener(eventType, fn);
    }
});

const addClass = R.curry(function(className, element) {
    element.classList.add(className);
    return element;
});

const removeClass = R.curry(function(className, element) {
    element.classList.remove(className);
    return element;
});

const clear = R.curry((element) => {
    element.innerHTML = '';
    return element;
});

const validation = R.curry((value) => {
    return exists(value) || validateString(value) || validateLength(value) ?
        alert('Name invalid') : addClass('d-none', getElemClass('login-page'));
});

/* MAIN FUNCTIONS */

function login(dispatch, output) {
    clear();

    const stop = dispatch((e) => {
        stop();
        const newUser = username();
        validation(newUser);
        login(dispatch)    
    });
}

function message(){
    return R.compose(

        addClass('container'),
    )(getElemId('msg'))
}

const button = on('click', getElemId('loginBtn'));

login(
    button
)

