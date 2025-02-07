package project.masil.common;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

import org.springframework.web.multipart.MultipartFile;

public class FileUploadUtil {


	public static String saveFile(MultipartFile file, String uploadDir, String subDir) {
		try {
			// 전체 업로드 경로 설정 (기본 디렉토리 + 서브 디렉토리)
			String fullUploadDir = Paths.get(uploadDir, subDir).toString();
			File directory = new File(fullUploadDir);
			if (!directory.exists()) {
				directory.mkdirs(); // 디렉토리 생성
				
			}

			// 고유한 파일 이름 생성
			String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

			// 파일 저장
			File destinationFile = new File(fullUploadDir + File.separator + fileName);
			file.transferTo(destinationFile);

		 
			return "/uploads/"+subDir+"/"+fileName ; // 상대 경로 반환
		} catch (IOException e) {
			throw new RuntimeException("파일 저장 중 오류가 발생했습니다.", e);
			
		}
	}

	/**
	 * 파일 삭제 메서드
	 * 
	 * @param filePath 삭제할 파일의 전체 경로
	 */
	public static void deleteFile(String filePath) {
		if (filePath == null || filePath.isEmpty()) {
			return; // 삭제할 파일 경로가 없으면 아무 작업도 하지 않음
		}

		File file = new File(filePath);
		if (file.exists() && file.isFile()) {
			if (!file.delete()) {
				throw new RuntimeException("파일 삭제에 실패했습니다: " + filePath);
			}
		}
	}
}
