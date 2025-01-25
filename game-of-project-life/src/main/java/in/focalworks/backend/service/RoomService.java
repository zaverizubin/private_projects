package in.focalworks.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import in.focalworks.backend.data.entity.Room;
import in.focalworks.backend.repositories.RoomRepository;

@Service
public class RoomService implements FilterableCrudService<Room> {

	private final RoomRepository roomRepository;

	@Autowired
	public RoomService(final RoomRepository roomRepository) {
		this.roomRepository = roomRepository;
	}

	@Override
	public Page<Room> findAnyMatching(final Optional<String> filter, final Pageable pageable) {
		if (filter.isPresent()) {
			final String repositoryFilter = "%" + filter.get() + "%";
			return roomRepository.findByNameLikeIgnoreCase(repositoryFilter, pageable);
		} else {
			return find(pageable);
		}
	}

	@Override
	public long countAnyMatching(final Optional<String> filter) {
		if (filter.isPresent()) {
			final String repositoryFilter = "%" + filter.get() + "%";
			return roomRepository.countByNameLikeIgnoreCase(repositoryFilter);
		} else {
			return count();
		}
	}

	public Page<Room> find(final Pageable pageable) {
		return roomRepository.findBy(pageable);
	}

	@Override
	public JpaRepository<Room, Long> getRepository() {
		return roomRepository;
	}

	@Override
	public Room createNew() {
		return new Room();
	}


}
