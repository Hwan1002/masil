import { MESSAGES } from "../constants";

const EmailVerificationStep = ({
  email,
  verifyCode,
  onEmailChange,
  onVerifyCodeChange,
  onSendEmail,
  onVerifyCode,
  onKeyPress,
  onGoBack,
  onLogin,
}) => (
  <>
    <div className="FindId_left">{MESSAGES.EMAIL_LABEL}</div>
    <div className="FindId_inputContainer">
      <div className="FindId_inputWrapper">
        <input
          className="FindId_input"
          type="email"
          name="email"
          placeholder={MESSAGES.PLACEHOLDER_EMAIL}
          value={email}
          onChange={onEmailChange}
          onKeyDown={onKeyPress}
        />
        <button type="submit" className="FindId_sendBtn" onClick={onSendEmail}>
          {MESSAGES.BUTTON_SEND}
        </button>
      </div>
    </div>

    <div className="FindId_left">{MESSAGES.VERIFY_CODE_LABEL}</div>
    <div className="FindId_inputContainer">
      <div className="FindId_inputWrapper">
        <input
          className="FindId_input"
          type="text"
          name="verifyCode"
          placeholder={MESSAGES.PLACEHOLDER_VERIFY_CODE}
          value={verifyCode}
          onChange={onVerifyCodeChange}
          onKeyDown={onKeyPress}
        />
        <button type="submit" className="FindId_sendBtn" onClick={onVerifyCode}>
          {MESSAGES.BUTTON_VERIFY}
        </button>
      </div>
    </div>

    <div className="FindId_flexrow">
      <button type="button" onClick={onGoBack} className="FindId_button">
        {MESSAGES.BUTTON_GO_BACK}
      </button>
      <button type="button" className="FindId_button" onClick={onLogin}>
        {MESSAGES.BUTTON_LOGIN}
      </button>
    </div>
  </>
);

export default EmailVerificationStep;







