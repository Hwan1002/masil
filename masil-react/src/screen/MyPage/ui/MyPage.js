import { useMyPage } from "../useMyPage";
import Modal from "component/Modal";
import LocationPicker from "component/LocationPicker";
import "css/MyPage.css";

const MyPage = () => {
  const {
    formData,
    isVerified,
    password,
    pwdConfirm,
    verifyCode,
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    inputImgRef,
    imagePreview,
    userDefault,
    navigate,
    setEmail,
    setVerifyCode,
    setPassWord,
    setPwdConfirm,
    closeModal,
    sendCertifyNumber,
    emailCertified,
    handleInputChange,
    handleKeyPress,
    putUserInfo,
    resetpassword,
    handleProfileClick,
    ImageUpload,
    basicImage,
  } = useMyPage();
  return (
    <div className="myPage_container">
      <div className="myPage_form">
        <h2>내 정보</h2>
        <form>
          <div className="form_input">
            <div className="profilePhoto">
              {imagePreview && formData.profilePhotoPath !== "default" ? (
                <div className="photoImg">
                  <img
                    src={
                      imagePreview
                        ? imagePreview
                        : `http://localhost:9090${formData.profilePhotoPath}`
                    }
                    alt="프로필 사진"
                  />
                </div>
              ) : (
                <div className="photoImg">
                  <img src={userDefault} alt="기본 프로필 사진" />{" "}
                  {/* 기본 이미지로 userDefault 사용 */}
                </div>
              )}
              <div className="flex gap-x-2">
                <button
                  type="button"
                  className="profileChangeBtn"
                  onClick={handleProfileClick}
                >
                  프로필 사진
                </button>
                <button
                  type="button"
                  className="profileChangeBtn"
                  onClick={basicImage}
                >
                  기본이미지
                </button>
              </div>

              <input
                name="profilePhoto"
                type="file"
                accept="image/*"
                ref={inputImgRef}
                onChange={ImageUpload}
                style={{ display: "none" }}
              />
            </div>

            <div className="inputAll">
              <div className="MyPage_inputAndBtn">
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="주소"
                  value={formData.address || ""}
                  readOnly
                />
                <div className="locationPicker">
                  <LocationPicker />
                </div>
              </div>
              <label for="id" className="dpLabel">
                아이디
              </label>
              <input
                type="text"
                name="user_name"
                id="id"
                className="form-input"
                value={formData.userId || ""}
                readOnly
              />
              <label for="userNick" className="dpLabel">
                닉네임
              </label>
              <input
                type="text"
                name="userNickName"
                id="userNick"
                className="form-input"
                value={formData.userNickName || ""}
                placeholder="닉네임을 입력하세요"
                onChange={(e) => {
                  handleInputChange(e);
                }}
              />

              {!isVerified ? (
                <>
                  <div className="myPageEmailContainer">
                    <div className="myPageEmailInput">
                      <label for="email" className="dpLabel">
                        이메일
                      </label>
                      <input
                        className="FindId_input"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="이메일 입력"
                        value={formData.email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyPress}
                        readOnly
                      />
                      <button
                        type="submit"
                        className="myPageSendBtn"
                        onClick={(e) => sendCertifyNumber(e)}
                      >
                        전송
                      </button>
                    </div>
                  </div>

                  <div className="myPageEmailContainer">
                    <div className="myPageEmailInput">
                      <input
                        className="FindId_input"
                        type="text"
                        name="verifyCode"
                        placeholder="인증번호 입력"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                      <button
                        type="submit"
                        className="myPageVerifyBtn"
                        onClick={(e) => emailCertified(e)}
                      >
                        인증
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="myPageEmailContainer">
                  <input
                    type="password"
                    name="password"
                    value={password}
                    placeholder="비밀번호"
                    onChange={(e) => setPassWord(e.target.value)}
                  />
                  <div className="myPageEmailInput">
                    <input
                      type="password"
                      placeholder="비밀번호 확인"
                      value={pwdConfirm}
                      onChange={(e) => setPwdConfirm(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="myPageSendBtn"
                      onClick={resetpassword}
                    >
                      변경
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="myPage_button">
              <button type="button" onClick={() => navigate("/")}>
                돌아가기
              </button>
              <button type="button" onClick={putUserInfo}>
                수정하기
              </button>
            </div>
          </div>
        </form>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalMessage}
        actions={modalActions}
      />
    </div>
  );
};
export default MyPage;
