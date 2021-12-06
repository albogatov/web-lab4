package app.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@CrossOrigin
@RequestMapping(value = "/api")
@RestController
public class NavigationController {

    @GetMapping("/main")
    public String mainPage(Map<String, Object> model) {
        log.debug("requested main");
        return "/index.html";
    }


    @GetMapping("/error")
    public String errorPage() {
        log.debug("requested error page");
        return "/index.html";
    }
}

