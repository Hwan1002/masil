import { useContext, useEffect } from "react";
import { ProjectContext } from "context/MasilContext";
import { getAddressFromCoordinates } from "../actions/signUpActions";

/**
 * 위치 정보를 관리하는 커스텀 훅
 * @returns {Object} 위치 정보
 */
export const useLocation = () => {
  const { location, setLocation } = useContext(ProjectContext);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const { address } = await getAddressFromCoordinates(
            latitude,
            longitude
          );
          setLocation({
            lat: latitude,
            lng: longitude,
            address,
          });
        } catch (err) {
          console.error("서버 요청 실패:", err.message);
        }
      });
    };

    fetchLocation();
  }, [setLocation]);

  return { location, setLocation };
};






