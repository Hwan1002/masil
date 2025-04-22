import React, { useState, useEffect, useContext } from "react";
import { useParams,useNavigate, redirect } from 'react-router-dom';
import '../css/SelectedRentalItem.css'
import axios from 'axios';
import moment from 'moment';
import { Api } from '../context/MasilContext';



const SelectedRentalItem = () => {
    const { idx } = useParams();
    const [item, setItem] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();


    const fetchPostItem = async (idx) => {
        try {
            const response = await Api.get(`/post/item/${idx}`);
            setItem(response.data)
            console.log(response.data);
        } catch (error) {
            console.error("데이터 요청 실패:", error);
            return null;
        }
    };



    const deletePostItem = async (idx) => {
        try {
            const response = await Api.delete(`/post/${idx}`);

            console.log(response.data.value);
        } catch (error) {
            console.error("게시글 삭제 실패:", error);
        }
    };

 

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchPostItem(idx);
            if (data) {
                // setState(data) 등 처리
            }
        };

        loadData();
    }, [idx]);

    const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
        return moment(date).format(format);
    }

    const curency = (number) => {
        const num = Number(number);
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const prevImage = () => {
        if (item.postPhotoPaths && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const nextImage = () => {
        if (item.postPhotoPaths && currentImageIndex < item.postPhotoPaths.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    const handleGoBack = () => {
        navigate('/rentalitem'); 
    };



    return (
        <div className='selected-container'>
            <div className="selected-ud">
                <div>
                    <button onClick={handleGoBack}>뒤로가기</button>
                </div>
                <div>
                    <button className="selected-u">수정</button>
                    <button onClick={(e) => deletePostItem(idx)}>삭제</button>
                </div>
            </div>
            <div className='selected-item-container'>
                <div className='selected-photo-container'>
                    <div className="selected-title">{item.postTitle}</div>
                    <div className="carousel-container">
                        {item.postPhotoPaths && item.postPhotoPaths.length > 0 && (
                            <>
                                <img
                                    src={`http://localhost:9090${item.postPhotoPaths[currentImageIndex]}`}
                                    className="selected-rental-image"
                                />
                                {currentImageIndex > 0 && (
                                    <div className="carousel-prev" onClick={prevImage}>❮</div>
                                )}
                                {currentImageIndex < item.postPhotoPaths.length - 1 && (
                                    <div className="carousel-next" onClick={nextImage}>❯</div>
                                )}
                            </>
                        )}
                        <div className="carousel-indicators">
                            {item.postPhotoPaths && item.postPhotoPaths.map((_, index) => (
                                <span
                                    key={index}
                                    className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => goToImage(index)}
                                ></span>
                            ))}
                        </div>
                    </div>
                    <div className="selected-bottom-title">
                        <img
                            src={`http://localhost:9090${item.userProfilePhotoPath}`}
                            alt={item.postIdx}
                            className="selected-rental-profile-image"
                        />
                        <div className="selected-explanation">
                            <div className="selected-rental-profile-text">{item.userNickName}</div>
                            <div className="selected-rental-profile-text">{item.userAddress}</div>
                        </div>
                    </div>
                </div>
                <div className='selected-description-container'>
                    <div className="selected-dp-title">
                        <div className="selected-dp-sub-container">
                            <div className="selected-dp-item-title">등록일</div>
                            <div className="selected-dp-item">{formatDate(item.updateDate)}</div>
                        </div>
                        <div className="selected-dp-sub-container">
                            <div className="selected-dp-item-title">대여일</div>
                            <div className="selected-dp-item">{formatDate(item.postStartDate)}</div>
                        </div>
                        <div className="selected-dp-sub-container">
                            <div className="selected-dp-item-title">가격</div>
                            <div className="selected-dp-item">{curency(item.postPrice)}원</div>
                        </div>
                    </div>
                    <div className="selected-dp">
                        <div className="selected-explanation">{item.description}</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SelectedRentalItem;
