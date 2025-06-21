# Entorno de Kafka con SFTP y Kafka Connect

Este proyecto configura un entorno local de desarrollo para procesar archivos CSV desde un servidor SFTP utilizando Apache Kafka y Kafka Connect. La configuración imita un entorno productivo con una arquitectura escalable.

## Estructura del Proyecto

```
📂 /kafka_process_files_1
 |
 ├── 📂 server_kafka
 |   |
 │   ├── 📂 broker1     # Volumen para almacenar datos de Kafka
 │   ├── 📂 broker2     # Volumen para almacenar datos de Kafka
 │   ├── 📂 zookeeper   # Volumen para datos de Zookeeper
 |
 ├── 📂 server_sftp
 |   |               
 │   ├── 📂 pry_terminals
 |   |    |
 │   |    ├── 📂 1_unprocessed  # Archivos CSV de entrada
 │   |    ├── 📂 2_processed  # Archivos procesados
 │   |    ├── 📂 error          # Archivos con errores
 |
 ├── 📂 server_kafka_connect
 |   |
 │   ├── 📂 config        # Configuración del conector
 │   ├── 📂 connectors    # Plugins de conectores
 │   ├── 📂 errors        # Errores
 |
 ├── app.yaml       # Configuración principal de Docker Compose
 ├── setup.sh            # Script de inicialización
 ├── sample.csv          # Archivo CSV de ejemplo
```

## Componentes

1. **Zookeeper**: Necesario para la gestión de Kafka
2. **Kafka Broker**: Broker de Apache Kafka con configuración de una partición
3. **Servidor SFTP**: Servidor ligero para el intercambio de archivos
4. **Kafka Connect**: Para conectar Kafka con fuentes externas (SFTP)
5. **Schema Registry**: Para gestionar esquemas (opcional)
6. **Kafka UI**: Interfaz web para monitorizar Kafka

## Requisitos Previos

- Docker y Docker Compose
- Permisos para ejecutar scripts bash

## Configuración Inicial

1. Clona este repositorio
2. Ejecuta el script de configuración:

```bash
chmod +x setup.sh
./setup.sh
```

Este script:
- Crea los directorios necesarios
- Establece los permisos adecuados
- Inicia los servicios Docker
- Crea el tópico Kafka
- Registra el conector SFTP-CSV

## Uso del Entorno

### Colocar Archivos CSV para Procesamiento

1. Coloca tus archivos CSV en la carpeta `server_sftp/pry_terminals/1_unprocessed`
2. Alternativamente, conéctate via SFTP:
   - Host: localhost
   - Puerto: 2222
   - Usuario: sftp_user
   - Contraseña: sftp_password
   - Ruta: `/pry_terminals/1_unprocessed`

### Verificar el Procesamiento

1. Los archivos procesados se moverán a `server_sftp/pry_terminals/2_unprocessed`
2. Los registros se enviarán al tópico `csv-to-row-topic`
3. Puedes verificar los mensajes usando Kafka UI: http://localhost:8080

### Monitoreo

- **Kafka UI**: http://localhost:8080
- **Kafka Connect REST API**: http://localhost:8083
- **Schema Registry**: http://localhost:8081

## Escalabilidad

Este entorno está preparado para ser escalado:

- Para añadir un segundo broker, descomentar la sección correspondiente en `app-stack.yml`
- Actualizar `KAFKA_REPLICATION_FACTOR` y otras configuraciones relacionadas

## Troubleshooting

Si encuentras problemas:

1. Verifica los logs de los contenedores:
   ```bash
   docker logs kafka-connect
   ```

2. Comprueba el estado del conector:
   ```bash
   curl http://localhost:8083/connectors/sftp-source-csv-connector/status
   ```

3. Reinicia un servicio específico:
   ```bash
   docker-compose -f app-stack.yml restart kafka-connect
   ```

## Limpieza

Para detener y eliminar todos los servicios:

```bash
docker-compose -f app-stack.yml down
```

Para eliminar también los volúmenes:

```bash
docker-compose -f app-stack.yml down -v
```