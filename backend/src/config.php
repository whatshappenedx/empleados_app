<?php
declare(strict_types=1);

namespace App;

class Config
{
    public const DB_HOST = 'localhost';
    public const DB_PORT = 3306;
    public const DB_NAME = 'empresa_db';
    public const DB_USER = 'admin';
    public const DB_PASS = 'admin';
  
    public const API_TOKEN = '82d54dbbe7d234489893d4afd563f6fc4779f979dfba6a04b886dbfc721344c4';

    // CORS
    public const CORS_ORIGIN = '*';
}

