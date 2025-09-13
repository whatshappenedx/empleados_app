<?php
declare(strict_types=1);

namespace App\Models;

use PDO;

class Employee
{
    public function __construct(private PDO $db) {}

    public function paginate(int $page = 1, int $limit = 10, ?string $q = null): array
    {
        $offset = ($page - 1) * $limit;
        $where = '';
        $params = [];
        if ($q !== null && $q !== '') {
            $where = 'WHERE nombre LIKE :q OR correo LIKE :q OR cargo LIKE :q';
            $params[':q'] = '%' . $q . '%';
        }
        $stmt = $this->db->prepare("SELECT SQL_CALC_FOUND_ROWS * FROM empleados $where ORDER BY id DESC LIMIT :limit OFFSET :offset");
        foreach ($params as $k => $v) $stmt->bindValue($k, $v);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll();
        $total = (int)$this->db->query('SELECT FOUND_ROWS()')->fetchColumn();
        return [
            'items' => $items,
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
        ];
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM empleados WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare('INSERT INTO empleados (nombre, correo, cargo, fecha_ingreso) VALUES (:nombre, :correo, :cargo, :fecha_ingreso)');
        $stmt->execute([
            ':nombre' => $data['nombre'],
            ':correo' => $data['correo'],
            ':cargo' => $data['cargo'],
            ':fecha_ingreso' => $data['fecha_ingreso'] ?? date('Y-m-d'),
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->db->prepare('UPDATE empleados SET nombre=:nombre, correo=:correo, cargo=:cargo, fecha_ingreso=:fecha_ingreso WHERE id=:id');
        return $stmt->execute([
            ':nombre' => $data['nombre'],
            ':correo' => $data['correo'],
            ':cargo' => $data['cargo'],
            ':fecha_ingreso' => $data['fecha_ingreso'] ?? date('Y-m-d'),
            ':id' => $id,
        ]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM empleados WHERE id = :id');
        return $stmt->execute([':id' => $id]);
    }
}

