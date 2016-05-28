package account;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import common.ServerResponse;

@RestController
public class Authentication {
	@RequestMapping(value = "/account/authenticate", method = RequestMethod.GET)
	public ServerResponse auth(@RequestParam(value = "username", defaultValue = "World") String username,
			@RequestParam(value = "password", defaultValue = "World") String password) {
		return new ServerResponse(1, "success");
	}

}
