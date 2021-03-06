package ecnu.yjsy.common;

/**
 * 服务器返回的一些响应状态
 * 
 * @author xiafan
 *
 */
public class ServerResponse {

	int code;
	String message;
	Object data;

	public ServerResponse() {

	}

	public ServerResponse(int code, String message) {
		this.code = code;
		this.message = message;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

}
