import React, { useState, useEffect } from 'react';
import '../css/UserFindId.css';
import { useNavigate } from 'react-router-dom';
import Modal from "../component/Modal";
import useModal from "../context/useModal";
import axios from 'axios';

const UserFindPwd = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
    const [email, setEmail] = useState(''); // 입력값 관리
    const [isVerified, setIsVerified] = useState(false);
    //이메일 인증 버튼 눌렀는지
    const [certifiedBtn, setCertifiedBtn] = useState(false);
    //비밀번호 확인  & 인증코드 상태 따로 관리
    const [pwd, setPwd] = useState('');
    const [pwdConfirm, setPwdConfirm] = useState("");
    const [verifyCode, setVerifyCode] = useState("");
    const {
        isModalOpen,
        modalTitle,
        modalMessage,
        modalActions,
        openModal,
        closeModal,
    } = useModal();

    //이메일 인증번호 전송 요청
    const sendCertifyNumber = async (e) => {
        e.preventDefault();
        setCertifiedBtn(false);
        try {
            const response = await axios.post('http://localhost:9090/user/send-email', { email: email });
            if (response) {
                setCertifiedBtn(true);
                openModal({
                    message: response.data.value
                })
            }
        } catch (error) {
            console.log(error.response.data.error);
        }
    }

    //인증번호 일치여부
    const emailCertified = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9090/user/verify', {
                email: email, verifyCode: verifyCode
            });
            if (response) {
                setIsVerified(true);
                openModal({
                    message: response.data.value,
                    message: "인증이 완료되었습니다. 비밀번호 설정페이지로 넘어갑니다."
                })
                console.log("현재veri", verifyCode)
            }
        } catch (error) {
            console.log(error.response.data.error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 동작 방지

        if (email.trim() === '') {
            openModal({
                title: `이메일 입력`,
                message: `이메일을 입력해주세요.`,
            });
            return;
        }


        setIsLoading(true); // 로딩 시작
    };

    // 엔터 키 전송
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e); // 엔터 키 입력 시 handleSubmit 호출
        }
    };

    return (
        <form className='FindId_container' onSubmit={handleSubmit}>
            <h2>비밀번호 찾기</h2>

            {/* 인증되지 않은 경우 이메일과 인증번호 입력 필드 보여주기 */}
            {!isVerified ? (
                <>
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
                            <button
                                type="submit"
                                className='FindId_sendBtn'
                                disabled={isLoading}
                                onClick={(e) => sendCertifyNumber(e)}
                            >
                                {isLoading ? "전송 중..." : "전송"}
                            </button>
                        </div>
                    </div>

                    <div className='FindId_left'>인증번호</div>
                    <div className="FindId_inputContainer">
                        <div className="FindId_inputWrapper">
                            <input
                                className='FindId_input'
                                type='text'
                                placeholder='인증번호 입력'
                                value={verifyCode}
                                onChange={(e) => setVerifyCode(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <button
                                type="submit"
                                className='FindId_sendBtn'
                                disabled={isLoading}
                                onClick={(e) => emailCertified(e)}
                            >
                                {isLoading ? "전송 중..." : "인증"}
                            </button>
                        </div>
                    </div>
                    {/* 돌아가기 버튼 및 비밀번호 찾기 버튼 */}
                    <div className='FindId_flexrow'>
                        <button
                            type="button"
                            onClick={() => navigate('/userfindid')}
                            className='FindId_button'
                        >
                            돌아가기
                        </button>
                        <button type="button" className='FindId_button' onClick={() => navigate('/login')}>
                            로그인
                        </button>
                    </div>
                </>

            ) : (
                // 인증 완료 후 비밀번호 입력 칸 표시
                <>
                    <div className='FindId_left'>새 비밀번호</div>
                    <div className="FindId_inputContainer">
                        <div className="FindId_inputWrapper">
                            <input
                                className='FindId_input'
                                type='password'
                                placeholder='새 비밀번호 입력'
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='FindId_left'>비밀번호 확인</div>
                    <div className="FindId_inputContainer">
                        <div className="FindId_inputWrapper">
                            <input
                                className='FindId_input'
                                type='password'
                                placeholder='비밀번호 확인 입력'
                                value={pwdConfirm}
                                onChange={(e) => setPwdConfirm(e.target.value)}
                            />
                        </div>
                    </div>
                         {/* 돌아가기 버튼 및 비밀번호 찾기 버튼 */}
                         <div className='FindId_flexrow'>
                        <button
                            type="button"
                            onClick={() => navigate('/userfindid')}
                            className='FindId_button'
                        >
                            아이디 찾기
                        </button>
                        <button type="button" className='FindId_button' onClick={() => navigate('/login')}>
                            비밀번호 재설정
                        </button>
                    </div>
                </>
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

export default UserFindPwd
