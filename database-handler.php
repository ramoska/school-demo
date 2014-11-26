<?php
$limit = 2;
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
    $data = array(
        !empty($_GET['age-from']) ? $_GET['age-from'] : '0',
        !empty($_GET['age-to']) ? $_GET['age-to'] : '100',
        !empty($_GET['attending']) ? $_GET['attending'] : '%',
    );

    $query = $db->prepare("SELECT COUNT(*) as cnt FROM participants WHERE `age` >= ? AND `age` <= ? AND `attending` LIKE ?");
    $query->execute($data);
    $cnt = $query->fetchAll();

    $query = $db->prepare("SELECT * FROM participants WHERE `age` >= ? AND `age` <= ? AND `attending` LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?");
    $limit = !empty($_GET['limit']) ? $_GET['limit'] : 5;
    $data[] = $limit;
    $data[] = !empty($_GET['page']) ? $limit * ($_GET['page'] - 1) : 0;
    $query->execute($data);

    echo json_encode(array(
        'results' => $query->fetchAll(),
        'page' => (!empty($_GET['page']) ? $_GET['page'] : 1),
        'totalPages' => ceil($cnt[0]['cnt'] / $limit),
    ));
}
$db = null;
