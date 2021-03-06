/*
 * Settings for cloud synchronization
 */

const cloudPopoverView = () => `
  <section id="cloud-settings" class="cloud-settings">
    <div class="saveTo">
      <span class="popover-label">Connect and sync photos to your preferred cloud
      service.
        <a href="https://github.com/ayoisaiah/stellar-photos/wiki/Privacy-Policy">
        Privacy Policy</a>
      </span>

      <select class="select-cloud-Storage" id="select-cloud-storage">
        <option disabled selected value="noneselected"> -- Select an option -- </option>
        <option value="dropbox">Dropbox</option>
        <option value="onedrive">OneDrive</option>
      </select>

      <span class="action" id="action"></span>

    </section>
  </section>
`;

export default cloudPopoverView;
