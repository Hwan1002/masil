import { MESSAGES } from "../constants";

const ActionButtons = ({ onGoBack, onFindPassword }) => (
  <div className="FindId_flexrow">
    <button type="button" onClick={onGoBack} className="FindId_button">
      {MESSAGES.BUTTON_GO_BACK}
    </button>
    <button type="button" onClick={onFindPassword} className="FindId_button">
      {MESSAGES.BUTTON_FIND_PASSWORD}
    </button>
  </div>
);

export default ActionButtons;

