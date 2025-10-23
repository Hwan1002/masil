import { FaLeaf } from "react-icons/fa";
import { category } from "../constants";
import "css/Main.css";

const Main = () => {
  return (
    <>
      <div className="mainContents">
        <div className="contentWrapper">
          <div className="flex flex-col gap-y-8 justify-center items-center">
            <div className="space-y-3 text-center">
              <div className="flex gap-x-2 justify-center items-center">
                <h2 className="text-2xl font-bold text-green-500">
                  오늘 떠날 마실에 필요한게 있나요?
                </h2>
                <FaLeaf className="text-[#00C68E] text-2xl animate-bounce" />
              </div>
              <p className="text-gray-600">이웃과 함께 나누는 따뜻한 마실</p>
            </div>

            <div className="flex gap-x-3 items-center p-2 bg-white rounded-full shadow-lg">
              <input
                className="searchInput"
                type="text"
                placeholder="렌탈하고 싶은 물품을 검색해보세요!"
              />
              <button className="searchBtn">검색</button>
            </div>

            <div className="flex gap-x-4 mt-4">
              {category.map((item, index) => (
                <button
                  key={index}
                  className="w-[150px] categoryBtn hover:bg-green-50"
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </button>
              ))}
            </div>

            <div className="p-8 mt-8 w-full rounded-2xl bg-green-50/50">
              <h3 className="mb-4 text-lg font-semibold text-green-600">
                우리 동네 인기 대여 물품
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-green-500">🏆 캠핑용품</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-green-500">💪 운동기구</p>
                </div>
              </div>
            </div>
          </div>
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
