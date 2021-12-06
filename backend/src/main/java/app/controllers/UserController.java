package app.controllers;

import app.data.ResponseMessage;
import app.data.UserData;
import app.entities.User;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import app.security.jwt.JwtUtil;
import app.services.UserService;

import java.security.Principal;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping(value = "/api")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;


    private BCryptPasswordEncoder bCryptPasswordEncoder;

    private AuthenticationManager authenticationManager;


    @Autowired
    private final UserService userService;

    public UserController(UserService userService, BCryptPasswordEncoder encoder, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.bCryptPasswordEncoder = encoder;
        this.authenticationManager = authenticationManager;
    }


    @PostMapping("/register")
    public ResponseEntity<ResponseMessage> register(@RequestBody User user) {
        log.debug("registering user");
        try {
            if (user.getLogin() == null || user.getPassword() == null || user.getLogin().trim().equals("")
                    || user.getPassword().trim().equals("")) {
                logger.error("Absent login or password");
                throw new IllegalArgumentException();
            }

            if (userService.find(user.getLogin()) != null) {
                logger.error("Already registered" + userService.find(user.getLogin()));
                return new ResponseEntity<>(new ResponseMessage("User already registered"), HttpStatus.CONFLICT);
            }
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            userService.save(user);
            return new ResponseEntity<>(new ResponseMessage("User successfully registered"), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid register");
            return new ResponseEntity<>(new ResponseMessage("Invalid login or password"), HttpStatus.BAD_REQUEST);
        }
    }


    @PostMapping("/login")
    public ResponseEntity<ResponseMessage> login(@RequestBody UserData user) {
        if (user.getLogin() == null || user.getPassword() == null) {
            logger.error("Absent login or password");
            return new ResponseEntity<>(new ResponseMessage("Absent login or password"), HttpStatus.BAD_REQUEST);
        }
        try {
            String login = user.getLogin();
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(login, user.getPassword()));
            String token = jwtUtil.resolveToken(login);
            System.out.println(token);
            return new ResponseEntity<>(new ResponseMessage(token), HttpStatus.OK);
        } catch (AuthenticationException e) {
            return new ResponseEntity<>(new ResponseMessage("Wrong login or password"), HttpStatus.UNAUTHORIZED);
        }
//        User toAuthenticate = (User) userService.loadUserByUsername(login);
//        if (toAuthenticate == null)
//            return new ResponseEntity<>(new ResponseMessage("Wrong login or password"), HttpStatus.OK);
//        else if (!passwordEncoder.matches(user.getPassword(), toAuthenticate.getPassword())) {
//            return new ResponseEntity<>(new ResponseMessage("Wrong login or password"), HttpStatus.OK);
//        } else {
//            String token = jwtUtil.generateJwtToken(login);
//            if (jwtUtil.validateJwtToken(token)) {
//                toAuthenticate.setAuthToken(token);
//                logger.error("User logged in");
//                return new ResponseEntity<>(new ResponseMessage("User logged in"), HttpStatus.OK);
//            } else {
//                logger.error("Wrong login or pwd");
//                return new ResponseEntity<>(new ResponseMessage("Wrong login or password"), HttpStatus.OK);
//            }
//
//        }
    }


    @PostMapping("/logout")
    public ResponseEntity<ResponseMessage> logout(Principal user) {
        try {
            log.info("requested a logout");
            userService.invalidateToken(user.getName());
            return new ResponseEntity<>(new ResponseMessage("Logged out"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseMessage("Log out error"), HttpStatus.BAD_REQUEST);
        }
    }
}
