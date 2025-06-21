package in.focalworks.app;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Random;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.focalworks.backend.data.entity.Role;
import in.focalworks.backend.data.entity.Room;
import in.focalworks.backend.data.entity.Session;
import in.focalworks.backend.data.entity.Team;
import in.focalworks.backend.data.entity.User;
import in.focalworks.backend.repositories.RoleRepository;
import in.focalworks.backend.repositories.RoomRepository;
import in.focalworks.backend.repositories.SessionRepository;
import in.focalworks.backend.repositories.TeamRepository;
import in.focalworks.backend.repositories.UserRepository;

@Service
public class DataGenerator {

	private static final String[] ROLES = new String[] { "admin", "facilitator", "scorer" };

	private final Random random = new Random(1L);

	private final RoleRepository roleRepository;
	private final RoomRepository roomRepository;
	private final SessionRepository sessionRepository;
	private final TeamRepository teamRepository;
	private final UserRepository userRepository;

	@Autowired
	public DataGenerator(final UserRepository userRepository, final TeamRepository teamRepository,
			final SessionRepository sessionRepository, final RoomRepository roomRepository,
			final RoleRepository roleRepository) {
		this.roleRepository = roleRepository;
		this.userRepository = userRepository;
		this.teamRepository = teamRepository;
		this.roomRepository = roomRepository;
		this.sessionRepository = sessionRepository;
	}

	@PostConstruct
	public void loadData() {
		createRoles();
		createUsers();
		createTeams();
		createRooms();
		createSessions();
	}


	private void createRoles() {
		final Role adminRole = new Role(ROLES[0]);
		final Role facilitatorRole = new Role(ROLES[1]);
		final Role scorerRole = new Role(ROLES[2]);

		roleRepository.saveAll(new ArrayList<Role>() {
			{
				add(adminRole);
				add(facilitatorRole);
				add(scorerRole);
			}
		});
		roleRepository.flush();

	}

	private void createUsers() {
		final User user1 = new User("admin", "admin", true);
		final User user2 = new User("user1", "user1", true);
		final User user3 = new User("user2", "user2", true);

		final List<Role> roles = roleRepository.findAll();

		user1.setRoles(new HashSet<Role>() {
			{
				add(roles.get(0));
			}
		});
		user2.setRoles(new HashSet<Role>() {
			{
				add(roles.get(1));
				add(roles.get(2));
			}
		});
		user3.setRoles(new HashSet<Role>() {
			{
				add(roles.get(1));
				add(roles.get(2));
			}
		});

		userRepository.saveAll(new ArrayList<User>() {
			{
				add(user1);
				add(user2);
				add(user3);
			}
		});

		userRepository.flush();
	}

	private void createTeams() {
		final Team team1 = new Team("team1", "team1", true);
		final Team team2 = new Team("team2", "team2", true);
		final Team team3 = new Team("team3", "team3", true);

		teamRepository.saveAll(new ArrayList<Team>() {
			{
				add(team1);
				add(team2);
				add(team3);
			}
		});
		teamRepository.flush();
	}

	private void createRooms() {
		final List<User> users = userRepository.findAll();

		final Room room1 = new Room("team1", users.get(1), users.get(2));
		final Room room2 = new Room("team2", users.get(1), users.get(2));
		final Room room3 = new Room("team3", users.get(2), users.get(1));

		roomRepository.saveAll(new ArrayList<Room>() {
			{
				add(room1);
				add(room2);
				add(room3);
			}
		});
		roomRepository.flush();
	}

	private void createSessions() {
		final List<Room> rooms = roomRepository.findAll();

		final Calendar startDate = Calendar.getInstance();
		startDate.setTime(new Date());
		final Calendar endDate = Calendar.getInstance();
		endDate.add(Calendar.DATE, startDate.DATE + 5);

		final Session session1 = new Session(rooms.get(0), startDate.getTime(), endDate.getTime());
		final Session session2 = new Session(rooms.get(1), startDate.getTime(), endDate.getTime());
		final Session session3 = new Session(rooms.get(2), startDate.getTime(), endDate.getTime());

		sessionRepository.saveAll(new ArrayList<Session>() {
			{
				add(session1);
				add(session2);
				add(session3);
			}
		});
		sessionRepository.flush();
	}

}
