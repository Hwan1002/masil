import {
  FaLeaf,
  FaHome,
  FaTools,
  FaUtensils,
  FaCampground,
  FaBoxOpen,
} from "react-icons/fa";
import "../css/Main.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// import LocationButton from "../component/LocationButton";
// import LocationPicker from "../component/LocationPicker";
const Main = () => {
  const category = [
    {
      name: "가전제품",
      icon: <FaHome className="text-xl" />,
    },
    {
      name: "공구",
      icon: <FaTools className="text-xl" />,
    },
    {
      name: "주방용품",
      icon: <FaUtensils className="text-xl" />,
    },
    {
      name: "캠핑용품",
      icon: <FaCampground className="text-xl" />,
    },
    {
      name: "잡동사니",
      icon: <FaBoxOpen className="text-xl" />,
    },
  ];
  return (
    <>
      <div className="mainContents">
        <div className="contentWrapper">
          {/* <div className="flex flex-col items-center justify-center gap-y-8"> */}
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center gap-x-2">
                <h2 className="flex align-center text-2xl font-bold text-green-500">
                  오늘 떠날 마실에 필요한게 있나요?
                </h2>
                <FaLeaf className="text-[#00C68E] text-2xl animate-bounce" />
              </div>
              <p className="text-gray-600">이웃과 함께 나누는 따뜻한 마실</p>
            </div>

            <div className="flex flex-1 items-center p-2 bg-white rounded-full shadow-lg gap-x-2">
              <input
                className="searchInput"
                type="text"
                placeholder="렌탈하고 싶은 물품을 검색"
              />
              <button className="searchBtn">검색</button>
            </div>

            <div className="mt-4 btnContainer">
              <Swiper
                spaceBetween={16}
                slidesPerView="auto"
                freeMode={true}
              >
                {category.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    style={{ width: "auto" }}
                  >
                  <button className="categoryBtn hover:bg-green-50 flex items-center">
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </button>
                </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="w-full mt-8 bg-green-50/50 rounded-2xl">
              <h3 className="mb-4 text-lg font-semibold text-green-600">
                우리 동네 인기 대여 물품
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-green-500">🏆</p>
                  <p className="text-green-500">캠핑용품</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-green-500">💪</p>
                  <p className="text-green-500">운동기구</p>
                </div>
              </div>
            </div>
          {/* </div> */}
        </div>

        {/* <div className="flex gap-x-2">
          <LocationButton />
          <LocationPicker />
        </div> */}
      </div>
    </>
  );
};
export default Main;
