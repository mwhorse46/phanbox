<?php
require_once '../vendor/autoload.php';

$title = 'Phanbox PHP App';
$time = Carbon\Carbon::now()->format('l jS \\of F Y h:i:s A');

// Check MySQL
$mysql = new PDO('mysql:host=127.0.0.1;dbname=app', 'app', 'app');
$mysql->query('SELECT 1');

// Check Redis
$redis = new Redis();
$redis->connect('127.0.0.1');
$redis->ping();
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title><?= $title ?></title>
</head>
<body>
    <em>It works!</em>
    <h1><?= $title ?></h1>
    <h2><?= $time ?></h2>
    <h3>MySQL connection established</h3>
    <h3>Redis connection established</h3>
</body>
</html>
