package project.masil.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import lombok.extern.slf4j.Slf4j;
import project.masil.security.WebSocketHandshakeHandler;
import project.masil.websocket.ChatHandler;

@Configuration
@EnableWebSocket
@Slf4j
public class WebSocketConfig implements WebSocketConfigurer {
	
	@Autowired
	private ChatHandler chatHandler ;
	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
	    log.info("WebSocket Handler 등록: /chat");
		registry.addHandler(chatHandler, "/chat")
				.setHandshakeHandler(new WebSocketHandshakeHandler())
				.setAllowedOrigins("http://localhost:3000"); // CORS 허용 Origin , 웹소켓 엔드포인트.
	}
}
 