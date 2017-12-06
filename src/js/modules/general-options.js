import Ladda from 'ladda';
import purify from '../libs/purify-dom';
import { $ } from '../libs/helpers';
import notifySnackbar from '../libs/notify-snackbar';
import generalPopoverView from '../components/general-popover-view';

/*
 * Handles General Options
 */

const updateCollections = (collections) => {
  if (!collections) {
    notifySnackbar('Collection IDs not valid!', 'error');

    return;
  }

  const spinner = Ladda.create(document.querySelector('.update-collections'));
  spinner.start();

  fetch(`https://stellar-photos.herokuapp.com/api/validate/${collections}`)
    .then(response => response.text())
    .then((data) => {
      spinner.stop();

      const json = JSON.parse(data);
      if (json.error) {
        notifySnackbar(json.error, 'error');

        return;
      }

      chrome.storage.sync.set({ collections });

      notifySnackbar(json.message);

      chrome.runtime.sendMessage({ command: 'load-data' });
    }).catch(() => {
      spinner.stop();

      notifySnackbar('Oh Snap! An error occurred', 'error');
    });
};

const updatePhotoFrequency = (selected) => {
  chrome.storage.sync.set({ photoFrequency: selected });

  if (selected === 'everyhour') {
    chrome.alarms.create('loadphoto', {
      periodInMinutes: 60,
    });
  }

  if (selected === 'everyday') {
    chrome.alarms.create('loadphoto', {
      periodInMinutes: 1440,
    });
  }

  notifySnackbar('Preferences saved successfully');
};

const openDefaultTab = (e) => {
  e.preventDefault();
  chrome.tabs.update({
    url: 'chrome-search://local-ntp/local-ntp.html',
    active: true,
    selected: true,
  });
};

const openChromeApps = (e) => {
  e.preventDefault();
  chrome.tabs.update({
    url: 'chrome://apps/',
    active: true,
    selected: true,
  });
};

const initializeCollections = () => {
  chrome.storage.sync.get('collections', (d) => {
    const { collections } = d;
    const collectionsInput = $('unsplash-collections__input');
    collectionsInput.value = collections;

    const collectionsForm = $('unsplash-collections');
    collectionsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = collectionsInput.value.trim().replace(/ /g, '');
      updateCollections(value);
    });
  });
};

const initializePhotoFrequency = () => {
  chrome.storage.sync.get('photoFrequency', (res) => {
    const { photoFrequency } = res;

    if (photoFrequency) {
      const selectPhotoFrequency = $('select-photo-frequency');
      selectPhotoFrequency.value = photoFrequency;
    } else {
      updatePhotoFrequency('newtab');
    }

    const savePhotoFrequency = $('save-photo-frequency');
    savePhotoFrequency.addEventListener('click', () => {
      const selectPhotoFrequency = $('select-photo-frequency');
      const selected = selectPhotoFrequency[selectPhotoFrequency.selectedIndex]
        .value;
      updatePhotoFrequency(selected);
    });
  });
};

const intializeGeneralOptions = () => {
  const popoverView = $('popover-view');
  popoverView.insertAdjacentHTML('afterbegin',
    purify.sanitize(generalPopoverView()));

  const openDefaultTabButton = $('show-default-tab');
  openDefaultTabButton.addEventListener('click', openDefaultTab);

  const openChromeAppsButton = $('show-chrome-apps');
  openChromeAppsButton.addEventListener('click', openChromeApps);

  initializeCollections();

  initializePhotoFrequency();
};

export default intializeGeneralOptions;
