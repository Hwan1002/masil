import React, { useState } from 'react';
import '../css/UserFindId.css';
import { useNavigate } from 'react-router-dom';
const UserFindPwd = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
    const [isSent, setIsSent] = useState(false); // 이메일 발송 완료 상태
    const [email, setEmail] = useState(''); // 입력값 관리
    const [isId, setIsId] = useState('');
    const [sentEmail, setSentEmail] = useState(''); // 발송된 이메일 기억

    const handleSubmit = (e) => {
        e.preventDefault(); // 기본 동작 방지

            //공백 폼전송 방지\
            if (isId.trim() === '') {
                alert('아이디를 입력해주세요.');
                return;
            }
            if (email.trim() === '') {
                alert('이메일을 입력해주세요.');
                return;
            }
    
    
        setIsLoading(true); // 로딩 시작
        setSentEmail(email); // 현재 입력된 이메일 저장
    
        // 로딩 시뮬레이션 (2초 후 로딩 종료 및 발송 완료)
        setTimeout(() => {
            setIsLoading(false); // 로딩 종료
            setIsSent(true); // 이메일 발송 완료 상태로 설정
            setEmail(''); // 입력창 비우기
            setIsId('');
        }, 2000);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e); // 엔터 키 입력 시 handleSubmit 호출
        }
    };
    

    return (
        <form className='FindId_container' onSubmit={handleSubmit}>
            <h2>비밀번호 찾기</h2>

            {/* 이메일 입력 및 전송버튼 */}
            <div className='FindId_left'>아이디</div>
            <div className="FindId_inputContainer">
              
                    <input
                        className='FindId_input'
                        type='text'
                        placeholder='아이디 입력'
                        value={isId}
                        onChange={(e) => setIsId(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
            
             
            </div>

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
                        className='FindId_sendBtn'>
                        {isLoading ? "전송 중..." : "찾기"}
                    </button>
                </div>

            </div>

            


            {/* 발송 완료 메시지 */}
            {isSent && (
                <div className="FindId_message">
                    {sentEmail} 이메일 주소로<br/> 회원님의 비밀번호를 발송했습니다.
                </div>
            )}

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
        </form>
    );
};

export default UserFindPwd
