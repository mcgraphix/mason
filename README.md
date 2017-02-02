
# mason-js
A simple horizontal masonry layout that works with dynamically sized items

## To use
This module works by looking at all "bricks" within a container and then positioning them within the container doings its best to following rule:

- Each brick should be placed as close to the top as possible

It works by looking at the size of each item and then attempts to see which column into which it can be place where it does not overlap any
other bricks in any of the columns it crosses. This allows for positioning bricks of indeterminate heights and anywhere from 1 - 12 columns wide.
