package app.security.jwt;

import app.entities.User;
import app.services.UserService;
import io.jsonwebtoken.*;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Slf4j
@Component
public class JwtUtil {
    @Value("${jwt.token.secret}")
    private String jwtSecret;

    @Value("${jwt.token.expired}")
    private int jwtExpiration;

    @Autowired
    private UserService userService;

    public String generateJwtToken(String login) {
        return Jwts.builder()
                .setSubject(login)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            log.error("Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }

    public String resolveToken(String login) {
        User user = userService.find(login);
        System.out.println(user);
        String token = null;
        if (user.getAuthToken() != null)
            token = user.getAuthToken();
        else token = generateJwtToken(login);

        user.setAuthToken(token);
        userService.save(user);
        return token;
    }


}
