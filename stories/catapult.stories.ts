import { storiesOf } from '@storybook/html';
import create from './create/index';
import scrollBehavior from './scrollBehavior/index';

storiesOf('Catapult', module)
    .add('create', () => create())
    .add('scroll behavior', () => scrollBehavior())