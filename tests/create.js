document.addEventListener('DOMContentLoaded', function() {
    const hover = document.getElementById('hover');
    const popper = document.getElementById('popper');
    const popper2 = document.createElement('div');
    popper2.innerHTML = 'I\'m Popper II';
    popper2.classList.add('popper2');
    
    let tinyTip;

    hover.addEventListener('mouseover', function() {
        // tinyTip && tinyTip.destroy();
        if (!tinyTip) {
            const constructor = window.Tinytip
            tinyTip = new constructor(hover, popper, {
                placement: 'bottom',
                onCreate: console.log
            });
        }

    });

    hover.addEventListener('mouseleave', function() {
        // if (tinyTip) {
        //     tinyTip.destroy();
        //     tinyTip = null;
        // }
    });

});