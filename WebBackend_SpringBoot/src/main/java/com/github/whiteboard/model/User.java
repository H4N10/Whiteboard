package com.github.whiteboard.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

/**
 * User 实体
 */
@Entity
class User {
    @Id
    @GeneratedValue
    Long id;

    String username;
    String firstName;
    Date createdDate;
    Date lastAccessed;

    Boolean isActive = Boolean.TRUE;
}
