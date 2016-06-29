<?php
class ReturnData {
	private $success;
	private $data;
	private $error;
	function __construct($data, $errorcode, $success)
	{

		$this->success = $success;
		$this->error = array ("errorcode"=>$errorcode);
		$this->data =  is_null($data) || empty($data) ? (object)array() : $data;

	}
	public function toJson()
	{
		if ($this->success) {
			$json = array (
				"success" => true,
				"data" => $this->data
			);
		}else {
			$json = array (
				"success" => false,
				"error" => $this->error
			);
		}
		echo json_encode($json);
	}
}

?>