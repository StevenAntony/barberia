const btnLayout = document.getElementsByClassName('btnLayout')[0];
const mainLayout = document.getElementsByClassName('layoutMain')[0];
const contentLayout = document.getElementsByClassName('contentLayout')[0];
const pathname = window.location.pathname;

document.addEventListener("DOMContentLoaded", function(event) {
    console.log(window.innerWidth);
    if (window.innerWidth <= 768) {
        mainLayout.classList.add('showLayout')
        contentLayout.classList.add('showContentLayout')
    }
});

const handlerLayout = () => {
    if (mainLayout.classList.contains('showLayout')) {
        mainLayout.classList.remove('showLayout')
        contentLayout.classList.remove('showContentLayout')
    }else{
        mainLayout.classList.add('showLayout')
        contentLayout.classList.add('showContentLayout')
    }
    
}

btnLayout.addEventListener('click',handlerLayout)