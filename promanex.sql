--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5
-- Dumped by pg_dump version 11.5

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

SET default_with_oids = false;

--
-- Name: board; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.board (
    id integer NOT NULL,
    title text
);


--
-- Name: board_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.board ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.board_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: card; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.card (
    id integer NOT NULL,
    board_id integer,
    title text,
    status_id integer,
    "order" integer
);


--
-- Name: card_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.card ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.card_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: promantarbackup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promantarbackup (
    c1 text
);


--
-- Name: status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.status (
    id integer NOT NULL,
    title text
);


--
-- Data for Name: board; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.board (id, title) FROM stdin;
42	lofasz2
45	asdfasdf
46	adfasd
47	sadfasdf
\.


--
-- Data for Name: card; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.card (id, board_id, title, status_id, "order") FROM stdin;
27	42	uj kartya	0	\N
28	42	uj kartya 2	1	\N
29	42	uj kartya 3	2	\N
30	42	uj kartya 4	3	\N
31	42	dhtdfgh	1	\N
32	42	fdsgfdsg	0	\N
39	46	asdfasdf	0	\N
41	46	afdsa	1	\N
42	42	kj	3	1
\.


--
-- Data for Name: promantarbackup; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promantarbackup (c1) FROM stdin;
    id integer NOT NULL,
    title text
);
    SEQUENCE NAME public.board_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
    id integer NOT NULL,
    board_id integer,
    title text,
    status_id integer,
    "order" integer
);
    SEQUENCE NAME public.card_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
    id integer NOT NULL,
    title text
);
    ADD CONSTRAINT board_pkey PRIMARY KEY (id);
    ADD CONSTRAINT card_pkey PRIMARY KEY (id);
    ADD CONSTRAINT status_pkey PRIMARY KEY (id);
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES public.board(id) ON DELETE CASCADE;
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES public.status(id) NOT VALID;
\N
\N
\N
\N
\\.
\N
\N
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--
\N
-- Dumped from database version 11.5 (Ubuntu 11.5-1.pgdg18.04+1)
-- Dumped by pg_dump version 11.5 (Ubuntu 11.5-1.pgdg18.04+1)
\N
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
\N
DROP DATABASE proman;
--
-- Name: proman; Type: DATABASE; Schema: -; Owner: postgres
--
\N
CREATE DATABASE proman WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';
\N
\N
ALTER DATABASE proman OWNER TO postgres;
\N
\\connect proman
\N
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
\N
SET default_tablespace = '';
\N
SET default_with_oids = false;
\N
--
-- Name: board; Type: TABLE; Schema: public; Owner: postgres
--
\N
CREATE TABLE public.board (
    id integer NOT NULL,
    title text
);
\N
\N
ALTER TABLE public.board OWNER TO postgres;
\N
--
-- Name: board_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
\N
ALTER TABLE public.board ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.board_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
\N
\N
--
-- Name: card; Type: TABLE; Schema: public; Owner: postgres
--
\N
CREATE TABLE public.card (
    id integer NOT NULL,
    board_id integer,
    title text,
    status_id integer,
    "order" integer
);
\N
\N
ALTER TABLE public.card OWNER TO postgres;
\N
--
-- Name: card_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
\N
ALTER TABLE public.card ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.card_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
\N
\N
--
-- Name: status; Type: TABLE; Schema: public; Owner: postgres
--
\N
CREATE TABLE public.status (
    id integer NOT NULL,
    title text
);
\N
\N
ALTER TABLE public.status OWNER TO postgres;
\N
--
-- Data for Name: board; Type: TABLE DATA; Schema: public; Owner: postgres
--
\N
COPY public.board (id, title) FROM stdin;
\\.
COPY public.board (id, title) FROM '$$PATH$$/2944.dat';
\N
--
-- Data for Name: card; Type: TABLE DATA; Schema: public; Owner: postgres
--
\N
COPY public.card (id, board_id, title, status_id, "order") FROM stdin;
\\.
COPY public.card (id, board_id, title, status_id, "order") FROM '$$PATH$$/2946.dat';
\N
--
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: postgres
--
\N
COPY public.status (id, title) FROM stdin;
\\.
COPY public.status (id, title) FROM '$$PATH$$/2947.dat';
\N
--
-- Name: board_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
\N
SELECT pg_catalog.setval('public.board_id_seq', 1, false);
\N
\N
--
-- Name: card_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
\N
SELECT pg_catalog.setval('public.card_id_seq', 1, false);
\N
\N
--
-- Name: board board_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.board
    ADD CONSTRAINT board_pkey PRIMARY KEY (id);
\N
\N
--
-- Name: card card_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_pkey PRIMARY KEY (id);
\N
\N
--
-- Name: status status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pkey PRIMARY KEY (id);
\N
\N
--
-- Name: card fk_board_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.card
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES public.board(id) ON DELETE CASCADE;
\N
\N
--
-- Name: card fk_status_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
\N
ALTER TABLE ONLY public.card
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES public.status(id) NOT VALID;
\N
\N
--
-- PostgreSQL database dump complete
--
\N
\.


--
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.status (id, title) FROM stdin;
0	new
1	in progress
2	testing
3	done
\.


--
-- Name: board_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.board_id_seq', 47, true);


--
-- Name: card_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.card_id_seq', 42, true);


--
-- Name: board board_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.board
    ADD CONSTRAINT board_pkey PRIMARY KEY (id);


--
-- Name: card card_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_pkey PRIMARY KEY (id);


--
-- Name: status status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pkey PRIMARY KEY (id);


--
-- Name: card fk_board_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES public.board(id) ON DELETE CASCADE;


--
-- Name: card fk_status_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES public.status(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

