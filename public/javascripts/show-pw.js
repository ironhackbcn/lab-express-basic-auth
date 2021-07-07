'use strict';

const show = () => {
    const showLink = document.getElementById('show-pw');
    const pw = document.getElementById('password');

    showLink.addEventListener('click', (event) => {
        pw.removeAttribute('type');
    });
};

window.addEventListener('load', show);
