import { MESSAGES } from "../constants";

const EmailInputField = ({
  email,
  onChange,
  onKeyPress,
  isLoading,
  onSubmit,
}) => (
  <>
    <div className="FindId_left">{MESSAGES.EMAIL_LABEL}</div>
    <div className="FindId_inputContainer">
      <div className="FindId_inputWrapper">
        <input
          className="FindId_input"
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={onChange}
          onKeyDown={onKeyPress}
        />
        <button type="submit" className="FindId_sendBtn" disabled={isLoading}>
          {isLoading ? MESSAGES.BUTTON_SENDING : MESSAGES.BUTTON_FIND}
        </button>
      </div>
    </div>
  </>
);

export default EmailInputField;

