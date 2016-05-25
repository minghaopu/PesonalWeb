<?php
    require 'connectDB.php';
	require 'json.php';

    

	session_start();
	$username = $_POST['username'];
	$password = $_POST['password'];
	$userId = '1234';
	// $_SESSION['user_id']=$row['user_id'];
    // $_SESSION['username']=$row['username'];
    $_SESSION['user_id'] = $userId;
    $_SESSION['username'] = $username;

    $data = array('session_id' => , );

    $result = array(
    	'success' => true,
    	'data' => $data
    );
?>