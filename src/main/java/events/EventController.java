package events;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EventController {

	@RequestMapping(value = "/event/getbyname", method = RequestMethod.GET)
	public Event greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
		return new Event();
	}
}
