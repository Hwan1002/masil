import { MESSAGES } from "../constants";

const PasswordResetStep = ({
  password,
  pwdConfirm,
  onPasswordChange,
  onPwdConfirmChange,
  onResetPassword,
  onFindId,
}) => (
  <>
    <div className="FindId_left">{MESSAGES.NEW_PASSWORD_LABEL}</div>
    <div className="FindId_inputContainer">
      <div className="FindId_inputWrapper">
        <input
          className="FindId_input"
          type="password"
          placeholder={MESSAGES.PLACEHOLDER_NEW_PASSWORD}
          value={password}
          onChange={onPasswordChange}
        />
      </div>
    </div>

    <div className="FindId_left">{MESSAGES.PASSWORD_CONFIRM_LABEL}</div>
    <div className="FindId_inputContainer">
      <div className="FindId_inputWrapper">
        <input
          className="FindId_input"
          type="password"
          placeholder={MESSAGES.PLACEHOLDER_PASSWORD_CONFIRM}
          value={pwdConfirm}
          onChange={onPwdConfirmChange}
        />
      </div>
    </div>

    <div className="FindId_flexrow">
      <button type="button" onClick={onFindId} className="FindId_button">
        {MESSAGES.BUTTON_FIND_ID}
      </button>
      <button type="submit" className="FindId_sendBtn" onClick={onResetPassword}>
        {MESSAGES.BUTTON_CHANGE}
      </button>
    </div>
  </>
);

export default PasswordResetStep;






