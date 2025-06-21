##

```env
$ docker compose -f app-stack.yml up -d
```

```env
$ docker compose -f app-stack.yml down
```

```env
$ docker compose -f app-stack.yml logs
```

```env
$ docker compose -f app-stack.yml logs
```

```env
$ docker compose -f app-stack.yml restart kafka-connect
```

```env
$ docker compose -f app-stack.yml logs kafka-connect
```

```env
$ docker exec kafka-broker-1 kafka-topics --create --topic csv-to-row-topic \
  --bootstrap-server kafka-broker-1:29092 \
  --partitions 1 \
  --replication-factor 1 \
  --if-not-exists
```

```env
$ docker exec kafka-broker-1 kafka-topics --create --topic csv-to-row-topic --bootstrap-server kafka-broker-1:29092 --partitions 1 --replication-factor 1 --if-not-exists
```

Verificar la estructura de carpetas de un directorio:

```env
$ ls -la /home/sftp_user/pry_terminals
```

```env
$ docker exec kafka-broker-1 kafka-topics --describe --bootstrap-server localhost:9092 --topic csv-to-row-topic
```

```env
$ docker exec -it kafka-broker-1 kafka-console-consumer --bootstrap-server localhost:9092 --topic csv-to-row-topic --from-beginning --timeout-ms 2000
```