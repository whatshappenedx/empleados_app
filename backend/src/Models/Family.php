<?php
declare(strict_types=1);

namespace App\Models;

use PDO;

class Family
{
    public function __construct(private PDO $db) {}

    public function listByEmployee(int $employeeId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM familiares_directos WHERE id_empleado = :id_empleado ORDER BY id DESC');
        $stmt->execute([':id_empleado' => $employeeId]);
        return $stmt->fetchAll();
    }

    public function createForEmployee(int $employeeId, array $data): int
    {
        $stmt = $this->db->prepare('INSERT INTO familiares_directos (id_empleado, nombre_familiar, parentesco, fecha_nacimiento) VALUES (:id_empleado, :nombre_familiar, :parentesco, :fecha_nacimiento)');
        $stmt->execute([
            ':id_empleado' => $employeeId,
            ':nombre_familiar' => $data['nombre_familiar'],
            ':parentesco' => $data['parentesco'],
            ':fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM familiares_directos WHERE id = :id');
        return $stmt->execute([':id' => $id]);
    }
}

