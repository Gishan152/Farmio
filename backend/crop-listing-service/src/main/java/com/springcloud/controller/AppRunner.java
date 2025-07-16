package com.springcloud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@Component
public class AppRunner implements ApplicationRunner {
    @Autowired
    private DataSource ds;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try (var conn = ds.getConnection()) {
            System.out.println("Connected to: " + conn.getMetaData().getURL());
        }
    }
}
