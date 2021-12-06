package app.controllers;

import app.calculation.ResultOperations;
import app.entities.Result;
import app.entities.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import app.repos.ResultRepo;
import app.repos.UserRepo;

import java.security.Principal;
import java.util.List;

@Slf4j
@RequestMapping(value = "/api")
@RestController
public class ResultController {
    @Autowired
    private ResultRepo resultRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ResultOperations graph;

//    ResultController(ResultRepo resultRepo, UserRepo userRepo, ResultOperations graph) {
//        this.resultRepo = resultRepo;
//        this.userRepo = userRepo;
//        this.graph = graph;
//
//    }

    @CrossOrigin
    @GetMapping("/results/get")
    public List<Result> getResults(Principal user) {
        log.info("requested all results");
        return (List<Result>) resultRepo.findAllByUser(userRepo.findByLogin(user.getName()));
    }

    @CrossOrigin
    @PostMapping("/results/save")
    Result addResult(@RequestBody Result result, Principal user) {
        log.info("requested result save");
        result.setHit(graph.checkHit(result));
        result.setUser(userRepo.findByLogin(user.getName()));
        log.info("result saved");
        return resultRepo.save(result);
    }

    @CrossOrigin
    @DeleteMapping("/results/clear")
    public void clearResults(Principal user) {
        log.info("requested to clear");
        resultRepo.deleteAll();
    }
}
