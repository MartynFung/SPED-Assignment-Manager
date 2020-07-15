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

CREATE TABLE user_base
(
    user_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v1(),
    email VARCHAR(128) NOT NULL,
    passwordHash VARCHAR(128) NOT NULL,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    role UUID NOT NULL,
    created_date DATE DEFAULT(NOW()) NOT NULL,
    UNIQUE (email)
)

CREATE TABLE app_role
(
    app_role_id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v1(),
    role_name VARCHAR(50) NOT NULL,
    role_description VARCHAR(100) NULL,
    is_active BOOLEAN NOT NULL
)