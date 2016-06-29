<?php 
/**
* Util
*/
 	function randString($length, $specialChars = false) {
		$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		if ($specialChars) {
			$chars .= '!@#$%^&*()';
		}

		$result = '';
		$max = strlen($chars) - 1;
		for ($i = 0; $i < $length; $i++) {
			$result .= $chars[rand(0, $max)];
		}
		return $result;
	}
	function sessionCheck() {
		$result = false;
		session_start();
		if (!isset($_SESSION['generated']) || $_SESSION['generated'] < (time() - 60)) {
			session_regenerate_id();
			$_SESSION['generated'] = time();
		}
		if (isset($_SESSION['uid']) && isset($_COOKIE["uid"]) && $_SESSION['uid'] === $_COOKIE['uid']) {
			if (isset($_SESSION['uid']) && isset($_COOKIE["uid"]) && $_SESSION['uid'] === $_COOKIE['uid']) {
				$result = true;
				$GLOBALS['islogged'] = true;
			}else {
				$GLOBALS['islogged'] = false;
			}
		} else {
			$GLOBALS['islogged'] = false;
		}
		return $result;
	}
?>