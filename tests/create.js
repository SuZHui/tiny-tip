document.addEventListener('DOMContentLoaded', function() {
    const hover = document.getElementById('hover');
    const popper = document.getElementById('popper');
    
    let tinyTip;

    hover.addEventListener('mouseover', function() {
        // tinyTip && tinyTip.destroy();
        if (!tinyTip) {
            const constructor = window.Tinytip
            // tinyTip = new constructor(hover, popper, {
            //     title: 'Hi, I\'m Popper',
            //     placement: 'top',
            //     onCreate(e) {
            //         console.log(e);
            //     }
            // });
            tinyTip = new constructor(hover, popper);
        }

    });

    hover.addEventListener('mouseleave', function() {
        if (tinyTip) {
            tinyTip.destroy();
            tinyTip = null;
        }
    });

    // hover.addEventListener('mouseout', function() {
    //     tinyTip && tinyTip.destroy();
    // });
});