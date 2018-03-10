
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
        
        // configure the options
        var opts = { // MasonOptions object here
                containerWidth: containerWidth,
                renderer: renderer,
                // this threshold signifies that even if a column to the right
                // would postion the tile closer to the top, it will prefer
                // a column to the left if the difference is less than this
                // many pixels
                threshold: 40, 
                columns: 12
            };
        // After calculating the positions of all the bricks, it will return the new
        // required height of the container which you must use to set the height
        // if you want content surrounding the container to flow around it
         
        var containerHeight = new Mason(renderer, containerWidth).layout(items);
        container.style.minHeight = containerHeight + 'px';
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
## Custom Layout Logic
Internally Mason uses a `MasonPacker` to determine the best column for each brick. Internally, this is done
using the `MasonDefaultPacker`. However, you may want to determine the best column in your own way. You can
provide your own implementation of `MasonPacker` vias the `MasonOptions.packer` property. As an example,
there is a `MasonSimplePacker` included in this package that will just choose the next column sequentially.
One difference is that when a brick increases in height, it will just push the items below it in its column
will just get pushed down, intead of reshuffling everything around. This packer requires that each brick be 
the same width for it to work though.

## Demo
Check out [the working demo](http://mcgraphix.github.io/mason/demo/index.html)
