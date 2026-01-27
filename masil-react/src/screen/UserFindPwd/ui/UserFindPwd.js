import { useUserFindPwd } from "../useUserFindPwd";
import Modal from "component/Modal";
import EmailVerificationStep from "../components/EmailVerificationStep";
import PasswordResetStep from "../components/PasswordResetStep";
import { MESSAGES } from "../constants";
import "css/UserFindId.css";

const UserFindPwd = () => {
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    closeModal,
    email,
    setEmail,
    isVerified,
    password,
    setPassword,
    pwdConfirm,
    setPwdConfirm,
    verifyCode,
    setVerifyCode,
    handleSubmit,
    handleSendVerificationCode,
    handleVerifyCode,
    handleResetPassword,
    handleKeyPress,
    handleGoBack,
    handleLogin,
    handleFindId,
  } = useUserFindPwd();

  return (
    <form className="FindId_container" onSubmit={handleSubmit}>
      <h2>{MESSAGES.TITLE}</h2>

      {!isVerified ? (
        <EmailVerificationStep
          email={email}
          verifyCode={verifyCode}
          onEmailChange={(e) => setEmail(e.target.value)}
          onVerifyCodeChange={(e) => setVerifyCode(e.target.value)}
          onSendEmail={handleSendVerificationCode}
          onVerifyCode={handleVerifyCode}
          onKeyPress={handleKeyPress}
          onGoBack={handleGoBack}
          onLogin={handleLogin}
        />
      ) : (
        <PasswordResetStep
          password={password}
          pwdConfirm={pwdConfirm}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onPwdConfirmChange={(e) => setPwdConfirm(e.target.value)}
          onResetPassword={handleResetPassword}
          onFindId={handleFindId}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalMessage}
        actions={modalActions}
      />
    </form>
  );
};

export default UserFindPwd;








