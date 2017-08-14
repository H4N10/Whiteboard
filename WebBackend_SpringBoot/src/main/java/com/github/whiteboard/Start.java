package com.github.whiteboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication //@SpringBootApplication相当于@Configuration、@EnableAutoConfiguration和  @ComponentScan
public class Start {
    /**
     * 程序主入口，任何地方都可以写一个main类，作为启动入口
     * **/
    public static void main(String[] args) {
        SpringApplication.run(Start.class, args);
    }

}
