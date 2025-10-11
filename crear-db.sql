-- Script para crear la base de datos EXMC
-- Ejecutar este script en SQL Shell (psql) o pgAdmin

-- Crear la base de datos
CREATE DATABASE exmc_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Mensaje de confirmación
\echo 'Base de datos exmc_db creada exitosamente!'
\echo ''
\echo 'Ahora puedes ejecutar: .\instalar.bat'
