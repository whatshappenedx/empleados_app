<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Response;
use App\Models\Employee;

class EmployeeController extends Controller
{
    public function index(): void
    {
        $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? max(1, min(100, (int)$_GET['limit'])) : 10;
        $q = $_GET['q'] ?? null;
        $model = new Employee($this->db);
        $data = $model->paginate($page, $limit, $q);
        Response::json($data);
    }

    public function show(array $params): void
    {
        $id = (int)$params['id'];
        $model = new Employee($this->db);
        $emp = $model->find($id);
        if (!$emp) {
            Response::error('Empleado no encontrado', 404);
            return;
        }

        Response::json($emp);
    }

    public function store(): void
    {
        if (!$this->requireToken()) return;
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $errors = $this->validate($input);
        if ($errors) {
            Response::error('Datos inválidos', 422, $errors);
            return;
        }
        $model = new Employee($this->db);
        $id = $model->create($input);
        Response::json(['id' => $id], 201);
    }

    public function update(array $params): void
    {
        if (!$this->requireToken()) return;
        $id = (int)$params['id'];
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $errors = $this->validate($input);
        if ($errors) {
            Response::error('Datos inválidos', 422, $errors);
            return;
        }
        $model = new Employee($this->db);
        if (!$model->find($id)) {
            Response::error('Empleado no encontrado', 404);
            return;
        }
        $ok = $model->update($id, $input);
        Response::json(['updated' => $ok]);
    }

    public function destroy(array $params): void
    {
        if (!$this->requireToken()) return;
        $id = (int)$params['id'];
        $model = new Employee($this->db);
        $ok = $model->delete($id);
        Response::json(['deleted' => $ok]);
    }

    private function validate(array $data): array
    {
        $errors = [];
        if (empty($data['nombre'])) $errors['nombre'] = 'Requerido';
        if (empty($data['correo']) || !filter_var($data['correo'], FILTER_VALIDATE_EMAIL)) $errors['correo'] = 'Correo inválido';
        if (empty($data['cargo'])) $errors['cargo'] = 'Requerido';
        if (!empty($data['fecha_ingreso']) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['fecha_ingreso'])) $errors['fecha_ingreso'] = 'Formato YYYY-MM-DD';
        return $errors;
    }
}

