<?php
	$date = date(ymdhis);
	//echo($date);
	if ((($_FILES["uppic"]["type"] == "image/gif") || ($_FILES["uppic"]["type"] == "image/jpeg") || ($_FILES["uppic"]["type"] == "image/pjpeg")) && ($_FILES["uppic"]["size"] < 2000000)) {
		if ($_FILES["uppic"]["error"] > 0) {
			echo "Return Code: " . $_FILES["uppic"]["error"] . "<br />";
		} else {

			$uptype = explode(".", $_FILES["uppic"]["name"]);
			$newname = $date.".".$uptype[1];
		//echo($newname);
			$_FILES["uppic"]["name"] = $newname;
			if (file_exists("pics/" . $_FILES["uppic"]["name"])) {
				echo $_FILES["uppic"]["name"] . " already exists. ";
			}
			else {
				$_FILES["uppic"]["name"] = move_uploaded_file($_FILES["uppic"]["tmp_name"],"pics/" . $_FILES["uppic"]["name"]);
				echo "<script>alert('上传成功!')</script>";
				echo "<script>window.location.href='http://www.111cn.net';</script>";
			}
		}
	} else {
		echo "Invalid file";
	}
?>