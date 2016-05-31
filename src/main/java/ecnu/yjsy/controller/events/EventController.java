package ecnu.yjsy.controller.events;

import java.lang.reflect.Field;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import ecnu.yjsy.common.ServerResponse;
import ecnu.yjsy.domain.Event;
import ecnu.yjsy.domain.EventRepository;

@RestController
public class EventController {
	private static final Logger logger = LoggerFactory.getLogger(EventController.class);
	@Autowired
	EventRepository rep;

	@RequestMapping(value = "/event/{eventid}", method = RequestMethod.GET)
	public Event query(String eventid) {
		return new Event();
	}

	@RequestMapping(value = "/event/show", method = RequestMethod.GET)
	public ServerResponse show() {
		ServerResponse ret = new ServerResponse(0, "success");
		List<Event> events = new ArrayList<Event>();
		for (Event event : rep.findAll()) {
			events.add(event);
		}
		ret.setData(events);
		return ret;
	}

	@RequestMapping(value = "/event/{id}/update", method = RequestMethod.POST)
	public ServerResponse update(@ModelAttribute Event event) {
		ServerResponse ret = new ServerResponse(0, "success");
		Event origData = rep.findOne(event.getId());
		for (Field field : Event.class.getDeclaredFields()) {
			try {
				boolean preState = field.isAccessible();
				field.setAccessible(true);
				if (field.get(event) != null) {
					field.set(origData, field.get(event));
				}
				field.setAccessible(preState);
			} catch (IllegalArgumentException | IllegalAccessException e) {
				e.printStackTrace();
			}
		}
		origData = rep.save(origData);
		ret.setData(origData);
		return ret;
	}

	@RequestMapping(value = "/event/create", method = RequestMethod.POST)
	public ServerResponse create(@ModelAttribute Event event) {
		event.setCreatedAt(new Date(System.currentTimeMillis()));
		event = rep.save(event);
		logger.info("event is added successfully " + event.toString());
		return new ServerResponse(0, event.toString());
	}
}
