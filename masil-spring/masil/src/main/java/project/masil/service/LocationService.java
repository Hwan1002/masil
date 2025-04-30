package project.masil.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.masil.dto.LocationDTO;
import project.masil.repository.BcodeRepository;
import project.masil.service.KakaoGeocodingService.KakaoApiException;
import project.masil.service.UserService.AddressNotFoundException;
import project.masil.service.UserService.InternalServerErrorException;
import project.masil.service.UserService.NoRegionCodeFoundException;

@Service
public class LocationService {

	@Autowired
	private BcodeRepository bCodeRepository ;
	
	@Autowired
	private KakaoGeocodingService kakaoGeocodingService;
	
	public LocationDTO setLocation(Double lat , Double lng) {
		
		
		String bCode; 
		try {
			bCode= kakaoGeocodingService.getBcode(lat, lng) ;
		} catch (KakaoApiException e) {
			 throw new InternalServerErrorException("서버 오류가 발생했습니다.");
		}
		
		if(bCode ==null) {
			throw new NoRegionCodeFoundException("정확한 주소를 설정해주세요") ;
		}
		
		String address  = bCodeRepository.findEupMyeonDongByBcode(bCode) ;
		if(address ==null) {
			throw new AddressNotFoundException("지역 정보를 찾을 수 없습니다.");
		}
		
		return LocationDTO.builder().lat(lat).lng(lng).address(address).build() ;				
	}
			
}
