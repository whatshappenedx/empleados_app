<?php
declare(strict_types=1);

namespace App\Core;

use App\Config;
use PDO;

abstract class Controller
{
    protected PDO $db;

    public function __construct()
    {
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', Config::DB_HOST, Config::DB_PORT, Config::DB_NAME);
        $this->db = new PDO($dsn, Config::DB_USER, Config::DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }

    protected function requireToken(): bool
    {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? '';
        $apiKey = $headers['X-API-Key'] ?? '';
        if (preg_match('/Bearer\s+(.*)/i', $auth, $m)) {
            $token = trim($m[1]);
            if ($token === Config::API_TOKEN) return true;
        }
        if (!empty($apiKey) && $apiKey === Config::API_TOKEN) return true;
        Response::error('Unauthorized', 401);
        return false;
    }
}

