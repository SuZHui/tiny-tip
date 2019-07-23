const hover = document.getElementById('hover');
const popper = document.getElementById('popper');

const tinyTip = new Tinytip(hover, {
    title: 'Hi, I\'m Popper'
});


const range = document.createRange()
range.setStart(hover, 0);
range.setEnd(popper, 0);
console.log(range)