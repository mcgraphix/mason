/**
 * Created by mckeowr on 2/2/17.
 */
import {Mason, MasonDomRenderer} from '../lib';
import {ResizeSensor} from 'css-element-queries';

function pack() {

        // find our container
        var dashboard = document.querySelector('.mason-container');
        var containerWidth = dashboard.offsetWidth;
        // find all the bricks in it
        var items = dashboard.querySelectorAll('div.mason-brick');

        // create a Mason and use it to fit the bricks into a container
        // the size of the 'dashboard'
        // since we are dealing with dom nodes, we need the MasonDomRenderer
        var renderer = new MasonDomRenderer();
        new Mason(renderer, containerWidth).layout(items);

}

function start() {
    // initialize the layout
    pack();

    // in our case, we want to re layout the bricks when any of their sizes change.
    // if the bricks sizes can only change when the window is resized, you could use the
    // window resize event. However, if the bricks can resize themselves, you would want to do something
    // like this
    new ResizeSensor(document.querySelector('.mason-container').querySelectorAll('div.mason-brick'), function() {
        pack();
    });

    document.getElementById('expandableExample').querySelector('button').addEventListener('click', function() {
       showMore();
    });
}

function resetHeight() {
    var firstTile = document.getElementById('expandableExample');
    firstTile.style.height = 'auto';
    firstTile.removeEventListener('transitionend', resetHeight);
}

function showMore() {
    var firstTile = document.getElementById('expandableExample');

    if (firstTile.style.height !== '400px') {
        var autoHeight = window.getComputedStyle(firstTile, null).height;
        firstTile.setAttribute('data-auto-height', autoHeight);
        firstTile.style.height = autoHeight;
        setTimeout(function() {
            firstTile.style.height = '400px';
        });
    } else {
        var targetHeight = firstTile.getAttribute('data-auto-height');
        firstTile.style.height = targetHeight;
        firstTile.addEventListener('transitionend', resetHeight);
    }
}

start();