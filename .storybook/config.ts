import { configure } from '@storybook/html';
// import { wrapperGenerate } from '../stories/setup';

// const setup = storyFn => {
//   const wrapper = wrapperGenerate();  
//   wrapper.innerHTML = storyFn();
//   return wrapper;
// };

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

// add global decorator
// addDecorator(setup);
configure(loadStories, module);
