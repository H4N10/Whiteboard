package com.github.whiteboard.web;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by Tlyong on 2017/3/7.
 */
//传统的测试
//@RunWith(SpringJUnit4ClassRunner.class)
//@SpringBootApplication(scanBasePackageClasses = MockServletContext.class)
//@WebAppConfiguration

//SpringBoot的测试，SpringBootTest 可以代替上面两个测试；
@RunWith(SpringRunner.class)
@SpringBootTest

public class HelloControllerTest {

    private MockMvc mvc;

    @Before
    public void setUp() throws  Exception{
        mvc = MockMvcBuilders.standaloneSetup(new WebController()).build();
    }

    @Test
    public void getHello() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/hello").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(equalTo("Hello World")));
    }
}
