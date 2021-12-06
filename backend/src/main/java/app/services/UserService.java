package app.services;

import app.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import app.repos.UserRepo;

@Service
public class UserService implements UserDetailsService {

    private final UserRepo userRepo;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public User save(User user) {
        return userRepo.saveAndFlush(user);
    }

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        return find(login);
    }

    public User find(String login) {
        return userRepo.findByLogin(login);
    }

    public void invalidateToken(String login) {
        User user = userRepo.findByLogin(login);
        user.setAuthToken(null);
        userRepo.save(user);
    }

    public User findByAuthToken(String token) {
        return userRepo.findByAuthToken(token);
    }

}
