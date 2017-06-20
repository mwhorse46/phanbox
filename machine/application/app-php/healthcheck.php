<?php
require_once 'vendor/autoload.php';

$mysqlConnected = false;
$redisConnected = false;
$mongoConnected = false;

try {
    $mysql = new PDO('mysql:host=127.0.0.1;dbname=app', 'app', 'app');
    $mysql->query('SELECT 1');

    $mysqlConnected = true;
} catch (Throwable $e) {
    // Suppress exception
}

try {
    $redis = new Redis();
    $redis->connect('127.0.0.1');
    $redis->ping();

    $redisConnected = true;
} catch (Throwable $e) {
    // Suppress exception
}

try {
    $mongo = new MongoDB\Client('mongodb://app:app@127.0.0.1/app');
    $appDb = $mongo->app;
    $cursor = $appDb->command(['ping' => 1]);

    assert($cursor->toArray()[0]['ok'] === 1);

    $mongoConnected = true;
} catch (Throwable $e) {
    // Suppress exception
}

