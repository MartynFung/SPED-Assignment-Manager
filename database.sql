-- This is just a paste bin for SQL commands. None of these scripts are actively used

CREATE DATABASE todo_database;

-- \c todo_database

CREATE TABLE todo
(
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(255)
);

CREATE TABLE users
(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    UNIQUE (email)
);


INSERT INTO users
    (name, email, password)
VALUES
    ('John', 'john@mail.com', 'pass');

