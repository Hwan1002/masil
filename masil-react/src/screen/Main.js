import '../css/Main.css';
// import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ProjectContext } from '../context/MasilContext';
import LocationButton from '../component/locationButton';
const Main = () => {

  const {accessToken} = useContext(ProjectContext);
  // const navigate = useNavigate();

  return(
    <>
    <div className="mainContents">
      <div>메인페이지다 </div>
      <div>메인페이지다 </div>
      <div>메인페이지다 </div>
      <LocationButton/>
    </div>
    </>
  )
}
export default Main;
