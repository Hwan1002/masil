import { useUserFindId } from "../useUserFindId";
import Modal from "component/Modal";
import EmailInputField from "../components/EmailInputField";
import ActionButtons from "../components/ActionButtons";
import { MESSAGES } from "../constants";
import "css/UserFindId.css";

const UserFindId = () => {
  const {
    isLoading,
    email,
    setEmail,
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    handleSubmit,
    handleModalClose,
    handleKeyPress,
    handleGoBack,
    handleFindPassword,
  } = useUserFindId();

  return (
    <form className="FindId_container" onSubmit={handleSubmit}>
      <h2>{MESSAGES.TITLE}</h2>

      <EmailInputField
        email={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyPress={handleKeyPress}
        isLoading={isLoading}
      />

      <ActionButtons
        onGoBack={handleGoBack}
        onFindPassword={handleFindPassword}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={modalTitle}
        content={modalMessage}
        actions={modalActions}
      />
    </form>
  );
};

export default UserFindId;
