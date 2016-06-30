
CREATE TABLE myblogdb.Blogs (
	`blogId` INT(11) NOT NULL AUTO_INCREMENT, 
	`uid` INT(11) NOT NULL, 
	`title` VARCHAR(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, 
	`content` MEDIUMTEXT CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, 
	`createtime` DATETIME NOT NULL, 
	`lastmodifytime` DATETIME NOT NULL, 
	PRIMARY KEY (`blogId`)
) ENGINE = InnoDB;

CREATE TABLE `myblogdb`.`Users` (`uid` INT(11) NOT NULL AUTO_INCREMENT, 
	`username` VARCHAR(31) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, 
	`password` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, 
	`nickname` VARCHAR(31) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, 
	`email` VARCHAR(127) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL, 
	`bio` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL, 
	`resume` VARCHAR(127) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL, 
	`portrait` VARCHAR(127) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL, 
	`facebook` VARCHAR(127) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL, 
	`linkedin` VARCHAR(127) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL, 
	`twitter` VARCHAR(127) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL, 
	`github` VARCHAR(127) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL, 
	PRIMARY KEY (`uid`), 
	UNIQUE (`username`), 
	UNIQUE (`nickname`)
) ENGINE = InnoDB;

CREATE VIEW myblogdb.UserAuthentication AS SELECT uid, username, password, nickname FROM myblogdb.Users;

ALTER TABLE myblogdb.Blogs ADD FOREIGN KEY (uid) REFERENCES myblogdb.Users(uid);

CREATE VIEW myblogdb.UserInfo AS SELECT uid, email, bio, nickname, facebook, twitter, github, linkedin, resume, portrait FROM myblogdb.Users;

CREATE VIEW myblogdb.UserBlogIndex AS SELECT blogId, myblogdb.Users.uid, nickname, title, createtime FROM myblogdb.Users, myblogdb.Blogs WHERE myblogdb.Users.uid=myblogdb.Blogs.uid

-- query for user authentication
SELECT uid, nickname
FROM UserAuthentication
WHERE username='username'
AND password='password'

-- create user
INSERT INTO UserAuthentication ( username, password
)
VALUES ('username', 'password')

-- modify password
UPDATE UserAuthentication
SET password='newPassword'
WHERE uid='uid'

-- query for userinfo
SELECT *
FROM UserInfo
WHERE uid='uid'

-- modify bio in userinfo
UPDATE UserInfo
SET bio='newbio'
WHERE uid='uid'

-- query for user's blog index
SELECT blogId, title, createtime
FROM UserBlogIndex
WHERE uid='uid'

-- query for user's blog
SELECT *
FROM Blogs
WHERE uid='uid'
AND blogId='blogId'

-- create a new blog
INSERT INTO Blogs ( uid, title, createtime, content
)
VALUES ('uid', 'blog title', '2016/06/22', 'blog content')

-- modify blog content
UPDATE Blogs
SET content='new content', lastmodifytime='2016/06/22'
WHERE uid='uid'
AND blogId='blogId'

-- delete blog
DELETE FROM Blogs
WHERE uid='uid'
AND blogId='blogId'


