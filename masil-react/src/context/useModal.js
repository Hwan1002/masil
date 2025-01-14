import { useState } from "react";

const useModal = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalActions, setModalActions] = useState([]);
    const [currentModal, setCurrentModal] = useState("");

    const openModal = ({ title = "", message = "", actions = [], modalType }) => {
        setModalOpen(true);
        setModalTitle(title || "");
        setModalMessage(message || "");
        setModalActions(actions || "");
        setCurrentModal(modalType || "default");
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalTitle("");
        setModalMessage("");
        setModalActions([]);
        setCurrentModal("");
    }

    return {
        isModalOpen,
        modalTitle,
        modalMessage,
        modalActions,
        openModal,
        closeModal,
        currentModal,
    };
};

export default useModal;
