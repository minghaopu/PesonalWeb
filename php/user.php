<?php
	// require_once "json.php";
	// require "db.php";


	class User {

		private function encode($pwd) {
			$options = [
				'cost' => 10
			];
			return password_hash($pwd, PASSWORD_DEFAULT, $options);
		}
		public function check() {

			$success = true;
			$data = array();
			$apps = array();
			$errorcode = -1; //not login


			if (sessionCheck()) {
				$uid = $_SESSION['id'];

				$db = new DB();

				$sql = sprintf(GET_INFO, $uid);

				$result = $db->query($sql);

				unset($db);

				foreach($result->row as $key => $value) {
					if ($key === 'uid' || $key === 'bio' || $key === 'resume' || $key === 'portrait' || $key === 'nickname') {
						$data[$key] = $value;
					}else {
						if (!empty($value)) {
							$apps[$key] = $value;
						}
					}
				}
				$data['apps'] = $apps;
			}else {
				$success = false;
				$errorcode = -1;
			}

			$return = new ReturnData($data, $errorcode, $success);
			$return->toJson();
		}
		public function logout() {
			//enmpty session
			$GLOBALS['islogged'] = false;
			session_start();
			session_destroy();
			$success = true;
			$data = array();
			$errorcode = -1;

			$return = new ReturnData($data, $success, $errorcode);
			echo $return->toJson();
		}
		public function login($param) {
			$success = false;
			$data = array();
			$apps = array();
			$errorcode = -1;



			if (empty($param->username)) {
				$errorcode = 6; // old pwd field empty
			} else if (empty($param->password)) {
				$errorcode = 8; // password field empty
			} else {
				$username = addslashes($param->username);
				$password = addslashes($param->password);

				$db = new DB();

				$sql = sprintf(LOGIN, $username);

				$result = $db->query($sql);

				if ($result->num_rows === 1) {

					if (password_verify($password, $result->row['password'])) {

						$success = true;
						$uid = $result->row['uid'];

						// set cookie and session id
						session_start();
						$encodeUID = $this->encode($uid);
						$encodeNAME = $this->encode($result->row['nickname']);
						$time = time();

						$_SESSION['id'] = $result->row['uid'];
						$_SESSION['uid'] = $encodeUID;
						$_SESSION['name'] = $encodeNAME;
						$_SESSION['generated'] = $time;
						$GLOBALS['islogged'] = true;

						setcookie('uid', $encodeUID, $time + LIFETIME);
						setcookie('name', $encodeNAME, $time + LIFETIME);

						// format return data -- user info

						$sql = sprintf(GET_INFO, $uid);
						$result = $db->query($sql);
						foreach($result->row as $key => $value) {
							if ($key === 'uid' || $key === 'bio' || $key === 'resume' || $key === 'portrait' || $key === 'nickname') {
								$data[$key] = $value;
							}else {
								if (!empty($value)) {
									$apps[$key] = $value;
								}
							}
						}
						$data['apps'] = $apps;

					}else {
						$errorcode = 19; // pwd wrong
					}
				} else if ($result->num_rows === 0) {
					$errorcode = 18; // username wrong
				} else {
					$errorcode = 15; //db error
				}
				unset($db);

			}

			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();

		}
		public function register($param) {
			$success = false;
			$data = array();
			$errorcode = -1;
/*
			if (empty($param->username)) {
				$errorcode = 6; // username field empty
			} else if (empty($param->nickname)) {
				$errorcode = 7; // nickname field empty
			} else if (empty($param->password)) {
				$errorcode = 8; // pwd field empty
			} else if (empty($param->confirm)) {
				$errorcode = 9; // confirm field empty
			} else {
				$username = addslashes($param->username);
				$nickname = addslashes($param->nickname);
				$password = addslashes($param->password);
				$confirm = addslashes($param->confirm);
				if ($password === $confirm) {
					$db = new DB();

					$checkUserSql = sprintf(CHECKE_REP_USERNAME, $username);
					$checkUser = $db->query($checkUserSql);

					$checkNickSql = sprintf(CHECKE_REP_NICKNAME, $nickname);
					$checkNick = $db->query($checkNickSql);

					if ($checkUser->num_rows === 0 && $checkNick->num_rows === 0) {
						$encode = $this->encode($password);
						$sql = sprintf(REGISTER, $username, $encode, $nickname);

						if ($db->_insert($sql) === 1) {
							$success = true;
							$data['uid'] = $db->getLastId();
							$data['nickname'] = $param->nickname;
							

							// set cookie and session id
							session_start();
							$encodeUID = $this->encode($data['uid']);
							$encodeNAME = $this->encode($data['nickname']);
							$time = time();

							$_SESSION['id'] = $data['uid'];
							$_SESSION['uid'] = $encodeUID;
							$_SESSION['name'] = $encodeNAME;
							$_SESSION['generated'] = $time;
							$GLOBALS['islogged'] = true;

							setcookie('uid', $encodeUID, $time + LIFETIME);
							setcookie('name', $encodeNAME, $time + LIFETIME);

						}else {
							$errorcode = 15; //db error
						}

					}else if ($checkUser->num_rows !== 0 && $checkNick->num_rows === 0){
						$errorcode = 12; //username occupied
					}else if ($checkUser->num_rows === 0 && $checkNick->num_rows !== 0){
						$errorcode = 13; //nickname occupied
					}else {
						$errorcode = 14; //both occupied
					}

					unset($db);
				} else {
					$errorcode = 11; // pwd != confirm
				}
			}
*/
			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();
		}
		public function getInfo() {
			$success = false;
			$data = array();
			$apps = array();
			$errorcode = -1;

			if (sessionCheck()) {
				$uid = $_SESSION['id'];
				$db = new DB();
				$sql = sprintf(GET_INFO, $uid);

				$result = $db->query($sql);

				if ($result->num_rows !== 0) {
					$success = true;
					foreach($result->row as $key => $value) {
						if ($key === 'uid' || $key === 'bio' || $key === 'resume' || $key === 'portrait' || $key === 'nickname') {
							$data[$key] = $value;
						}else {
							if (!empty($value)) {
								$apps[$key] = $value;
							}
						}
					}
					$data['apps'] = $apps;
				}else {
					$errorcode = 5; //db error
				}
				unset($db);
			}else {
				$success = false;
				$errorcode = -1;
			}


			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();
		}
		public function updateInfo($param) {
			$success = false;
			$data = array();
			$errorcode = -1;

			if (sessionCheck()) {
				$uid = $_SESSION['id'];
				if (empty($param->nickname)) {
					$errorcode = 7; // nickname field empty
				} else {
					$nickname = addslashes($param->nickname);
					$bio = empty($param->bio)?'':addslashes($param->bio);
					$email = empty($param->email)?'':addslashes($param->email);
					$facebook = empty($param->facebook)?'':addslashes($param->facebook);
					$linkedin = empty($param->linkedin)?'':addslashes($param->linkedin);
					$twitter = empty($param->twitter)?'':addslashes($param->twitter);
					$github = empty($param->github)?'':addslashes($param->github);

					$db = new DB();

					$checkNickSql = sprintf(CHECKE_REP_NICKNAME, $nickname);
					$checkNick = $db->query($checkNickSql);
					
					if ($checkNick->num_rows === 0 || ($checkNick->num_rows === 1 && $checkNick->row['uid'] === $uid)) {


						$sql = sprintf(UPDATE_INFO, $nickname, $bio, $email, $facebook, $linkedin, $twitter, $github, $uid);
						if ($db->_update($sql) === 1) {
							$success = true;
							$apps = array();
							$sql = sprintf(GET_INFO, $uid);
							$result = $db->query($sql);
							foreach($result->row as $key => $value) {
								if ($key === 'uid' || $key === 'bio' || $key === 'resume' || $key === 'portrait' || $key === 'nickname') {
									$data[$key] = $value;
								}else {
									if (!empty($value)) {
										$apps[$key] = $value;
									}
								}
							}
							$data['apps'] = $apps;
							
						}else {
							$errorcode = 15; //db error
						}

					}else {
						$errorcode = 13; //nickname occupied
					}
					unset($db);
				}
			}else {
				$success = false;
				$errorcode = -1;
			}



			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();
		}
		public function updatePwd($param) {
			$success = false;
			$data = array();
			$errorcode = -1;
			if (sessionCheck()) {
				$uid = $_SESSION['id'];

				if (empty($param->oldPwd)) {
					$errorcode = 16; // old pwd field empty
				} else if (empty($param->newPwd)) {
					$errorcode = 8; // new pwd field empty
				} else if (empty($param->confirm)) {
					$errorcode = 9; // confirm field empty
				} else {

					$oldPwd = addslashes($param->oldPwd);
					$newPwd = addslashes($param->newPwd);
					$confirm = addslashes($param->confirm);

					if ($newPwd === $confirm) {
						$db = new DB();

						$encodeNew = $this->encode($newPwd);

						$sql = sprintf(GET_OLD, $uid);
						$result = $db->query($sql);
						if (password_verify($oldPwd, $result->row['password'])) {
							$sql = sprintf(CHANGE_PWD, $encodeNew, $uid);

							if ($db->_update($sql) === 1) {
								$success = true;
							} else {
								$errorcode = 15; //db error
							}
						} else {
							$errorcode = 17; // old pwd wrong
						}

						unset($db);
					} else {
						$errorcode = 11; // pwd != confirm
					}
				}
			}else {
				$success = false;
				$errorcode = -1;
			}


			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();
		}
		public function getResume($param) {
			$success = false;
			$data = array();
			$apps = array();
			$errorcode = -1;

			if (sessionCheck()) {
				$uid = $_SESSION['id'];
				$db = new DB();
				$nickname = addslashes($param->nickname);
				$sql = sprintf(GET_RESUME, $nickname);

				$result = $db->query($sql);
				if ($result->num_rows !== 0) {
					$success = true;
					$data['resume'] = $result->row['resume'];
				}else {
					$errorcode = 5; //db error
				}
				unset($db);
			}else {
				$success = false;
				$errorcode = -1;
			}


			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();
		}
		public function getPortrait() {
			$success = false;
			$data = array();
			$apps = array();
			$errorcode = -1;

			if (sessionCheck()) {
				$uid = $_SESSION['id'];
				$db = new DB();
				$sql = sprintf(GET_INFO, $uid);

				$result = $db->query($sql);

				if ($result->num_rows !== 0) {
					$success = true;
					$data['portrait'] = $result->row['portrait'];
				}else {
					$errorcode = 5; //db error
				}
				unset($db);
			}else {
				$success = false;
				$errorcode = -1;
			}


			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();
		}
		public function deleteResume() {
			$success = false;
			$data = array();
			$errorcode = -1;

			if (sessionCheck()) {
				$uid = $_SESSION['id'];

				$db = new DB();
				$sql = sprintf(DELETE_RESUME, $uid);
				if ($db->_update($sql) === 1) {
					$success = true;
				}else {
					$errorcode = 15; //db error
				}
				unset($db);

			}else {
				$success = false;
				$errorcode = -1;
			}



			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();
		}
		public function search($param) {
			$success = false;
			$data = array();
			$apps = array();
			$errorcode = -1;

			if (sessionCheck()) {
				$uid = $_SESSION['id'];
				$db = new DB();
				$nickname = addslashes($param->nickname);
				$sql = sprintf(SEARCH, $nickname);

				$result = $db->query($sql);
				if ($result->num_rows !== 0) {
					$success = true;
					$data['nickname'] = $result->row['nickname'];
				}else {
					$errorcode = 5; //db error
				}
				unset($db);
			}else {
				$success = false;
				$errorcode = -1;
			}


			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();
		}
		// public  function getResume($param) {
		// 	$success = false;
		// 	$data = array();
		// 	$errorcode = -1;

		// 	if (sessionCheck()) {
		// 		$uid = $_SESSION['id'];
		// 		$db = new DB();
		// 		if (is_null($param->nickname)) {
		// 			$sql = sprintf(GET_INFO, $uid);
		// 		}else {
		// 			$sql = sprintf(GET_OTHER_RESUME, $$param->nickname);
		// 		}

		// 		$result = $db->query($sql);

		// 		if ($result->num_rows !== 0) {
		// 			$success = true;
		// 			$data['resume'] = $result->row['resume'];
		// 		}else {
		// 			$errorcode = 5; //db error
		// 		}
		// 		unset($db);

		// 	}else {
		// 		$success = false;
		// 		$errorcode = -1;
		// 	}
		// 	$return = new ReturnData($data, $errorcode, $success);
		// 	echo $return->toJson();
		// }

	}

 ?>