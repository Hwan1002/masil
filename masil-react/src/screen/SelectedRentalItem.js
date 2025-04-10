import React, { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import '../css/SelectedRentalItem.css'
import axios from 'axios';
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
                </div>
                <div className='selected-description-container'>
                    {/* <div className="selected-explanation"> */}
                        <div>
                            <div>작성자</div>
                            <div>{item.userNickName}</div>
                        </div>
                        <div>
                            <div>등록일</div>
                            <div>{item.updateDate}</div>
                        </div>
                        <div>
                            <div>희망 대여일</div>
                            <div>{item.postStartDate}</div>
                        </div>
                        <div>설명</div>
                        <div>{item.description}</div>
                    </div>
                    
                {/* </div> */}
            </div>
        </div>
    );
};

export default SelectedRentalItem;
