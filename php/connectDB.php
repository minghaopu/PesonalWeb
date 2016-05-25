<?php

$dbms='mysql';
$host='localhost';
$dbName='user_au';
$user='root';
$pass='0conceit';
$dsn="$dbms:host=$host;dbname=$dbName";

$dbh = new PDO($dsn, $user, $pass);


 ?>