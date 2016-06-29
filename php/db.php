<?php
require_once 'config.php';
/**
* database connection class
*/
class DB
{
	private $host;
	private $username;
	private $password;
	private $dbName;
	private $charset;
	private $port;

	public $SqlBug = '';
	private $pdo = null;
	private $statement = null;

	function __construct()
	{
		$this->host = DB_HOST;
		$this->username = DB_USER;
		$this->password = DB_PASSWORD;
		$this->dbName = DB_NAME;
		$this->port = DB_PORT;
		$this->charset = DB_CHARSET;
		try {
			$this->pdo = new PDO(
				"mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->dbName,
				$this->username,
				$this->password,
				array(PDO::ATTR_PERSISTENT => true)
			);
		} catch (PDOException $e) {
			die ('Error!: ' . $e->getMessage() . '<br/>');
		}
		$this->pdo->exec("SET NAMES '" . $this->charset . "'");
		$this->pdo->exec("SET CHARACTER SET " . $this->charset);
		$this->pdo->exec("SET CHARACTER_SET_CONNECTION=" . $this->charset);
		$this->pdo->exec("SET SQL_MODE = ''");
	}

	public function prepare($sql)
	{
		$this->statement = $this->pdo->prepare($sql);
		$this->SqlBug .= "\n". '<!--DebugSql: ' . $sql . '-->' . "\n";
	}

	public function bindParam($parameter, $variable, $data_type = PDO::PARAM_STR, $length = 0)
	{
		if ($length) {
		 $this->statement->bindParam($parameter, $variable, $data_type, $length);
		} else {
		 $this->statement->bindParam($parameter, $variable, $data_type);
		}
	}


	public function query($sql, $params = array())
	{
		$this->statement = $this->pdo->prepare($sql);
		$result = false;
		$this->SqlBug .= "\n". '<!--DebugSql: ' . $sql . '-->' . "\n";
		try {
			if ($this->statement && $this->statement->execute($params)) {
				$data = array();
				while ($row = $this->statement->fetch(PDO::FETCH_ASSOC)) {
					$data[] = $row;
				}
				$result = new stdClass();
				$result->row = (isset($data[0]) ? $data[0] : array());
				$result->rows = $data;
				$result->num_rows = $this->statement->rowCount();
			}
			
		} catch (PDOException $e) {
			trigger_error('Error: ' . $e->getMessage() . ' Error Code : ' . $e->getCode() . ' <br />' . $sql);
			exit();
		}

		if ($result) {
			return $result;
		} else {
			$result = new stdClass();
			$result->row = array();
			$result->rows = array();
			$result->num_rows = 0;
			return $result;
		}
	}

	public function fetchAll($sql, $params = array())
	{
		$rows = $this->query($sql, $params)->rows;
		return !empty($rows) ? $rows : false;
	}

	public function fetchAssoc($sql, $params = array())
	{
		$row = $this->query($sql, $params)->row;
		return !empty($row) ? $row : false;
	}

	public function fetchColumn($sql, $params = array())
	{
		$data = $this->query($sql, $params)->row;
		if(is_array($data)) {
			foreach ($data as $value) {
		 		return $value;
			}
		}
		return false;
	}

	public function rowCount($sql, $params = array())
	{
		return $this->query($sql, $params)->num_rows;
	}


	public function _insert($sql)
	{
		try {

			// Prepare statement
			$this->statement = $this->pdo->prepare($sql);
			$result = false;
			$this->SqlBug .= "\n". '<!--DebugSql: ' . $sql . '-->' . "\n";
			// execute the query
			$this->statement->execute();
			// echo a message to say the UPDATE succeeded
			return $this->statement->rowCount();
		}
		catch(PDOException $e)
		{
			echo $sql . "<br>" . $e->getMessage();
		}
	}

	public function _update($sql)
	{
		try {

			// Prepare statement
			$this->statement = $this->pdo->prepare($sql);
			$result = false;
			$this->SqlBug .= "\n". '<!--DebugSql: ' . $sql . '-->' . "\n";
			// execute the query
			$this->statement->execute();
			// echo a message to say the UPDATE succeeded
			return $this->statement->rowCount();
		}
		catch(PDOException $e)
		{
			echo $sql . "<br>" . $e->getMessage();
		}
	}

	public function _delete($sql)
	{
		return $this->pdo->exec($sql);
	}

	public function countAffected() {
		if ($this->statement) {
			return $this->statement->rowCount();
		} else {
			return 0;
		}
	}

	public function getLastId() {
		return $this->pdo->lastInsertId();
	}


	public function escape($value)
	{
		$search = array("\\", "\0", "\n", "\r", "\x1a", "'", '"');
		$replace = array("\\\\", "\\0", "\\n", "\\r", "\Z", "\'", '\"');
		return str_replace($search, $replace, $value);
	}

	public function errorInfo()
	{
		return $this->statement->errorInfo();
	}

	public function errorCode()
	{
		return $this->statement->errorCode();
	}
	public function quote($string)
	{
		return $this->pdo->quote($string);
	}

	public function __destruct()
	{
		$this->pdo = null;
	}
}

// $settings = [
// 	'host' => 'localhost',
// 	'port' => '3306',
// 	'name' => 'myblogdb',
// 	'username' => 'root',
// 	'password' =>
// ]
// $dbms='mysql';
// $host='localhost';
// $dbName='myblogdb';
// $user='root';
// $pass='0conceit';
// $dsn='$dbms:host=$host;dbname=$dbName';

// $dbh = new PDO($dsn, $user, $pass);

// try {
// 	$dbh = new PDO($dsn, $user, $pass); //初始化一个PDO对象
// 	echo '连接成功<br/>';
// 	foreach ($dbh->query('SELECT * from FOO') as $row) {
// 		print_r($row); //你可以用 echo($GLOBAL); 来看到这些值
// 	}
// 	$dbh = null;
// } catch (PDOException $e) {
// 	die ('Error!: ' . $e->getMessage() . '<br/>');
// }

?>