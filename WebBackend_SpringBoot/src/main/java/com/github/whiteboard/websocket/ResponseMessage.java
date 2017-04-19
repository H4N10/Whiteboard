package com.github.whiteboard.websocket;

/**
 * Created by Tlyong on 2017/3/15.
 */
public class ResponseMessage {
    private String content;

    public ResponseMessage(String s) {
        this.content = s ;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
