package project.masil.repository;

public interface BcodeRepository {

	//  법정코드를통해 읍면동코드 찾는 메서드  
	 String findEupMyeonDongByBcode(String bcode);
	
}
