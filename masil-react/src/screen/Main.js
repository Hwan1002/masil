import "../css/Main.css";

import LocationButton from "../component/LocationButton";
import LocationPicker from "../component/LocationPicker";
const Main = () => {
  return (
    <>
      <div className="mainContents">
        <div>메인페이지다 </div>

        <div className="flex gap-x-2">
          <LocationButton />
          <LocationPicker />
        </div>
      </div>
    </>
  );
};
export default Main;
