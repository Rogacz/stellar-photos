/*
 * This component is for the hamburger menu that toggles the history pane
 */

const hamburgerMenu = () => `
    <button id="historyButton" class="s-ui historyButton historyButton-open 
    hidden" title="toggle history menu" aria-label="Toggle History Menu">
      <div>
        <i class="bar1"></i>
        <i class="bar2"></i>
        <i class="bar3"></i>
      </div>
    </button>
`;

export default hamburgerMenu;