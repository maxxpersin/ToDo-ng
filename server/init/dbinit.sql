--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

-- Started on 2020-04-02 15:17:15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 202 (class 1259 OID 16396)
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    "SessionId" text NOT NULL,
    "Expiration" date,
    "UserId" text
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16404)
-- Name: ToDoItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ToDoItem" (
    "ItemId" text NOT NULL,
    "Description" text,
    "Title" text,
    "Date" date,
    "UserId" text
);


ALTER TABLE public."ToDoItem" OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16412)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    "UserId" text NOT NULL,
    "FirstName" text,
    "LastName" text,
    "Password" text,
    "Email" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 2697 (class 2606 OID 16403)
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("SessionId");


--
-- TOC entry 2699 (class 2606 OID 16411)
-- Name: ToDoItem ToDoItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ToDoItem"
    ADD CONSTRAINT "ToDoItem_pkey" PRIMARY KEY ("ItemId");


--
-- TOC entry 2701 (class 2606 OID 16419)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("UserId");


-- Completed on 2020-04-02 15:17:15

--
-- PostgreSQL database dump complete
--

