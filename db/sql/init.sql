CREATE DATABASE IF NOT EXISTS guild;
USE guild;

CREATE TABLE IF NOT EXISTS user (
  `public_key`            TEXT
  `name`                  TEXT
  `icon`                  TEXT
  `created`               DATETIME
)

CREATE TABLE IF NOT EXISTS quest (
  `transaction_hash`      TEXT,
  `title`                 TEXT,
  `description`           TEXT,
  `reward`                INT,
  `requester_public_key`  TEXT,
  `worker_public_key`     TEXT,
  `status`                TEXT,
  `created`               DATETIME
)



