const UserIdField = ({ value, onChange, onDuplicateCheck }) => (
  <div className="inputAll">
    <label className="dpLabel" htmlFor="userId">
      아이디
    </label>
    <div className="inputAndBtn">
      <input
        type="text"
        id="userId"
        name="userId"
        className="form-input"
        value={value}
        onChange={onChange}
        placeholder="아이디를 입력하세요"
      />
      <button type="button" onClick={onDuplicateCheck}>
        중복확인
      </button>
    </div>
  </div>
);

export default UserIdField;

