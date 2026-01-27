const VerifyCodeField = ({
  verifyCode,
  onChange,
  onVerify,
  verifyCodeConfirm,
}) => (
  <div className="inputAll">
    <label className="dpLabel" htmlFor="verifyCode">
      인증번호
    </label>
    <div className="inputAndBtn">
      <input
        type="text"
        id="verifyCode"
        name="verifyCode"
        className="form-input"
        value={verifyCode}
        onChange={onChange}
        placeholder="인증번호를 입력하세요"
      />
      <button type="button" onClick={onVerify} disabled={verifyCodeConfirm}>
        인증확인
      </button>
    </div>
  </div>
);

export default VerifyCodeField;