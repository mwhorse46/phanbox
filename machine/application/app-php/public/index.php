<?php
require_once '../vendor/autoload.php';

$title = 'Phanbox PHP App';
$time = Carbon\Carbon::now()->format('l jS \\of F Y h:i:s A')
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
</body>
</html>
