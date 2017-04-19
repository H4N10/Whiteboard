package com.github.whiteboard.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 暴露JSON接口
 * Created by Tlyong on 2017/3/15.
 */
@RestController
public class WebApiController {

    @RequestMapping(value = {"/test"})
    public String test(){

        return "test1123";
    }

}
