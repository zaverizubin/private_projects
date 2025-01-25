package in.focalworks.backend.repositories;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.test.context.junit4.SpringRunner;

import in.focalworks.backend.data.entity.User;

@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepositoryImplTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private UserRepository userRepository;

	private Pageable createPageRequest(final int firstResult, final int maxResults) {
		return PageRequest.of(firstResult, maxResults);
	}

	private Pageable createPageRequest(final int firstResult, final int maxResults, final Direction direction,
			final String sortColumn) {
		return PageRequest.of(firstResult, maxResults, direction, sortColumn);
	}


	@Test
	public void givenUsersWhenUserNotAdminThenCount() {
		// given
		final String role = "admin";
		// when
		final Pageable page = createPageRequest(0, 20);
		final Page<User> users = userRepository.findDistinctUserByRoles_NameNotIgnoreCase(role, page);
		// then
		assertEquals(3, users.getContent().size());
	}

	@Test
	public void givenUsersWhenUserNotAdminAndOrderByEnabledThenCount() {
		// given
		final String role = "admin";
		// when
		final Pageable page = createPageRequest(0, 20, Direction.ASC, "enabled");
		final Page<User> users = userRepository.findDistinctUserByRoles_NameNotIgnoreCase(role, page);
		// then
		assertFalse(users.getContent().get(0).getEnabled());
		assertEquals(3, users.getContent().size());
	}

	@Test
	public void givenUsersWhenUsernameLikeAndUserNotAdminThenCount() {
		// given
		final String role = "Admin";
		// when
		final Pageable page = createPageRequest(0, 20);

		final Page<User> users = userRepository
				.findDistinctUserByUsernameLikeAndRoles_NameNotIgnoreCase("%us%", role, page);

		// then
		assertEquals(3, users.getContent().size());
	}

}
