<?php
	error_reporting(E_ALL);
	ini_set('display_errors',1);
	ini_set('session.user_only_cookies', true);
	ini_set('session.cookie_httponly', 1);
	ini_set('session.name', '_KLJ');
	ini_set('session.cookie_lifetime', 84600);
	ini_set('session.gc_maxlifetime', 84600);

	require_once 'util.php';
	require_once 'db.php';
	require_once 'json.php';
	require_once 'user.php';
	require_once 'blog.php';
	require_once 'file.php';


	date_default_timezone_set("UTC");

	$GLOBALS['islogged'] = false;
	$url = $_SERVER['REQUEST_URI'];


	if (preg_match('/php/i', $url)) {
		// echo '1';
		$user = new User;
		$blog = new Blog;
		$file = new File;
		// echo '2';
		// echo $user;
		// $passage = new Passage;
		$module = preg_split('/\/php\//', $url)[1];


		switch ($module) {
			case 'user':
				$param = json_decode(file_get_contents('php://input'));
				$methodName = $param->action;
				$data = $param->data;
				$user->{$methodName}($data);
				break;
			case 'passage':
				$param = json_decode(file_get_contents('php://input'));
				$methodName = $param->action;
				$data = $param->data;
				$blog->{$methodName}($data);
				break;
			case 'resume':
				$file->upload('resume');
				break;
			case 'image':
				$file->upload('image');
				break;
			default:
				header('Location: /');
		}

	}else {
		header('Location: /');
	}




?>