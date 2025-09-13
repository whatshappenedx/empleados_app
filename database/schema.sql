-- Schema for empleados and familiares_directos
CREATE TABLE IF NOT EXISTS empleados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) NOT NULL,
  cargo VARCHAR(255) NOT NULL,
  fecha_ingreso DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS familiares_directos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_empleado INT NOT NULL,
  nombre_familiar VARCHAR(255) NOT NULL,
  parentesco VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE NULL,
  CONSTRAINT fk_familia_empleado FOREIGN KEY (id_empleado) REFERENCES empleados(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Simple seed
INSERT INTO empleados (nombre, correo, cargo, fecha_ingreso) VALUES
('Ana Pérez', 'ana.perez@example.com', 'Desarrolladora', '2023-05-01'),
('Luis Gómez', 'luis.gomez@example.com', 'Analista', '2022-09-15');

INSERT INTO familiares_directos (id_empleado, nombre_familiar, parentesco, fecha_nacimiento) VALUES
(1, 'María Pérez', 'Hija', '2015-03-10'),
(1, 'Carlos Pérez', 'Esposo', '1988-07-22'),
(2, 'Jorge Gómez', 'Padre', '1960-11-05');

