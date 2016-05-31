package ecnu.yjsy.domain;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface EventRepository extends CrudRepository<Event, Integer> {

	@Query(value = "select tsDate, tweetNum from tweetnum where eventID=?1", nativeQuery = true)
	public List<Object[]> findEventTweetSeries();
}
