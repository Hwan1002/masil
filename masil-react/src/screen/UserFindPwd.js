import React, { useState, useEffect } from 'react';
import '../css/UserFindId.css';
import { useNavigate } from 'react-router-dom';
import Modal from "../component/Modal";
import useModal from "../context/useModal";
import axios from 'axios';
import LoadingModal from '../component/LoadingModal';

const UserFindPwd = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(''); // 이메일 입력값 관리: 사용자가 입력하는 이메일
    const [isVerified, setIsVerified] = useState(false); // 인증 상태: 이메일 인증 완료 여부
    const [password, setPassWord] = useState(''); // 새 비밀번호 입력값 관리: 사용자가 입력하는 새 비밀번호
    const [pwdConfirm, setPwdConfirm] = useState(""); // 비밀번호 확인 입력값 관리: 새 비밀번호와 일치하는지 확인
    const [verifyCode, setVerifyCode] = useState(""); // 인증 코드 입력값 관리: 사용자가 입력한 인증 코드
    
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
        openModal({
            title: "전송 중",
            message: <LoadingModal />,
        });
        try {
            const response = await axios.post(`http://localhost:9090/user/findPassword`, { email: email });
            if (response) {
                openModal({
                    message: response.data.value
                })
            }
        } catch (error) {
            openModal({
                message: error.response.data.error
            })
        }
    }

    //인증번호 일치여부
    const emailCertified = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:9090/user/verify`, {
                email: email, verifyCode: verifyCode
            });
            if (response) {
                setIsVerified(true);
                openModal({
                    message: response.data.value,
                    message: "비밀번호 설정 페이지로 넘어갑니다."
                })
            }
        } catch (error) {
            openModal({
                message: error.response.data.error
            })
        }
    }

    //비밀번호 재설정 put요청청
    const resetpassword = async () => {
        if (password.trim() === "" || pwdConfirm.trim() === "") {
            openModal({
                message: "비밀번호를 입력해주세요.",
            });
            return;
        }

        if (password !== pwdConfirm) {
            openModal({
                message: "비밀번호가 일치하지 않습니다.",
            });
            return;
        }

        try {
            const response = await axios.put(`http://localhost:9090/user/ResetPassword`, {
                email: email,
                password: password
            });

            if (response.status === 200) {
                openModal({
                    message: response.data.value,
                    actions: [
                        {
                            label: "확인",
                            onClick: () => navigate("/login")
                        }
                    ]
                });
            }
        } catch (error) {
            openModal({
                message: "비밀번호 변경에 실패했습니다. 다시 시도해주세요.",
            });
            console.error(error);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 동작 방지

        if (pwdConfirm !== password) {
            openModal({
                message: "비밀번호가 일치하지 않습니다.",
            });
            return;
        }

        if (email.trim() === '') {
            openModal({
                title: `이메일 입력`,
                message: `이메일을 입력해주세요.`,
            });
            return;
        }
    };

    // 엔터 키 전송
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            if (e.target.name === "email") {
                sendCertifyNumber(e); // 이메일 전송 버튼 기능 실행
            } else if (e.target.name === "verifyCode") {
                emailCertified(e); // 인증번호 확인 버튼 기능 실행
            } else if (isVerified && e.target.name === "passwordConfirm") {
                handleSubmit(e); // 비밀번호 변경 제출 실행
            }
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
                                name='email'
                                placeholder='이메일 입력'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <button
                                type="submit"
                                className='FindId_sendBtn'
                                onClick={(e) => sendCertifyNumber(e)}
                            >
                                전송
                            </button>
                        </div>
                    </div>

                    <div className='FindId_left'>인증번호</div>
                    <div className="FindId_inputContainer">
                        <div className="FindId_inputWrapper">
                            <input
                                className='FindId_input'
                                type='text'
                                name='verifyCode'
                                placeholder='인증번호 입력'
                                value={verifyCode}
                                onChange={(e) => setVerifyCode(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <button
                                type="submit"
                                className='FindId_sendBtn'
                                onClick={(e) => emailCertified(e)}
                            >
                                인증
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
                                value={password}
                                onChange={(e) => setPassWord(e.target.value)}
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
                        <button type="button" className='FindId_button' onClick={(e) => resetpassword()}>
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
