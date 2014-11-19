<?php
$db = new PDO('sqlite:metasite-app.db');
header('Content-type: application/json');

if (!empty($_POST)) {
    $d = $_POST;
    $insert = $db->prepare("INSERT INTO `participants` (`name`, `surname`, `phone`, `age`, `attending`) VALUES (?, ?, ?, ?, ?)");
    if (!$insert->execute(array($d['name'], $d['surname'], $d['phone'], $d['age'], $d['attending']))) {
        $err = $insert->errorInfo();
        echo json_encode(array(
            'status' => 'error',
            'message' => $err[2],
        ));
    } else {
        echo json_encode(array(
            'status' => 'success',
            'message' => 'Registracija sėkmingai išsaugota',
        ));
    }
} else {
    $d = $_GET;
    $query = $db->prepare("SELECT * FROM participants WHERE `age` >= ? AND `age` <= ? AND `attending` LIKE ?");
    $query->execute(array(
        !empty($d['age-from']) ? $d['age-from'] : '0',
        !empty($d['age-to']) ? $d['age-to'] : '100',
        !empty($d['attending']) ? $d['attending'] : '%',
    ));
    echo json_encode($query->fetchAll());
}
$db = null;
