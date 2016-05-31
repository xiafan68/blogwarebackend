package ecnu.yjsy.controller.account;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ecnu.yjsy.common.ServerResponse;
import ecnu.yjsy.domain.Account;
import ecnu.yjsy.domain.AccountRepository;

@RestController
public class Authentication {
	private static final Logger logger = LoggerFactory.getLogger(Authentication.class);

	@RequestMapping(value = "/account/authenticate", method = RequestMethod.GET)
	public ServerResponse auth(@RequestParam(value = "username", defaultValue = "World") String username,
			@RequestParam(value = "password", defaultValue = "World") String password) {
		return new ServerResponse(1, "success");
	}

	@Autowired
	AccountRepository rep;

	@RequestMapping(value = "/account/create", method = RequestMethod.POST)
	public ServerResponse create(@ModelAttribute Account account) {
		ServerResponse ret = new ServerResponse(0, "success");
		try {
			account = rep.save(account);
			logger.info(account.toString());
		} catch (Exception ex) {
			ret.setCode(1);
			ret.setMessage(ex.getMessage());
		}
		return ret;
	}

}
