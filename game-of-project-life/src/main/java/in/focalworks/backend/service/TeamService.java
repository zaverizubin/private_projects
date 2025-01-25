package in.focalworks.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import in.focalworks.backend.data.entity.Team;
import in.focalworks.backend.repositories.TeamRepository;

@Service
public class TeamService implements FilterableCrudService<Team> {

	private final TeamRepository teamRepository;

	@Autowired
	public TeamService(final TeamRepository teamRepository) {
		this.teamRepository = teamRepository;
	}

	@Override
	public Page<Team> findAnyMatching(final Optional<String> filter, final Pageable pageable) {
		if (filter.isPresent()) {
			final String repositoryFilter = "%" + filter.get() + "%";
			return teamRepository.findByNameLikeIgnoreCase(repositoryFilter, pageable);
		} else {
			return find(pageable);
		}
	}

	@Override
	public long countAnyMatching(final Optional<String> filter) {
		if (filter.isPresent()) {
			final String repositoryFilter = "%" + filter.get() + "%";
			return teamRepository.countByNameLikeIgnoreCase(repositoryFilter);
		} else {
			return count();
		}
	}

	public Page<Team> find(final Pageable pageable) {
		return teamRepository.findBy(pageable);
	}

	@Override
	public JpaRepository<Team, Long> getRepository() {
		return teamRepository;
	}

	@Override
	public Team createNew() {
		return new Team();
	}


}
