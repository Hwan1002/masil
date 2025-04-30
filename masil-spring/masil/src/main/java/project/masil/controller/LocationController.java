package project.masil.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.masil.dto.LocationDTO;
import project.masil.service.LocationService;
@RestController
@RequestMapping("/location")
public class LocationController {

	@Autowired
	private LocationService locationService ;
	
	@PostMapping
	public ResponseEntity<LocationDTO> setLocation(@RequestBody LocationDTO dto){
		
		return ResponseEntity.ok(locationService.setLocation(dto.getLat(),dto.getLng()));
	}
	
}
