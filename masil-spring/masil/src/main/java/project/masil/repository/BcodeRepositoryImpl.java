package project.masil.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class BcodeRepositoryImpl implements BcodeRepository {

	private final JdbcTemplate jdbcTemplate;

	public BcodeRepositoryImpl(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public String findEupMyeonDongByBcode(String bcode) {
		String sql = "SELECT 읍면동명 FROM 국토교통부_전국_법정동 WHERE 법정동코드 = ?";
		return jdbcTemplate.queryForObject(sql, String.class, bcode);
	}

}
