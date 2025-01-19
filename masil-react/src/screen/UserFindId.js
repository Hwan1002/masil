import React, { useState, useEffect } from 'react';
import '../css/UserFindId.css';
import { useNavigate } from 'react-router-dom';
import Modal from "../component/Modal";
import useModal from "../context/useModal";

const UserFindId = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [email, setEmail] = useState('');
    const [sentEmail, setSentEmail] = useState('');

    const {
        isModalOpen,
        modalTitle,
        modalMessage,
        modalActions,
        openModal,
        closeModal,
    } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email.trim() === '') {
            openModal({
                title: `이메일 입력`,
                message: `이메일을 입력해주세요.`,
            });
            return;
        }

        setIsLoading(true);
        setSentEmail(email);

        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true); // 이메일 발송 완료 상태로 설정
            setEmail('');
        }, 2000);
    };

    //엔터키 전송
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    // isSent 상태가 true로 변경될 때만 모달을 열도록 useEffect 사용
    useEffect(() => {
        if (isSent) {
            openModal({
                message: `${sentEmail} 이메일 주소로 회원님의 아이디를 발송했습니다.`,
            });
            setIsSent(false); // 모달을 한 번만 열도록 상태 초기화
        }
    }, [isSent, sentEmail, openModal]); // 의존성 배열에 isSent와 sentEmail 추가

    return (
        <form className='FindId_container' onSubmit={handleSubmit}>
            <h2>아이디 찾기</h2>

            <div className='FindId_left'>이메일</div>
            <div className="FindId_inputContainer">
                <div className="FindId_inputWrapper">
                    <input
                        className='FindId_input'
                        type='email'
                        placeholder='이메일 입력'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button type="submit" className='FindId_sendBtn'  disabled={isLoading || isSent}>
                        {isLoading ? "전송 중..." : "찾기"}
                    </button>
                </div>
            </div>

            <div className='FindId_flexrow'>
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className='FindId_button'
                >
                    돌아가기
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/userfindpwd')}
                    className='FindId_button'
                >
                    비밀번호 찾기
                </button>
            </div>

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

export default UserFindId;
