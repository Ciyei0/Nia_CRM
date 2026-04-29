#!/bin/bash

# Configuración
BACKUP_DIR="/root/backups/nia_crm"
CONTAINER_NAME="nia_crm_db"
DB_USER="whaticket_user"
DB_NAME="whaticketsaas"
DATE=$(date +%Y-%m-%d_%H%M%S)
RETENTION_DAYS=7

# Crear directorio de backup si no existe
mkdir -p $BACKUP_DIR

# Nombre del archivo
FILE_NAME="$BACKUP_DIR/backup_${DB_NAME}_$DATE.sql"

echo "Iniciando backup de la base de datos $DB_NAME..."

# Ejecutar pg_dump dentro del contenedor
docker exec $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > $FILE_NAME

# Comprimir el backup
gzip $FILE_NAME

echo "Backup completado: ${FILE_NAME}.gz"

# Limpieza: Borrar backups más antiguos que $RETENTION_DAYS
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Limpieza de backups antiguos completada."
