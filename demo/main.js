/**
 * Created by mckeowr on 2/2/17.
 */
import {Mason, MasonDomRenderer, MasonSimplePacker, MasonDefaultPacker} from '../lib';
import {ResizeSensor} from 'css-element-queries';

var useSimplePacker = false;
function pack() {

        // find our container
        var dashboard = document.querySelector('.mason-container');
        var containerWidth = dashboard.offsetWidth;
        // find all the bricks in it
        // not all browsers are able to treat the results from querySelectorAll with array methods like forEach()
        // so this will make then an array
        var items = [].slice.call(dashboard.querySelectorAll('div.mason-brick'));

        // create a Mason and use it to fit the bricks into a container
        // the size of the 'dashboard'
        // since we are dealing with dom nodes, we need the MasonDomRenderer
        var renderer = new MasonDomRenderer();

        var opts = { // MasonOptions object here
            containerWidth: containerWidth,
            renderer: renderer,
            // this threshold signifies that even if a column to the right
            // would postion the tile closer to the top, it will prefer
            // a column to the left if the difference is less than this
            // many pixels. Make this 0 and check the demo and you will
            // see the difference in position of bricks 5 and 6 after the
            // show more button is clicked in brick 1
            threshold: 40,
            columns: 12,
            // implement your own packing logic
            // form example, import MasonSimplePacker and try that
            packer: useSimplePacker ? new MasonSimplePacker() : new MasonDefaultPacker()
        };

        var containerHeight = new Mason(opts).layout(items);
        dashboard.style.minHeight = containerHeight + 'px';

}

function start() {
    // initialize the layout
    pack();

    // in our case, we want to re layout the bricks when any of their sizes change.
    // if the bricks sizes can only change when the window is resized, you could use the
    // window resize event. However, if the bricks can resize themselves, you would want to do something
    // like this
    // ResizeSensor is from css-element-queries (which is listed as an optional dependency);
    new ResizeSensor(document.querySelector('.mason-container').querySelectorAll('div.mason-brick'), function() {
        pack();
    });

    document.getElementById('expandableExample').querySelector('button').addEventListener('click', function() {
       showMore();
    });

    document.getElementById('useSimple').addEventListener('change', togglePacker);
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

function togglePacker(evt) {
    useSimplePacker = evt.target.checked;
    pack();  
}

start();