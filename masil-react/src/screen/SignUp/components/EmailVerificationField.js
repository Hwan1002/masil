const EmailVerificationField = ({
  email,
  onChange,
  onSendCode,
  isReadonly,
  certifiedBtn,
  timer,
}) => (
  <div className="inputAll">
    <label className="dpLabel" htmlFor="email">
      이메일
    </label>
    <div className="inputAndBtn">
      <input
        type="email"
        id="email"
        name="email"
        className="form-input"
        value={email}
        onChange={onChange}
        placeholder="이메일을 입력하세요"
        readOnly={isReadonly}
      />
      <button type="button" onClick={onSendCode} disabled={certifiedBtn}>
        인증번호 전송
      </button>
    </div>
    {timer > 0 && (
      <div className="timer">
        {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
      </div>
    )}
  </div>
);

export default EmailVerificationField;

