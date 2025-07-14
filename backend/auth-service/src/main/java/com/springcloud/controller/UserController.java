package com.springcloud.controller;

import com.springcloud.dto.*;
import com.springcloud.service.AuthService;
import com.springcloud.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
