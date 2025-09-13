<?php
// Front controller
declare(strict_types=1);

// Basic CORS handling (fine-tuned in config)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../src/bootstrap.php';

use App\Core\Router;

$router = new Router();

// Routes
// Employees
$router->get('/api/empleados', 'EmployeeController@index');
$router->get('/api/empleados/{id}', 'EmployeeController@show');
$router->post('/api/empleados', 'EmployeeController@store');
$router->put('/api/empleados/{id}', 'EmployeeController@update');
$router->delete('/api/empleados/{id}', 'EmployeeController@destroy');

// Families
$router->get('/api/empleados/{id}/familiares', 'FamilyController@indexByEmployee');
$router->post('/api/empleados/{id}/familiares', 'FamilyController@storeForEmployee');
$router->delete('/api/familiares/{id}', 'FamilyController@destroy');

// Default
$router->get('/', function () {
    echo json_encode([
        'message' => 'API empleados OK',
        'endpoints' => [
            'GET /api/empleados',
            'GET /api/empleados/{id}',
            'POST /api/empleados',
            'PUT /api/empleados/{id}',
            'DELETE /api/empleados/{id}',
            'GET /api/empleados/{id}/familiares',
            'POST /api/empleados/{id}/familiares',
            'DELETE /api/familiares/{id}',
        ],
    ], JSON_UNESCAPED_UNICODE);
});

$router->dispatch();

