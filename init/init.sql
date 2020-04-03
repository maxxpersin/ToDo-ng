Database: todo

--DROP DATABASE todo;

CREATE DATABASE todo
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

SCHEMA: public

DROP SCHEMA public ;

CREATE SCHEMA public
    AUTHORIZATION postgres;

COMMENT ON SCHEMA public
    IS 'standard public schema';

GRANT ALL ON SCHEMA public TO PUBLIC;

GRANT ALL ON SCHEMA public TO postgres;

Table: public."Session"

DROP TABLE public."Session";

CREATE TABLE public."Session"
(
    "SessionId" text COLLATE pg_catalog."default" NOT NULL,
    "Expiration" date,
    "UserId" text COLLATE pg_catalog."default",
    CONSTRAINT "Session_pkey" PRIMARY KEY ("SessionId")
)

TABLESPACE pg_default;

ALTER TABLE public."Session"
    OWNER to postgres;

Table: public."ToDoItem"

DROP TABLE public."ToDoItem";

CREATE TABLE public."ToDoItem"
(
    "ItemId" text COLLATE pg_catalog."default" NOT NULL,
    "Description" text COLLATE pg_catalog."default",
    "Title" text COLLATE pg_catalog."default",
    "Date" date,
    "UserId" text COLLATE pg_catalog."default",
    CONSTRAINT "ToDoItem_pkey" PRIMARY KEY ("ItemId")
)

TABLESPACE pg_default;

ALTER TABLE public."ToDoItem"
    OWNER to postgres;

Table: public."User"

DROP TABLE public."User";

CREATE TABLE public."User"
(
    "UserId" text COLLATE pg_catalog."default" NOT NULL,
    "FirstName" text COLLATE pg_catalog."default",
    "LastName" text COLLATE pg_catalog."default",
    "Password" text COLLATE pg_catalog."default",
    "Email" text COLLATE pg_catalog."default",
    CONSTRAINT "User_pkey" PRIMARY KEY ("UserId")
)

TABLESPACE pg_default;

ALTER TABLE public."User"
    OWNER to postgres;