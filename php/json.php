<?php
class returnData {
    private $success;
    private $data;
    private $error;
    private $options;
    public function __construct($success, $data, $error){
        $this->success = $success;
        $this->error = $error;
        $this->data = $data;
        $this->options = $options
    }
    public function toJSON(){
        $json = array(
            'success' => $this->getName(),
            'data' => $this->getCode(),
            'msg' => $this->getMsg(),
        );
    
        return json_encode($json);
    }
}

?>