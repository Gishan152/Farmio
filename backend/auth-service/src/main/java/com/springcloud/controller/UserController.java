package com.springcloud.controller;

import com.springcloud.dto.*;
import com.springcloud.model.User;
import com.springcloud.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
//@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/get")
    public ResponseEntity<PublicUserData> getUser(@RequestBody UserRequest request) {
        System.out.println("username : " + request.username());
        return ResponseEntity.ok(userService.getUser(request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/all-dto")
    public ResponseEntity<List<UserDTO>> getAllUsersDTO() {
        return ResponseEntity.ok(userService.getAllUsersDTO());
    }

    //deactivate the user
    @PostMapping("/deactivate")
    public ResponseEntity<Void> deactivateUser(@RequestBody UserRequest request) {
        userService.deactivateUser(request);
        return ResponseEntity.noContent().build();
    }

    //approve the user
    @PostMapping("/approve")
    public ResponseEntity<Void> approveUser(@RequestBody UserRequest request) {
        userService.approveUser(request);
        return ResponseEntity.noContent().build();
    }
}
