<?php 
	class File {
		public function upload($operation){
			$success = false;
			$data = array();
			$errorcode = -2;

			if (sessionCheck()) {
				$uid = $_SESSION['id'];

				if ($_FILES["file"]["error"] > 0) {
					$errorcode = 21; //upload error
				}else {
					$path = $_FILES['file']['name'];
					$ext = pathinfo($path, PATHINFO_EXTENSION);

					if ($operation === 'resume') {
						$size = 5000000;
						$oldPath = '../pdf/resume'.$uid.'.pdf';
						$storePath = './pdf/resume'.$uid.'.pdf';
						if ($ext === 'pdf') {
							if ($_FILES["file"]["size"] < $size) {
								// if (is_uploaded_file($_FILES['file']['name'])){
									if (file_exists($oldPath)){
										unlink($oldPath);
									}
									if (move_uploaded_file($_FILES['file']['tmp_name'], $oldPath)){

										$resume = addslashes($storePath);
										$db = new DB();
										$sql = sprintf(UPDATE_RESUME, $resume, $uid);

										if ($db->_update($sql) === 1) {
											$success = true;
										} else {
											$errorcode = 15; //db error
										}
										unset($db);
										
										$success = true;
										$data['resume'] = $resume;
									}
								// } else {
								// 	$errorcode = 24; // not http upload
								// }
							}else {
								$errorcode = 23; //size error
							}
						} else {
							$errorcode = 22; //type error
						}
					} else {
						$oldPathArray = array (
							'jpg' => './img/portrait/portrait'.$uid.'.jpg',
							'gif' => './img/portrait/portrait'.$uid.'.gif',
							'bmp' => './img/portrait/portrait'.$uid.'.bmp',
							'jpeg' => './img/portrait/portrait'.$uid.'.jpeg',
							'png' => './img/portrait/portrait'.$uid.'.png'
						);
						$size = 2000000;
						$newPath = '../img/portrait/portrait'.$uid.".".$ext;
						$storePath = './img/portrait/portrait'.$uid.".".$ext;
						if ($ext === 'jpq' || $ext === 'gif' || $ext === 'bmp' || $ext === 'jpeg' || $ext === 'png'){
							if ($_FILES["file"]["size"] < $size) {
								// if (is_uploaded_file($_FILES['file']['name'])){
									foreach ($oldPathArray as $key => $oldPath) {
										if (file_exists($oldPath)){
											unlink($oldPath);
										}
									}
									if (move_uploaded_file($_FILES['file']['tmp_name'], $newPath)){


										$portrait = addslashes($storePath);
										$db = new DB();
										$sql = sprintf(UPDATE_PORTRAIT, $portrait, $uid);

										if ($db->_update($sql) === 1) {
											$success = true;
										} else {
											$errorcode = 15; //db error
										}
										unset($db);
										
										$success = true;
										$data['portrait'] = $portrait;
									}
								// } else {
								// 	$errorcode = 24; // not http upload
								// }
							}else {
								$errorcode = 23; //size error
							}
						} else {
							$errorcode = 22; //type error
						}
					}
				}
			}else {
				$success = false;
				$errorcode = -3;
			}

			$return = new ReturnData($data, $errorcode, $success);
			echo $return->toJson();
		}
	}

 ?>