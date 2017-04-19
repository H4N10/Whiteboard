package com.github.whiteboard.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 暴露页面控制器
 */
@Controller
public class WebController {

    //由于pom中引入了spring-boot-starter-freemarker
    //直接返回index会在默认的resources /templates 目录下查找 *.ftl文件

    @RequestMapping(value = {"/room"})
    public String room(){
        return "room";
    }

    @RequestMapping(value = {"/welcome"})
    public String welcome(){
        return "welcome";
    }

    @RequestMapping(value = {"/testSocket"})
    public String testSocket(){
        return "testSocket";
    }


}
