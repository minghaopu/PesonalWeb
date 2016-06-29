
CREATE VIEW UserAuthentication AS SELECT uid, username, password, nickname FROM Users

ALTER TABLE Blogs ADD FOREIGN KEY (uid) REFERENCES Users(uid)

CREATE VIEW UserInfo AS SELECT uid, email, bio, nickname, facebook, twitter, github, linkedin, resume, portrait FROM Users

CREATE VIEW UserBlogIndex AS SELECT blogId, uid, nickname, title, createtime FROM Users, Blogs WHERE Users.uid=Blogs.uid

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


