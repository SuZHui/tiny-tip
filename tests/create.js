document.addEventListener('DOMContentLoaded', function() {
    const hover = document.getElementById('hover');
    const popper = document.getElementById('popper');
    
    let tinyTip;

    hover.addEventListener('mouseover', function() {
        // tinyTip && tinyTip.destroy();
        if (!tinyTip) {
            tinyTip = new Tinytip(hover, popper, {
                title: 'Hi, I\'m Popper',
                placement: 'right'
            });
        }

    });

    // hover.addEventListener('mouseout', function() {
    //     tinyTip && tinyTip.destroy();
    // });
});