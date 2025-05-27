import "../css/Main.css";
// import { useNavigate } from 'react-router-dom';
// import { useContext } from "react";
// import { ProjectContext } from "../context/MasilContext";
import LocationButton from "../component/LocationButton";
import LocationPicker from "../component/LocationPicker";
const Main = () => {
  // const { accessToken } = useContext(ProjectContext);
  // const navigate = useNavigate();

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
