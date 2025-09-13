<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Response;
use App\Models\Employee;
use App\Models\Family;

class FamilyController extends Controller
{
    public function indexByEmployee(array $params): void
    {
        $employeeId = (int)$params['id'];
        $empModel = new Employee($this->db);
        if (!$empModel->find($employeeId)){
            Response::error('Empleado no encontrado', 404);
            return ;
        } 
        $famModel = new Family($this->db);
        $items = $famModel->listByEmployee($employeeId);
        Response::json(['items' => $items]);
    }

    public function storeForEmployee(array $params): void
    {
        if (!$this->requireToken()) return;
        $employeeId = (int)$params['id'];
        $empModel = new Employee($this->db);
        if (!$empModel->find($employeeId)) {
            Response::error('Empleado no encontrado', 404);
            return;
        }
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $errors = $this->validate($input);
        if ($errors){
            Response::error('Datos inválidos', 422, $errors);
            return;
        } 
        $famModel = new Family($this->db);
        $id = $famModel->createForEmployee($employeeId, $input);
        Response::json(['id' => $id], 201);
    }

    public function destroy(array $params): void
    {
        if (!$this->requireToken()) return;
        $id = (int)$params['id'];
        $famModel = new Family($this->db);
        $ok = $famModel->delete($id);
        Response::json(['deleted' => $ok]);
    }

    private function validate(array $data): array
    {
        $errors = [];
        if (empty($data['nombre_familiar'])) $errors['nombre_familiar'] = 'Requerido';
        if (empty($data['parentesco'])) $errors['parentesco'] = 'Requerido';
        if (!empty($data['fecha_nacimiento']) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['fecha_nacimiento'])) $errors['fecha_nacimiento'] = 'Formato YYYY-MM-DD';
        return $errors;
    }
}

