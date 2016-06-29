<?php 
	/*
	 *	Database Configuration
	 */
	define("DB_HOST","http://50.112.16.154/");
	define("DB_USER","roneil_PMH");
	define("DB_PASSWORD","0conceit_PMH");
	define("DB_NAME","minghaodb");
	define("DB_CHARSET","utf8");
	define("DB_PORT", "3306");

	/*
	 *	User Sql
	 */
	//check login
	define("CHECKE", "SELECT uid, nickname FROM UserAuthentication WHERE username='%s' AND password='%s'");

	//login
	define("LOGIN", "SELECT uid, nickname, password FROM UserAuthentication WHERE username='%s'");

	// replicate username check
	define("CHECKE_REP_USERNAME", "SELECT * FROM UserAuthentication WHERE username='%s'");
	// replicate nickname check
	define("CHECKE_REP_NICKNAME", "SELECT * FROM UserAuthentication WHERE nickname='%s'");

	//register (username, password, nickname)
	define("REGISTER", "INSERT INTO UserAuthentication (username, password, nickname) VALUES ('%s', '%s', '%s')");

	// modify pwd (password, uid)
	define("CHANGE_PWD", "UPDATE UserAuthentication SET password='%s' WHERE uid='%s' AND password='%s'");

	// get current user's info (uid)
	define("GET_INFO", "SELECT * FROM UserInfo WHERE uid='%s'");

	// get other user's info & check whether the user exist (nickname)
	define("CHECKE_USER", "SELECT * FROM UserInfo WHERE nickname='%s'");


	// update user's info (nickname, bio, email, facebook, linkedin, twitter, github)
	define("UPDATE_INFO", "UPDATE UserInfo SET nickname='%s', bio='%s', email='%s', facebook='%s', linkedin='%s', twitter='%s', github='%s'  WHERE uid='%s'");

	// update resume place
	define("UPDATE_RESUME", "UPDATE UserInfo SET resume='%s' WHERE uid='%s'");

	// delete resume
	define("DELETE_RESUME", "UPDATE UserInfo SET resume=NULL WHERE uid='%s'");

	// update portrait place
	define("UPDATE_PORTRAIT", "UPDATE UserInfo SET portrait='%s' WHERE uid='%s'");

	// get other's resume
	define("GET_RESUME", "SELECT resume FROM UserInfo WHERE nickname='%s'");

	// search user
	define("SEARCH", "SELECT * FROM UserInfo WHERE nickname='%s'");
	
	/*
	 *	Blog Sql
	 */

	// nickname
	define("GET_OTHER_INDEX", "SELECT blogId, title, lastmodifytime FROM UserBlogIndex WHERE nickname='%s'");

	// uid
	define("GET_USER_INDEX", "SELECT blogId, title, lastmodifytime FROM UserBlogIndex WHERE uid='%s'");

	// blogId, uid
	define("GET_BLOG", "SELECT * FROM Blogs WHERE blogId='%s' AND uid='%s'");

	// uid, title, ct, content
	define("ADD_BLOG", "INSERT INTO Blogs (uid, title, content, createtime, lastmodifytime) VALUES ('%s', '%s', '%s', '%s', '%s')");

	//content, lmt, bid, uid
	define("UPDATE_BLOG", "UPDATE Blogs SET title='%s', content='%s', lastmodifytime='%s' WHERE blogId='%s' AND uid='%s'");

	// bid, uid

	define("DELETE_BLOG", "DELETE FROM Blogs WHERE blogId='%s' AND uid='%s'");

	define("LIFETIME", 24*3600)
?>