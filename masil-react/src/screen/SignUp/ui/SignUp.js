import { useSignUp } from "../useSignUp";
import Modal from "component/Modal";
import ProfilePhotoSection from "../components/ProfilePhotoSection";
import LocationSection from "../components/LocationSection";
import UserIdField from "../components/UserIdField";
import InputField from "../components/InputField";
import EmailVerificationField from "../components/EmailVerificationField";
import VerifyCodeField from "../components/VerifyCodeField";
import "css/SignUp.css";

const SignUp = () => {
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    closeModal,
    formData,
    pwdConfirm,
    setPwdConfirm,
    handleInputChange,
    imagePreview,
    inputImgRef,
    handleProfileClick,
    onImageUpload,
    certifiedBtn,
    verifyCodeConfirm,
    timer,
    isReadonly,
    verifyCode,
    setVerifyCode,
    handleIdDuplicate,
    handleSendVerificationCode,
    handleEmailVerification,
    handleSubmit,
    navigate,
  } = useSignUp();

  return (
    <div className="signup_form">
      <div className="signup_form_container">
        <h2>회원가입</h2>

        <form onSubmit={handleSubmit}>
          {/* 프로필 사진 섹션 */}
          <ProfilePhotoSection
            imagePreview={imagePreview}
            onProfileClick={handleProfileClick}
            inputRef={inputImgRef}
            onImageUpload={onImageUpload}
          />

          {/* 위치 선택 섹션 */}
          <LocationSection />

          {/* 사용자 정보 입력 섹션 */}
          <section className="form_input">
            {/* 아이디 */}
            <UserIdField
              value={formData.userId}
              onChange={handleInputChange}
              onDuplicateCheck={handleIdDuplicate}
            />

            {/* 이름 */}
            <InputField
              label="이름"
              id="userName"
              name="userName"
              type="text"
              value={formData.userName}
              onChange={handleInputChange}
              placeholder="이름을 입력하세요"
            />

            {/* 닉네임 */}
            <InputField
              label="닉네임"
              id="userNickName"
              name="userNickName"
              type="text"
              value={formData.userNickName}
              onChange={handleInputChange}
              placeholder="닉네임을 입력하세요"
            />

            {/* 비밀번호 */}
            <InputField
              label="비밀번호"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
            />

            {/* 비밀번호 확인 */}
            <InputField
              label="비밀번호 확인"
              id="pwdConfirm"
              name="pwdConfirm"
              type="password"
              value={pwdConfirm}
              onChange={(e) => setPwdConfirm(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
            />

            {/* 이메일 인증 */}
            <EmailVerificationField
              email={formData.email}
              onChange={handleInputChange}
              onSendCode={handleSendVerificationCode}
              isReadonly={isReadonly}
              certifiedBtn={certifiedBtn}
              timer={timer}
            />

            {/* 인증번호 입력 */}
            {certifiedBtn && (
              <VerifyCodeField
                verifyCode={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                onVerify={handleEmailVerification}
                verifyCodeConfirm={verifyCodeConfirm}
              />
            )}
          </section>

          {/* 제출 버튼 */}
          <div className="signUp_button">
            <button type="button" onClick={() => navigate(-1)}>
              취소
            </button>
            <button type="submit">가입하기</button>
          </div>
        </form>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title={modalTitle}
          content={modalMessage}
          actions={modalActions}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SignUp;
