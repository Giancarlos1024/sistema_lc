CREATE DATABASE sistema_lc;

USE sistema_lc;

CREATE TABLE usuarios(
	id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(20) NOT NULL,
    contrasena VARCHAR(20) NOT NULL
);

INSERT INTO usuarios(usuario, contrasena)
VALUES('Admin','AB2024S*x');

INSERT INTO usuarios(usuario, contrasena)
VALUES('Fernando10','Fernando*x10');

SELECT * FROM usuarios;
SELECT * FROM factura_general;
SELECT * FROM factura_resumen;


CREATE TABLE factura_general (
    id INT AUTO_INCREMENT PRIMARY KEY,
    oficina VARCHAR(50) NULL,
    factura VARCHAR(50) NULL,
    liquidacion VARCHAR(50) NULL,
    fecha DATE NOT NULL,
    mes VARCHAR(50) NULL,
    poliza VARCHAR(50) NULL,
    recibo VARCHAR(50) NULL,
    cia_compania VARCHAR(100) NULL,
    cod_ramo VARCHAR(50) NULL,
    ramo_sbs VARCHAR(100) NULL,
    ramo_cia VARCHAR(100) NULL,
    asegurado VARCHAR(200) NULL,
    prima_dol DECIMAL(10, 2) NULL,
    com_dol DECIMAL(10, 2) NULL,
    prima_soles DECIMAL(10, 2) NULL,
    com_soles DECIMAL(10, 2) NULL,
    usuarioLogin VARCHAR(50) NULL,
    fechaModificacion  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER actualizar_fechaModificacion
BEFORE UPDATE ON factura_general
FOR EACH ROW
BEGIN
    SET NEW.fechaModificacion = CURRENT_TIMESTAMP;
END $$

DELIMITER ;

DELIMITER //

CREATE TRIGGER after_factura_general_insert
AFTER INSERT ON factura_general
FOR EACH ROW
BEGIN
    DECLARE v_mes VARCHAR(20);
    DECLARE v_anio INT;

    SET v_mes = CASE MONTH(NEW.fecha)
        WHEN 1 THEN 'Enero'
        WHEN 2 THEN 'Febrero'
        WHEN 3 THEN 'Marzo'
        WHEN 4 THEN 'Abril'
        WHEN 5 THEN 'Mayo'
        WHEN 6 THEN 'Junio'
        WHEN 7 THEN 'Julio'
        WHEN 8 THEN 'Agosto'
        WHEN 9 THEN 'Septiembre'
        WHEN 10 THEN 'Octubre'
        WHEN 11 THEN 'Noviembre'
        WHEN 12 THEN 'Diciembre'
    END;

    SET v_anio = YEAR(NEW.fecha);

    IF EXISTS (SELECT 1 FROM factura_resumen WHERE factura = NEW.factura AND YEAR(fecha) = v_anio) THEN
        UPDATE factura_resumen
        SET dolares = dolares + NEW.com_dol,
            soles = soles + NEW.com_soles,
            fecha = NEW.fecha,
            mes = v_mes,
            cia_seguros = NEW.cia_compania
        WHERE factura = NEW.factura AND YEAR(fecha) = v_anio;
    ELSE
        INSERT INTO factura_resumen (fecha, mes, factura, cia_seguros, dolares, soles)
        VALUES (NEW.fecha, v_mes, NEW.factura, NEW.cia_compania, NEW.com_dol, NEW.com_soles);
    END IF;
END //

CREATE TRIGGER after_factura_general_update
AFTER UPDATE ON factura_general
FOR EACH ROW
BEGIN
    DECLARE v_mes VARCHAR(20);
    DECLARE v_anio INT;

    SET v_mes = CASE MONTH(NEW.fecha)
        WHEN 1 THEN 'Enero'
        WHEN 2 THEN 'Febrero'
        WHEN 3 THEN 'Marzo'
        WHEN 4 THEN 'Abril'
        WHEN 5 THEN 'Mayo'
        WHEN 6 THEN 'Junio'
        WHEN 7 THEN 'Julio'
        WHEN 8 THEN 'Agosto'
        WHEN 9 THEN 'Septiembre'
        WHEN 10 THEN 'Octubre'
        WHEN 11 THEN 'Noviembre'
        WHEN 12 THEN 'Diciembre'
    END;

    SET v_anio = YEAR(NEW.fecha);

    IF EXISTS (SELECT 1 FROM factura_resumen WHERE factura = OLD.factura AND YEAR(fecha) = v_anio) THEN
        UPDATE factura_resumen
        SET dolares = dolares - OLD.com_dol + NEW.com_dol,
            soles = soles - OLD.com_soles + NEW.com_soles,
            fecha = NEW.fecha,
            mes = v_mes,
            cia_seguros = NEW.cia_compania
        WHERE factura = OLD.factura AND YEAR(fecha) = v_anio;
    ELSE
        INSERT INTO factura_resumen (fecha, mes, factura, cia_seguros, dolares, soles)
        VALUES (NEW.fecha, v_mes, NEW.factura, NEW.cia_compania, NEW.com_dol, NEW.com_soles);
    END IF;
END //

CREATE TRIGGER after_factura_general_delete
AFTER DELETE ON factura_general
FOR EACH ROW
BEGIN
    DECLARE v_anio INT;

    SET v_anio = YEAR(OLD.fecha);

    IF EXISTS (SELECT 1 FROM factura_resumen WHERE factura = OLD.factura AND YEAR(fecha) = v_anio) THEN
        UPDATE factura_resumen
        SET dolares = dolares - OLD.com_dol,
            soles = soles - OLD.com_soles
        WHERE factura = OLD.factura AND YEAR(fecha) = v_anio;

        DELETE FROM factura_resumen
        WHERE factura = OLD.factura AND YEAR(fecha) = v_anio AND dolares = 0 AND soles = 0;
    END IF;
END //

DELIMITER ;


-- Puedes agregar más conjuntos de valores si necesitas insertar más datos
CREATE TABLE factura_resumen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    mes VARCHAR(20) NOT NULL,
    factura VARCHAR(50) NOT NULL,
    cia_seguros VARCHAR(200) NOT NULL,
    dolares DECIMAL(10, 2) NULL,
    soles DECIMAL(10, 2) NULL
);