/**
 * Created by mckeowr on 2/2/17.
 */
function pack() {
    require(['mason'], function(mason) {

        // find our container
        var dashboard = document.querySelector('.mason-container');

        // find all the bricks in it
        var items = dashboard.querySelectorAll('div.mason-brick');

        // create a Mason and use it to fit the bricks into a container
        // the size of the 'dashboard'
        var coords = new mason.Mason(dashboard.offsetWidth).fit(items);

        coords.forEach(function (def) {
            // apply the calculated position for each brick however you want. In this case
            // we are just setting the CSS position. Animation will be provided via CSS
            def.element.setAttribute('style',
                'left:' + ((def.x/12) * 100) +'%; top: ' + def.yPos + 'px');
        });

    });
}



requirejs(['/lib-common/mason.js'], function() {
   pack();
    // var resizeTimer = -1;
    // we could manuall debouce here using a timer
    window.addEventListener('resize', function() {
        // clearTimeout(resizeTimer);
        // resizeTimer = setTimeout(function() {
             pack();
        // }, 100);
    });
});