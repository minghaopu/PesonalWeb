<?php 
	// require_once "json.php";
	// require "db.php";

	class Blog {
		public function getIndex($param) {
			$success = true;
			$data = array();
			$errorcode = -1;
			if (sessionCheck()) {
				$uid = $_SESSION['id'];
				$isUser = $param->isUser;
				$db = new DB();
				if ($isUser) {
					// check user identity
					$sql = sprintf(GET_USER_INDEX, $uid);
					$result = $db->query($sql);
					$data['list'] = $result->rows;
				}else{
					// check whether the blogger is exist
					$nickname = $param->nickname;
					$sql = sprintf(CHECKE_USER, $nickname);
					$result = $db->query($sql);

					if ($result->num_rows !== 0){
						// put bloger's info into data
						$apps = array();
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

						// put bloger's blod index into data

						$sql = sprintf(GET_OTHER_INDEX, $nickname);
						$result = $db->query($sql);
						$data['list'] = $result->rows;

					}else{
						$data['isFound'] = false;
					}
				}
				unset($db);
			}else {
				$success = false;
				$errorcode = -1;
			}



			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();
		}

		public function get($param) {
			$success = true;
			$data = null;
			$errorcode = -1;
			if (sessionCheck()) {
				$uid = $_SESSION['id'];
				if(!is_null($param->blogId)) {
					$blogId = $param->blogId;

					$db = new DB();
					$sql = sprintf(GET_BLOG, $blogId ,$uid);

					$result = $db->query($sql);

					if ($result->num_rows !== 0) {
						$success = true;
						$errorcode = -1;
						$data = $result->row;
						
					}else {
						$success = false;
						$errorcode = 5; //errorcode 5: delete fail
					}
					unset($db);
				}else{
					$success = false;
					$errorcode = 5; // not new blog error
				}
			}else {
				$success = false;
				$errorcode = -1;
			}

			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();
		}
		public function create($param) {
			$success = true;
			$data = array();
			$errorcode = -1;
			if (sessionCheck()) {
				$uid = $_SESSION['id'];
				if($param->blogId === 'new') {
					$title = addslashes($param->title);
					$content = addslashes($param->content);
					// $content = $param->content;
					// echo $content;
					$createtime = date('Y-m-d H:i:s');
					$lastmodifytime = $createtime;

					$db = new DB();
					$sql = sprintf(ADD_BLOG, $uid, $title, $content, $createtime, $lastmodifytime);
					if ($db->_insert($sql) === 1) {
						$success = true;
						$data['blogId'] = $db->getLastId();
					}else {
						$errorcode = 5; //db error
					}
					unset($db);
				}else{
					$errorcode = 5; // not new blog error
				}
			}else {
				$success = false;
				$errorcode = -1;
			}

			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();
		}
		public function update($param) {
			$success = false;
			$data = null;
			$errorcode = -1;
			if (sessionCheck()) {
				$uid = $_SESSION['id'];
				if($param->blogId !== 'new') {
					$blogId = $param->blogId;
					$title = addslashes($param->title);
					$content = addslashes($param->content);
					// $content = $param->content;
					// echo $content;
					$lastmodifytime = date('Y-m-d H:i:s');

					$db = new DB();
					$sql = sprintf(UPDATE_BLOG, $title, $content, $lastmodifytime, $blogId, $uid);
					if ($db->_update($sql) === 1) {
						$success = true;
					}else {
						$errorcode = 5; //errorcode 5: delete fail
					}
					unset($db);
				}else{
					$errorcode = 5; // not new blog error
				}
			}else {
				$success = false;
				$errorcode = -1;
			}

			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();
		}
		public function delete($param) {
			$success = false;
			$data = null;
			$errorcode = -1;

			if (sessionCheck()) {
				$uid = $_SESSION['id'];
				$blogId = $param->blogId;

				$db = new DB();
				$sql = sprintf(DELETE_BLOG, $blogId, $uid);

				if ($db->_delete($sql) === 1) {
					$success = true;
				}else {
					$errorcode = 5; //errorcode 5: delete fail
				}
				unset($db);
			}else {
				$success = false;
				$errorcode = -1;
			}



			$return = new ReturnData($data, $errorcode, $success);
			$return->toJson();
		}

	}

 ?>