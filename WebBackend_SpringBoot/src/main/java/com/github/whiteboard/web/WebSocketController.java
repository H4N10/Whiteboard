package com.github.whiteboard.web;

import org.springframework.stereotype.Component;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * WebSocket 控制器
 * Created by Tlyong on 2017/3/15.
 */
@ServerEndpoint("/websocket")
@Component
public class WebSocketController {

    private static int onlineCount = 0;

    private static CopyOnWriteArraySet<WebSocketController> webSocketSet = new CopyOnWriteArraySet<>();

    private Session session;

    @OnOpen
    public void onOpen (Session session) throws IOException {
        this.session = session;
        webSocketSet.add(this);
        addOnlineCount();
        System.out.println("有新链接加入!当前在线人数为" + getOnlineCount());
        for ( WebSocketController item : webSocketSet ){
            item.sendMessage("有新链接加入!当前在线人数为" + getOnlineCount());
        }
    }

    @OnClose
    public void onClose () throws IOException {
        webSocketSet.remove(this);
        subOnlineCount();
        System.out.println("有一链接关闭!当前在线人数为" + getOnlineCount());
        for ( WebSocketController item : webSocketSet ){
            item.sendMessage("有一链接关闭!当前在线人数为" + getOnlineCount());
        }
    }

    @OnMessage
    public void onMessage (String message, Session session) throws IOException {
        System.out.println("来自客户端的消息:" + message);
        // 群发消息
        for ( WebSocketController item : webSocketSet ){
            item.sendMessage(message);
        }
    }

    public void sendMessage (String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    public static synchronized  int getOnlineCount (){
        return WebSocketController.onlineCount;
    }

    public static synchronized void addOnlineCount (){
        WebSocketController.onlineCount++;
    }

    public static synchronized void subOnlineCount (){
        WebSocketController.onlineCount--;
    }

}