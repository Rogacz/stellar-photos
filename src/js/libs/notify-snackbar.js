import { $ } from './helpers';
import purify from './purify-dom';
import snackbar from '../components/snackbar';

const notifySnackbar = (message, className = '') => {
  $('app').insertAdjacentHTML(
    'beforeend',
    purify.sanitize(`
    ${snackbar(message, className)}
  `)
  );

  setTimeout(() => {
    const snackbarElement = document.querySelector('.snackbar');
    snackbarElement.parentNode.removeChild(snackbarElement);
  }, 3400);
};

export default notifySnackbar;
