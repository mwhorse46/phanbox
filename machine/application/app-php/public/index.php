<?php include __DIR__ . '/../healthcheck.php'; ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title><?= $title = 'Phanbox PHP App' ?></title>
</head>
<body>
    <em>It works!</em>
    
    <h1><?= $title ?></h1>
    <h2><?= $time = Carbon\Carbon::now()->toDayDateTimeString() ?></h2>

    <h3>Environment: <?= getenv('APP_ENV') ?: 'unknown' ?></h3>
    <h3>MySQL connection <?= $mysqlConnected ? 'is' : 'IS NOT' ?> established</h3>
    <h3>Redis connection <?= $redisConnected ? 'is' : 'IS NOT' ?> established</h3>
    <h3>Mongo connection <?= $mongoConnected ? 'is' : 'IS NOT' ?> established</h3>
</body>
</html>
