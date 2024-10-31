package com.cypriel.videocall.service;

import com.cypriel.videocall.exception.UserNotFoundException;
import com.cypriel.videocall.model.User;
import com.cypriel.videocall.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void register(User user) {
        user.setStatus("online");
        userRepository.save(user);
    }

    public User login(User user) {
        var connectedUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User " + user.getUsername() + " is not found!"));

        if (!connectedUser.getPassword().equals(user.getPassword())) {
            throw new UserNotFoundException("User password " + user.getPassword() + " is not found!");
        }
        connectedUser.setStatus("online");
        return userRepository.save(connectedUser);
    }

    public void logout(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User " + email + " is not found!"));
        user.setStatus("offline");
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }
}
