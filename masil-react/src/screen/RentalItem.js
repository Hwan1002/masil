import React, {useState, useEffect} from 'react';
import '../css/RentalItem.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RentalItem = () => {
    const navigate = useNavigate();
    const [showSoldOnly, setShowSoldOnly] = useState(false);

    // 렌탈 아이템 데이터(예제)
    useEffect(() => {
        const test = async (e) => {
            try {
              const response = await axios.get(`http://localhost:9090/post`);
              if (response) {
               console.log(response.data)
              }
            } catch (error) {
       
            }
          }
          test();
      }, []); 
    

    // const filteredItems = showSoldOnly
    //     ? rentalItems.filter((item) => item.isSold)
    //     : rentalItems;

        const handleFilterChange = (event) => {
            const { name, checked } = event.target;
            if (name === "sold") {
                setShowSoldOnly(checked);
            }
        };

        return (
            <div className="page-container">
                {/* 필터 섹션 */}
                <aside className="filter-section">
                    <h3>필터</h3>
                    <div className="filter-options">
                        <label>
                            <input
                                type="checkbox"
                                name="sold"
                                checked={showSoldOnly}
                                onChange={handleFilterChange}
                            />
                            판매 완료만 보기
                        </label>
                        {/* 추가 필터 옵션 */}
                    </div>
                </aside>
    
                {/* 렌탈 아이템 섹션 */}
                <div className="rental-container">
                    {/* {filteredItems.map((item) => (
                        <a href="/" key={item.id} className="rental-item-link">
                            <div className="rental-item">
                                {item.isSold && <span className="sold-badge">판매 완료</span>}
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="rental-image"
                                />
                                <p className="rental-title">{item.title}</p>
                                <p className="rental-price">{item.price}원</p>
                            </div>
                        </a>
                    ))} */}
                </div>
                <button onClick={() => navigate("/postRegist")} className="fixed-button">+</button>
            </div>
        );


};


export default RentalItem;
