
# mason-js
A simple horizontal masonry layout that works with dynamically sized items

## Install

```
npm install --save mason-js
``` 

## How it works
This module works by looking at all "bricks" within a container and then positioning them within the container doing its best to following rule:

- Each brick should be placed as close to the top as possible while fitting inside the column grid

It works by looking at the size of each item and then attempts to see into which column it can be place where it does not overlap any
other bricks in any of the columns it crosses. This allows for positioning bricks of indeterminate heights and anywhere from 1 - n columns wide where n is specified when you create a Mason.

## Example
````
function pack() {

        // find our container and get it's width
        var container = document.querySelector('.mason-container');
        var containerWidth = container.offsetWidth;
        
        // find all the bricks in it
        var items = dashboard.querySelectorAll('div.mason-brick');

        // create a Mason and use it to fit the bricks into a container
        // since we are dealing with dom nodes, we need the MasonDomRenderer
        // which uses CSS absolute positioning
        var renderer = new MasonDomRenderer();
        new Mason(renderer, containerWidth).layout(items);

}

// call it to layout the bricks
pack();

// listen for window resize events
window.addEventListener('resize', pack);
````

Your HTML and CSS would look like this:

````
<div class="mason-brick col-md-4">
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in accumsan elit.Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in accumsan elit.Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Vestibulum in accumsan elit.Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Vestibulum in accumsan elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in
            accumsan elit.

        </div>
    </div>
    <div class="mason-brick col-md-4">
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in accumsan elit.Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in accumsan elit.
        </div>
    </div>
     <div class="mason-brick col-md-4">
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in accumsan elit.Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in accumsan elit.
        </div>
    </div>
     <div class="mason-brick col-md-4">
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in accumsan elit.Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in accumsan elit.
        </div>
    </div>
</div>
````

CSS sizing could use Bootstrap, Foundation, etc. but here we will do it manually

````
.col-md-4 {
    width: 25%;
}
````

## Demo
Check out [the working demo](http://mcgraphix.github.io/mason/demo)
