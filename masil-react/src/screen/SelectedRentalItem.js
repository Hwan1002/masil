import React, { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import '../css/SelectedRentalItem.css'
import axios from 'axios';
import moment from 'moment';
const SelectedRentalItem = () => {
    const { idx } = useParams();
    const [item, setItem] = useState([]);

    const fetchPostItem = async (idx) => {
        try {
            const response = await axios.get(`http://localhost:9090/post/item/${idx}`);
            console.log(response.data); // 받은 데이터 확인
            setItem(response.data)
        } catch (error) {
            console.error("데이터 요청 실패:", error);
            return null;
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

    function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        return moment(date).format(format);
    }

    function curency(number) {
        const num = Number(number);
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }



    return (
        <div className='selected-container'>
            <div className='selected-item-container'>
                <div className='selected-photo-container'>
                    <div className="selected-title">{item.postTitle}</div>
                    <img
                        src={`http://localhost:9090${item.postPhotoPaths}`}
                        alt={item.postIdx}
                        className="selected-rental-image"
                    />
                    <div className="selected-bottom-title">아이디</div>
                </div>
                <div className='selected-description-container'>
                    {/* <div className="selected-explanation"> */}
                    <div className="selected-dp-sub-container">
                        <div className="selected-dp-item-title">작성자</div>
                        <div className="selected-dp-item">{item.userNickName}</div>
                    </div>
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
                    <div className="selected-dp">
                        <div className="selected-explanation">{item.description}</div>
                    </div>
                </div>

                {/* </div> */}
            </div>
        </div>
    );
};

export default SelectedRentalItem;
