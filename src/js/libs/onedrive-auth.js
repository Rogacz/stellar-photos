import { saveToOneDrive } from './onedrive';
import { validateResponse } from './helpers';
import { authorizeOnedrive, refreshOnedriveTokenApi } from '../api';
import {
  notifyCloudAuthenticationSuccessful,
  notifyCloudConnectionFailed,
} from './notifications';
import loadingIndicator from './loading-indicator';

const createAppFolder = onedriveData => {
  const headers = new Headers({
    Authorization: `bearer ${onedriveData.access_token}`,
  });

  const init = {
    method: 'GET',
    headers,
  };

  const request = new Request(
    'https://graph.microsoft.com/v1.0/drive/special/approot',
    init
  );

  fetch(request)
    .then(validateResponse)
    .then(() => {
      localStorage.setItem('onedrive', JSON.stringify(onedriveData));

      notifyCloudAuthenticationSuccessful('Onedrive');

      chrome.runtime.sendMessage({
        command: 'set-onedrive-alarm',
        expires_in: onedriveData.expires_in,
      });

      chrome.runtime.sendMessage({ command: 'update-cloud-status' });
    })
    .catch(error => {
      console.log(error);
      notifyCloudConnectionFailed('Onedrive');
    });
};

const onedriveAuth = code => {
  if (code) {
    authorizeOnedrive(code)
      .then(data => {
        const onedriveData = Object.assign(
          {
            timestamp: Date.now(),
          },
          data
        );

        createAppFolder(onedriveData);
      })
      .catch(error => {
        console.log(error);
        notifyCloudConnectionFailed('Onedrive');
      });
  }
};

const refreshOnedriveToken = imageId => {
  const onedriveData = JSON.parse(localStorage.getItem('onedrive'));
  refreshOnedriveTokenApi(onedriveData.refresh_token)
    .then(data => {
      const onedrive = Object.assign(
        {
          timestamp: Date.now(),
        },
        data
      );

      localStorage.setItem('onedrive', JSON.stringify(onedrive));

      chrome.runtime.sendMessage({
        command: 'set-onedrive-alarm',
        expires_in: onedriveData.expires_in,
      });

      if (imageId) {
        saveToOneDrive(imageId);
      }
    })
    .catch(error => {
      console.log(error);

      if (imageId) {
        loadingIndicator().stop();
        notifyCloudConnectionFailed('Onedrive');
      }
    });
};

export { onedriveAuth, refreshOnedriveToken };
