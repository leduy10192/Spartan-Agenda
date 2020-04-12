package com.theitcrowd.todo.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.theitcrowd.todo.service.UserService;
import com.theitcrowd.todo.model.forms.UserRegistrationForm;

import javax.validation.Valid;

@RequestMapping("api/user")
@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public void registerUser(@Valid @RequestBody UserRegistrationForm userRegistrationForm) {
        if (this.userService.registerUser(userRegistrationForm) != true) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email or username already in use");
        }
    }
}