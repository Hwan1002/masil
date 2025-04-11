package project.masil.security;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2FailureHandler implements AuthenticationFailureHandler{

    @Override
    public void onAuthenticationFailure(
        HttpServletRequest request,
        HttpServletResponse response,
        AuthenticationException exception
    ) throws IOException {
        String errorMessage = exception.getMessage();
        String script = String.format(
            "<script>" +
            "window.opener.postMessage({ success: false, error: '%s' }, '%s');" +
            "window.close();" +
            "</script>",
            errorMessage, "http://localhost:3000"
        );

        response.setContentType("text/html; charset=UTF-8");
        response.getWriter().print(script);
    }
}