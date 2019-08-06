import { storiesOf } from '@storybook/html';
import { Catapult } from '../src/Catapult';
import { wrapperGenerate } from './setup';

import './catapult.css';

storiesOf('Catapult', module)
    .add('create', () => {
        const wrapper = wrapperGenerate();
        wrapper.innerHTML = `<div class="container"></div>
        <br>
        <div class="container">
            <button
                id="hover"
                >hover me
            </button>
        </div>
        <div id="popper" class="popper1">
            This is a popper
        </div>`;

        const hover = <HTMLElement>wrapper.querySelector('#hover');
        const popper = <HTMLElement>wrapper.querySelector('#popper');
        let tinyTip: Catapult;
        hover.addEventListener('mouseover', function() {
            // tinyTip && tinyTip.destroy();
            if (!tinyTip) {
                tinyTip = new Catapult(hover, popper, {
                    placement: 'right',
                    onCreate: console.log
                });
            }
    
        });

        return wrapper;
    });