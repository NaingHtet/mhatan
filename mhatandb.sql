--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: adddefaultuser(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION adddefaultuser() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
IF NOT EXISTS(SELECT * FROM users WHERE user_id = 0) THEN
INSERT INTO users("user_id","email","password") VALUES(0,'default','default');
END IF;
END;
$$;


ALTER FUNCTION public.adddefaultuser() OWNER TO postgres;

--
-- Name: setcommentdefaults(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION setcommentdefaults() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
IF (NEW.comment_Id IS NULL) THEN
NEW.comment_Id := (SELECT MAX(comment_id) FROM COMMENT) + 1;
END IF;
IF (NEW.user_Id IS NULL) THEN
NEW.user_Id := 0;
END IF;
IF (NEW.object_id IS NULL) THEN
NEW.object_id := 0;
END IF;
If (NEW.object_type IS NULL) THEN
NEW.object_type := 'E';
END IF;
IF (NEW.time_created IS NULL) THEN
NEW.time_created := 'NOW';
END IF;
RETURN NEW;
END;
$$;


ALTER FUNCTION public.setcommentdefaults() OWNER TO postgres;

--
-- Name: setdiarydefaults(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION setdiarydefaults() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
IF (NEW.diary_Id IS NULL) THEN
NEW.diary_Id := (SELECT MAX(diary_id) FROM DIARY) + 1;
END IF;
IF (NEW.user_Id IS NULL) THEN
NEW.user_Id := 0;
END IF;
IF (NEW.category IS NULL) THEN
NEW.category := 'General';
END IF;
If (NEW.permissions IS NULL) THEN
NEW.permissions := 'Private';
END IF;
If (NEW.display_order IS NULL) THEN
NEW.display_order := (SELECT COUNT(*) FROM DIARY WHERE (user_id =   NEW.user_id)) + 1;
END IF;
IF (NEW.time_created IS NULL) THEN
NEW.time_created := 'NOW';
END IF;
IF (NEW.last_time_edited IS NULL) THEN
NEW.last_time_edited := 'NOW';
END IF;
RETURN NEW;
END;
$$;


ALTER FUNCTION public.setdiarydefaults() OWNER TO postgres;

--
-- Name: setembedsdefaults(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION setembedsdefaults() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
If (NEW.media_order IS NULL) THEN
NEW.media_order := (SELECT COUNT(*) FROM EMBEDS WHERE (entry_id =   NEW.entry_id)) + 1;
END IF;

RETURN NEW;
END;
$$;


ALTER FUNCTION public.setembedsdefaults() OWNER TO postgres;

--
-- Name: setentrydefaults(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION setentrydefaults() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
IF (NEW.entry_Id IS NULL) THEN
NEW.entry_Id := (SELECT MAX(entry_id) FROM ENTRIES) + 1;
END IF;
IF (NEW.user_Id IS NULL) THEN
NEW.user_Id := 0;
END IF;
IF (NEW.entry_type IS NULL) THEN
NEW.entry_type := 'T';
END IF;
IF (NEW.entry_time IS NULL) THEN
NEW.entry_time := 'NOW';
END IF;
IF (NEW.time_posted IS NULL) THEN
NEW.time_posted := 'NOW';
END IF;
IF (NEW.last_time_edited IS NULL) THEN
NEW.last_time_edited := 'NOW';
END IF;
RETURN NEW;
END;
$$;


ALTER FUNCTION public.setentrydefaults() OWNER TO postgres;

--
-- Name: setfollowsdefaults(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION setfollowsdefaults() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
IF (NEW.request_status IS NULL) THEN
NEW.request_status := 'P';
END IF;
IF (NEW.message IS NULL) THEN
NEW.message := (SELECT pen_name FROM users WHERE NEW.follower_id = user_id) || ' requests permission to follow you.';
END IF;

RETURN NEW;
END;
$$;


ALTER FUNCTION public.setfollowsdefaults() OWNER TO postgres;

--
-- Name: setmediafiledefaults(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION setmediafiledefaults() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
IF (NEW.media_Id IS NULL) THEN
NEW.media_Id := (SELECT MAX(media_id) FROM MEDIA_FILE) + 1;
END IF;
IF (NEW.user_Id IS NULL) THEN
NEW.user_Id := 0;
END IF;
IF (NEW.media_file_url IS NULL) THEN
NEW.media_file_url := 'http://www.b2match.com/assets/fallback/default.png';
END IF;
IF (NEW.media_file_filename IS NULL) THEN
NEW.media_file_filename := 'default.jpg';
END IF;
If (NEW.media_type IS NULL) THEN
NEW.media_type := 'P';
END IF;
IF (NEW.time_added IS NULL) THEN
NEW.time_added := 'NOW';
END IF;
RETURN NEW;
END;
$$;


ALTER FUNCTION public.setmediafiledefaults() OWNER TO postgres;

--
-- Name: setuserdefaults(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION setuserdefaults() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
IF (NEW.user_Id IS NULL) THEN
NEW.user_Id := (SELECT MAX(user_id) FROM USERS) + 1;
END IF;
IF (NEW.profile_pic_id IS NULL) THEN
NEW.profile_pic_Id := 0;
END IF;
IF (NEW.member_level IS NULL) THEN
NEW.member_level := 1;
END IF;
IF (NEW.pen_name IS NULL) THEN
NEW.pen_name := 'Anonymous' || NEW.user_Id;
END IF;
IF (NEW.time_joined IS NULL) THEN
NEW.time_joined := 'NOW';
END IF;
IF (NEW.time_updated IS NULL) THEN
NEW.time_updated := 'NOW';
END IF;
IF ((SELECT COUNT(*) FROM media_file WHERE media_id = 0) < 1) THEN
INSERT INTO media_file VALUES(0,'/default_pic/','default_pic.jpg',0,'P','NOW');
END IF;
RETURN NEW;
END;
$$;


ALTER FUNCTION public.setuserdefaults() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE comment (
    comment_id integer NOT NULL,
    user_id integer,
    object_id integer,
    object_type character(1),
    text_content character varying(1000),
    time_created timestamp without time zone,
    CONSTRAINT comment_object_type_check CHECK (((object_type = 'E'::bpchar) OR (object_type = 'D'::bpchar)))
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- Name: contains; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE contains (
    diary_id integer NOT NULL,
    entry_id integer NOT NULL
);


ALTER TABLE public.contains OWNER TO postgres;

--
-- Name: diary; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE diary (
    diary_id integer NOT NULL,
    user_id integer,
    diary_name character varying(30),
    description character varying(1000),
    category character varying(20),
    display_order integer,
    permissions character(8),
    time_created timestamp without time zone,
    last_time_edited timestamp without time zone,
    url text,
    CONSTRAINT diary_permissions_check CHECK ((((permissions = 'Public'::bpchar) OR (permissions = 'Private'::bpchar)) OR (permissions = 'Follower'::bpchar)))
);


ALTER TABLE public.diary OWNER TO postgres;

--
-- Name: entries; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE entries (
    entry_id integer NOT NULL,
    user_id integer NOT NULL,
    entry_type character(1),
    text_content character varying(2000),
    title character varying(100),
    entry_time timestamp without time zone,
    time_posted timestamp without time zone,
    last_time_edited timestamp without time zone,
    diary_id integer,
    CONSTRAINT entries_entry_type_check CHECK (((((entry_type = 'T'::bpchar) OR (entry_type = 'D'::bpchar)) OR (entry_type = 'M'::bpchar)) OR (entry_type = 'Y'::bpchar)))
);


ALTER TABLE public.entries OWNER TO postgres;

--
-- Name: datingentries; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW datingentries AS
    SELECT DISTINCT entries.user_id, diary.diary_id, entries.entry_id, entries.entry_time FROM entries, diary, contains WHERE (((((diary.category)::text = 'Dating'::text) AND (contains.diary_id = diary.diary_id)) AND (entries.entry_id = contains.entry_id)) AND (entries.user_id = diary.user_id)) ORDER BY diary.diary_id, entries.entry_time, entries.entry_id;


ALTER TABLE public.datingentries OWNER TO postgres;

--
-- Name: embeds; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE embeds (
    entry_id integer NOT NULL,
    media_id integer NOT NULL,
    media_order integer NOT NULL
);


ALTER TABLE public.embeds OWNER TO postgres;

--
-- Name: followerentries; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW followerentries AS
    SELECT DISTINCT entries.user_id, diary.diary_id, entries.entry_id, entries.entry_time FROM entries, diary, contains WHERE ((((diary.permissions = 'Follower'::bpchar) AND (contains.diary_id = diary.diary_id)) AND (entries.entry_id = contains.entry_id)) AND (entries.user_id = diary.user_id)) ORDER BY diary.diary_id, entries.entry_time, entries.entry_id;


ALTER TABLE public.followerentries OWNER TO postgres;

--
-- Name: follows; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE follows (
    writer_id integer NOT NULL,
    follower_id integer NOT NULL,
    request_status character(1),
    message character varying(1000),
    CONSTRAINT follows_request_status_check CHECK ((((request_status = 'P'::bpchar) OR (request_status = 'A'::bpchar)) OR (request_status = 'R'::bpchar)))
);


ALTER TABLE public.follows OWNER TO postgres;

--
-- Name: generalentries; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW generalentries AS
    SELECT DISTINCT entries.user_id, diary.diary_id, entries.entry_id, entries.entry_time FROM entries, diary, contains WHERE (((((diary.category)::text = 'General'::text) AND (contains.diary_id = diary.diary_id)) AND (entries.entry_id = contains.entry_id)) AND (entries.user_id = diary.user_id)) ORDER BY diary.diary_id, entries.entry_time, entries.entry_id;


ALTER TABLE public.generalentries OWNER TO postgres;

--
-- Name: media_file; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE media_file (
    media_id integer NOT NULL,
    media_file_url character varying(1000),
    media_file_filename character varying(100),
    user_id integer,
    media_type character(1),
    time_added timestamp without time zone,
    CONSTRAINT media_file_media_type_check CHECK ((((media_type = 'P'::bpchar) OR (media_type = 'V'::bpchar)) OR (media_type = 'S'::bpchar)))
);


ALTER TABLE public.media_file OWNER TO postgres;

--
-- Name: musicentries; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW musicentries AS
    SELECT DISTINCT entries.user_id, diary.diary_id, entries.entry_id, entries.entry_time FROM entries, diary, contains WHERE (((((diary.category)::text = 'Music'::text) AND (contains.diary_id = diary.diary_id)) AND (entries.entry_id = contains.entry_id)) AND (entries.user_id = diary.user_id)) ORDER BY diary.diary_id, entries.entry_time, entries.entry_id;


ALTER TABLE public.musicentries OWNER TO postgres;

--
-- Name: otherentries; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW otherentries AS
    SELECT DISTINCT entries.user_id, diary.diary_id, entries.entry_id, entries.entry_time FROM entries, diary, contains WHERE (((((diary.category)::text = 'Other'::text) AND (contains.diary_id = diary.diary_id)) AND (entries.entry_id = contains.entry_id)) AND (entries.user_id = diary.user_id)) ORDER BY diary.diary_id, entries.entry_time, entries.entry_id;


ALTER TABLE public.otherentries OWNER TO postgres;

--
-- Name: personalentries; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW personalentries AS
    SELECT DISTINCT entries.user_id, diary.diary_id, entries.entry_id, entries.entry_time FROM entries, diary, contains WHERE (((((diary.category)::text = 'Personal'::text) AND (contains.diary_id = diary.diary_id)) AND (entries.entry_id = contains.entry_id)) AND (entries.user_id = diary.user_id)) ORDER BY diary.diary_id, entries.entry_time, entries.entry_id;


ALTER TABLE public.personalentries OWNER TO postgres;

--
-- Name: privateentries; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW privateentries AS
    SELECT DISTINCT entries.user_id, diary.diary_id, entries.entry_id, entries.entry_time FROM entries, diary, contains WHERE ((((diary.permissions = 'Private'::bpchar) AND (contains.diary_id = diary.diary_id)) AND (entries.entry_id = contains.entry_id)) AND (entries.user_id = diary.user_id)) ORDER BY diary.diary_id, entries.entry_time, entries.entry_id;


ALTER TABLE public.privateentries OWNER TO postgres;

--
-- Name: publicentries; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW publicentries AS
    SELECT DISTINCT entries.user_id, diary.diary_id, entries.entry_id, entries.entry_time FROM entries, diary, contains WHERE ((((diary.permissions = 'Public'::bpchar) AND (contains.diary_id = diary.diary_id)) AND (entries.entry_id = contains.entry_id)) AND (entries.user_id = diary.user_id)) ORDER BY diary.diary_id, entries.entry_time, entries.entry_id;


ALTER TABLE public.publicentries OWNER TO postgres;

--
-- Name: religionentries; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW religionentries AS
    SELECT DISTINCT entries.user_id, diary.diary_id, entries.entry_id, entries.entry_time FROM entries, diary, contains WHERE (((((diary.category)::text = 'Religion'::text) AND (contains.diary_id = diary.diary_id)) AND (entries.entry_id = contains.entry_id)) AND (entries.user_id = diary.user_id)) ORDER BY diary.diary_id, entries.entry_time, entries.entry_id;


ALTER TABLE public.religionentries OWNER TO postgres;

--
-- Name: schoolentries; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW schoolentries AS
    SELECT DISTINCT entries.user_id, diary.diary_id, entries.entry_id, entries.entry_time FROM entries, diary, contains WHERE (((((diary.category)::text = 'School'::text) AND (contains.diary_id = diary.diary_id)) AND (entries.entry_id = contains.entry_id)) AND (entries.user_id = diary.user_id)) ORDER BY diary.diary_id, entries.entry_time, entries.entry_id;


ALTER TABLE public.schoolentries OWNER TO postgres;

--
-- Name: sportsentries; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW sportsentries AS
    SELECT DISTINCT entries.user_id, diary.diary_id, entries.entry_id, entries.entry_time FROM entries, diary, contains WHERE (((((diary.category)::text = 'Sports'::text) AND (contains.diary_id = diary.diary_id)) AND (entries.entry_id = contains.entry_id)) AND (entries.user_id = diary.user_id)) ORDER BY diary.diary_id, entries.entry_time, entries.entry_id;


ALTER TABLE public.sportsentries OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE users (
    user_id integer NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(60) NOT NULL,
    pen_name character varying(40),
    member_level character(1),
    profile_pic_id integer,
    time_joined timestamp without time zone,
    time_updated timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: workentries; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW workentries AS
    SELECT DISTINCT entries.user_id, diary.diary_id, entries.entry_id, entries.entry_time FROM entries, diary, contains WHERE (((((diary.category)::text = 'Work'::text) AND (contains.diary_id = diary.diary_id)) AND (entries.entry_id = contains.entry_id)) AND (entries.user_id = diary.user_id)) ORDER BY diary.diary_id, entries.entry_time, entries.entry_id;


ALTER TABLE public.workentries OWNER TO postgres;

--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY comment (comment_id, user_id, object_id, object_type, text_content, time_created) FROM stdin;
\.


--
-- Data for Name: contains; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY contains (diary_id, entry_id) FROM stdin;
\.


--
-- Data for Name: diary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY diary (diary_id, user_id, diary_name, description, category, display_order, permissions, time_created, last_time_edited, url) FROM stdin;
3	3	asdfasd	asfdasfd	none	3	Private 	2013-01-27 15:30:52.386251	2013-01-27 15:30:52.386251	afdsas
4	3	Doomsday	This is about Doomsday!	none	2	Private 	2013-01-27 15:35:54.667747	2013-01-27 15:35:54.667747	doomsday
5	3	tasdfl	gasdasfd	none	3	Private 	2013-01-27 15:36:03.791089	2013-01-27 15:36:03.791089	asd asdfasd
\.


--
-- Data for Name: embeds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY embeds (entry_id, media_id, media_order) FROM stdin;
1	22	1
52	63	1
191	96	1
329	51	1
44	67	1
62	57	1
123	90	1
396	23	1
1	22	2
66	4	1
353	5	1
31	50	1
243	90	1
431	11	1
18	40	1
168	88	1
217	49	1
467	97	1
73	1	1
148	40	1
272	79	1
428	10	1
454	11	1
217	49	2
260	78	1
275	99	1
194	86	1
267	79	1
450	11	1
31	50	2
285	32	1
186	50	1
418	39	1
408	80	1
448	20	1
106	95	1
264	87	1
114	52	1
357	56	1
171	64	1
112	57	1
228	49	1
251	57	1
243	93	1
191	96	2
167	75	1
472	67	1
477	57	1
5	78	1
379	58	1
439	82	1
171	64	2
18	40	2
419	81	1
114	52	2
491	75	1
35	73	1
31	50	3
213	6	1
485	44	1
46	19	1
379	58	2
4	36	1
406	2	1
239	64	1
460	12	1
268	3	1
379	58	3
414	38	1
160	79	1
387	18	1
253	79	1
369	8	1
206	33	1
57	20	1
485	44	2
341	98	1
120	31	2
218	13	1
351	94	1
308	71	1
134	11	1
440	83	1
360	12	1
310	34	1
381	45	1
170	25	1
117	74	1
416	68	1
120	31	1
11	56	1
74	1	1
466	96	1
195	75	1
217	49	3
139	96	1
356	77	1
100	14	1
285	32	2
149	48	1
3	4	1
536	102	1
536	103	2
1	1	3
543	140	1
543	141	2
543	142	3
543	143	4
549	144	1
549	145	2
611	178	1
614	179	1
614	180	2
615	181	1
617	182	1
617	183	2
617	184	3
618	185	1
625	186	1
634	189	1
634	190	2
\.


--
-- Data for Name: entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY entries (entry_id, user_id, entry_type, text_content, title, entry_time, time_posted, last_time_edited, diary_id) FROM stdin;
1	3	D	This belongs to today	test1	2013-01-12 23:59:00	2013-01-12 09:31:50.329621	2013-01-12 09:31:50.329621	\N
\.


--
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY follows (writer_id, follower_id, request_status, message) FROM stdin;
35	78	A	nec tempus mauris erat eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin
11	19	R	sit amet ornare lectus justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec tellus. Nunc lectus
19	45	P	nisl. Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh vulputate
95	43	A	Pellentesque habitant morbi tristique senectus
42	64	A	Sed auctor odio a purus. Duis elementum, dui quis accumsan
82	68	A	sit amet ultricies sem magna nec quam. Curabitur vel lectus. Cum
70	50	P	pharetra. Nam ac nulla. In tincidunt congue turpis.
80	40	A	viverra. Donec tempus, lorem fringilla ornare placerat, orci lacus vestibulum lorem, sit amet ultricies sem magna nec quam. Curabitur
18	83	A	tempor diam dictum sapien. Aenean massa. Integer vitae nibh. Donec est mauris, rhoncus id, mollis nec, cursus a,
39	28	R	nec enim. Nunc ut erat. Sed nunc est, mollis non,
22	18	P	eu, odio. Phasellus at augue id
12	80	R	erat volutpat. Nulla facilisis. Suspendisse commodo tincidunt nibh. Phasellus
69	10	A	sem, vitae aliquam eros turpis non enim. Mauris quis turpis vitae purus gravida sagittis. Duis gravida.
53	92	R	porta elit, a feugiat tellus lorem eu metus. In lorem. Donec elementum,
77	84	A	quis accumsan convallis, ante lectus convallis est, vitae sodales nisi magna sed dui. Fusce
63	80	A	In scelerisque scelerisque dui. Suspendisse ac metus vitae
59	36	A	elementum, lorem ut aliquam iaculis, lacus pede sagittis augue, eu
13	2	P	sit amet ultricies sem magna nec quam. Curabitur vel lectus. Cum sociis natoque penatibus et magnis dis parturient
56	40	R	eu erat semper rutrum. Fusce
37	79	P	ut, nulla. Cras eu tellus eu augue porttitor interdum.
94	94	A	Aenean egestas hendrerit neque. In ornare sagittis felis. Donec tempor,
32	93	R	nulla at sem molestie sodales. Mauris blandit
70	31	A	arcu et pede. Nunc sed orci lobortis augue scelerisque mollis. Phasellus libero mauris, aliquam eu, accumsan
31	27	R	vitae sodales nisi magna sed dui. Fusce aliquam, enim nec tempus scelerisque, lorem ipsum sodales purus, in
94	16	A	ipsum cursus vestibulum. Mauris magna. Duis dignissim tempor arcu. Vestibulum ut eros non enim
25	56	A	netus et malesuada fames ac turpis egestas.
99	45	R	fermentum vel, mauris. Integer sem elit, pharetra ut, pharetra
99	100	P	odio, auctor vitae, aliquet nec, imperdiet nec, leo. Morbi neque tellus, imperdiet non, vestibulum nec,
21	94	A	erat semper rutrum. Fusce dolor quam, elementum at, egestas a, scelerisque sed, sapien. Nunc pulvinar arcu et pede.
13	77	P	imperdiet, erat nonummy ultricies ornare, elit elit fermentum risus, at fringilla purus mauris
95	82	A	urna, nec luctus felis purus ac tellus. Suspendisse sed
30	30	P	eu dolor egestas rhoncus. Proin nisl
5	11	P	Aliquam fringilla cursus purus. Nullam scelerisque neque sed sem
30	48	R	tincidunt dui augue eu tellus. Phasellus elit
58	25	R	ipsum. Suspendisse non leo. Vivamus nibh dolor, nonummy ac, feugiat non, lobortis quis, pede.
58	57	R	egestas. Fusce aliquet magna a
44	31	A	sit amet orci. Ut sagittis lobortis mauris. Suspendisse aliquet molestie tellus.
62	44	R	eu tempor erat neque non quam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames
71	4	A	adipiscing non, luctus sit amet, faucibus ut, nulla. Cras eu tellus eu augue porttitor
13	16	R	eget, volutpat ornare, facilisis eget, ipsum. Donec sollicitudin adipiscing ligula. Aenean gravida nunc sed pede. Cum sociis natoque penatibus
47	49	P	et risus. Quisque libero lacus, varius et, euismod et, commodo at,
30	87	A	enim. Etiam imperdiet dictum magna. Ut tincidunt orci
14	87	A	Nulla semper tellus id nunc interdum feugiat. Sed nec metus facilisis lorem tristique aliquet. Phasellus fermentum
57	43	R	volutpat. Nulla dignissim. Maecenas ornare egestas ligula. Nullam feugiat placerat velit. Quisque varius. Nam porttitor scelerisque neque. Nullam nisl.
35	6	A	faucibus ut, nulla. Cras eu tellus eu augue porttitor interdum. Sed auctor odio a
36	3	P	eleifend vitae, erat. Vivamus nisi. Mauris nulla. Integer urna.
14	55	P	egestas hendrerit neque. In ornare sagittis felis. Donec
93	34	R	Nullam ut nisi a odio
73	63	R	massa. Mauris vestibulum, neque sed dictum eleifend, nunc risus varius orci, in consequat
91	87	A	scelerisque mollis. Phasellus libero mauris, aliquam eu, accumsan sed, facilisis vitae, orci. Phasellus dapibus quam quis diam. Pellentesque habitant
90	26	A	ridiculus mus. Proin vel arcu eu odio tristique pharetra. Quisque ac libero
21	63	P	Integer tincidunt aliquam arcu. Aliquam ultrices iaculis odio. Nam interdum enim non nisi. Aenean eget metus. In nec orci. Donec
94	90	A	nec tempus scelerisque, lorem ipsum sodales purus, in molestie tortor nibh sit amet orci. Ut sagittis lobortis mauris.
37	58	A	eget tincidunt dui augue eu tellus.
30	1	R	Nullam feugiat placerat velit. Quisque varius. Nam porttitor scelerisque neque. Nullam nisl.
83	36	R	vitae nibh. Donec est mauris, rhoncus id, mollis
25	40	P	ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec tincidunt. Donec vitae erat vel pede
21	78	R	Ut sagittis lobortis mauris. Suspendisse aliquet
10	43	P	eros turpis non enim. Mauris quis turpis vitae purus
83	59	P	Duis cursus, diam at pretium aliquet, metus urna convallis erat,
70	20	P	gravida sagittis. Duis gravida. Praesent eu
48	35	A	aliquet. Proin velit. Sed malesuada augue ut lacus. Nulla tincidunt, neque vitae
98	68	A	amet diam eu dolor egestas rhoncus. Proin nisl sem,
9	39	A	nibh dolor, nonummy ac, feugiat non, lobortis quis, pede. Suspendisse dui. Fusce diam nunc,
29	41	A	et risus. Quisque libero lacus, varius et, euismod et, commodo at, libero. Morbi accumsan laoreet ipsum.
7	41	P	Phasellus in felis. Nulla tempor augue ac ipsum. Phasellus vitae mauris sit amet lorem semper auctor.
20	22	R	elit. Curabitur sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et
16	43	P	sed, hendrerit a, arcu. Sed
57	11	A	Maecenas mi felis, adipiscing fringilla, porttitor vulputate, posuere
18	54	R	facilisis vitae, orci. Phasellus dapibus quam quis diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
62	6	R	lobortis risus. In mi pede, nonummy
90	29	A	Nam nulla magna, malesuada vel,
43	20	P	lectus pede, ultrices a, auctor non, feugiat nec, diam. Duis mi enim, condimentum
7	9	A	venenatis lacus. Etiam bibendum fermentum metus. Aenean sed pede
36	50	A	a, aliquet vel, vulputate eu, odio. Phasellus at
76	82	P	mi enim, condimentum eget, volutpat ornare, facilisis eget, ipsum. Donec sollicitudin adipiscing ligula.
43	41	R	pede. Praesent eu dui. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eget
70	27	R	ullamcorper viverra. Maecenas iaculis aliquet diam. Sed diam lorem, auctor
30	44	R	consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat eget ipsum. Suspendisse sagittis. Nullam vitae diam. Proin
37	21	A	amet, faucibus ut, nulla. Cras eu tellus eu augue porttitor interdum. Sed auctor odio a purus. Duis elementum, dui
73	67	A	venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam laoreet, libero et tristique pellentesque, tellus sem
27	31	A	ac urna. Ut tincidunt vehicula risus. Nulla
52	85	P	magna. Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum metus. Aenean sed pede nec ante blandit viverra. Donec
73	12	P	vulputate, lacus. Cras interdum. Nunc sollicitudin commodo ipsum. Suspendisse non leo. Vivamus nibh dolor, nonummy ac, feugiat non,
93	19	P	netus et malesuada fames ac turpis egestas. Fusce aliquet magna a neque. Nullam ut nisi a
63	47	R	non ante bibendum ullamcorper. Duis cursus, diam at pretium aliquet, metus
69	69	R	et netus et malesuada fames ac turpis egestas. Fusce aliquet magna a neque.
91	8	P	in faucibus orci luctus et ultrices posuere cubilia Curae; Donec tincidunt.
87	16	R	lorem, sit amet ultricies sem magna nec quam. Curabitur vel
91	25	P	facilisis facilisis, magna tellus faucibus leo, in lobortis tellus justo sit
13	5	A	tellus. Aenean egestas hendrerit neque. In ornare sagittis felis. Donec tempor, est ac mattis semper, dui lectus rutrum urna, nec
48	63	P	In condimentum. Donec at arcu. Vestibulum ante ipsum primis in faucibus orci luctus
47	42	P	faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus ornare. Fusce mollis. Duis sit
10	48	R	aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu ac
62	34	P	quis, tristique ac, eleifend vitae, erat. Vivamus nisi. Mauris nulla. Integer
9	53	A	Pellentesque ultricies dignissim lacus. Aliquam rutrum lorem ac risus. Morbi metus.
65	86	R	lorem ipsum sodales purus, in molestie tortor nibh
55	71	P	tellus. Suspendisse sed dolor. Fusce mi
58	18	R	lectus, a sollicitudin orci sem eget
67	74	R	vitae nibh. Donec est mauris, rhoncus id, mollis
2	4	P	Irma M. Tyson requests permission to follow you.
\.


--
-- Data for Name: media_file; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY media_file (media_id, media_file_url, media_file_filename, user_id, media_type, time_added) FROM stdin;
0	/default_pic/	default_pic.jpg	0	P	2012-12-21 19:00:24.59842
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY users (user_id, email, password, pen_name, member_level, profile_pic_id, time_joined, time_updated) FROM stdin;
3	tester@tester.com	$2a$10$/Geh4w0CnrmTkcFB3/ykquUjkUXvztb8z7aZ/g87DSHhBvvcrGKhe	testerofdoom	1	0	2013-01-11 04:24:23.196291	2013-01-11 04:24:23.196291
4	tester2@tester.com	$2a$10$3fEAzI9ajoGYsZubl/wP4.cCpYtBZx4brKpswSK.boGwkUc5UNSb.	Tester 2 	1	0	2013-01-27 11:45:15.013691	2013-01-27 11:45:15.013691
\.


--
-- Name: comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (comment_id);


--
-- Name: contains_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY contains
    ADD CONSTRAINT contains_pkey PRIMARY KEY (diary_id, entry_id);


--
-- Name: diary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY diary
    ADD CONSTRAINT diary_pkey PRIMARY KEY (diary_id);


--
-- Name: embeds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY embeds
    ADD CONSTRAINT embeds_pkey PRIMARY KEY (entry_id, media_id, media_order);


--
-- Name: entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY entries
    ADD CONSTRAINT entries_pkey PRIMARY KEY (entry_id);


--
-- Name: follows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (writer_id, follower_id);


--
-- Name: media_file_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY media_file
    ADD CONSTRAINT media_file_pkey PRIMARY KEY (media_id);


--
-- Name: users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users_pen_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pen_name_key UNIQUE (pen_name);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: diary_category; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX diary_category ON diary USING btree (category);


--
-- Name: diary_permissions; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX diary_permissions ON diary USING btree (permissions);


--
-- Name: addentryindex; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER addentryindex BEFORE INSERT ON entries FOR EACH ROW EXECUTE PROCEDURE setentrydefaults();


--
-- Name: setcommentdefaults; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER setcommentdefaults BEFORE INSERT ON comment FOR EACH ROW EXECUTE PROCEDURE setcommentdefaults();


--
-- Name: setdiarydefaults; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER setdiarydefaults BEFORE INSERT ON diary FOR EACH ROW EXECUTE PROCEDURE setdiarydefaults();


--
-- Name: setembedsdefaults; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER setembedsdefaults BEFORE INSERT ON embeds FOR EACH ROW EXECUTE PROCEDURE setembedsdefaults();


--
-- Name: setfollowsdefaults; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER setfollowsdefaults BEFORE INSERT ON follows FOR EACH ROW EXECUTE PROCEDURE setfollowsdefaults();


--
-- Name: setuserdefaults; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER setuserdefaults BEFORE INSERT ON users FOR EACH ROW EXECUTE PROCEDURE setuserdefaults();


--
-- Name: comment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY comment
    ADD CONSTRAINT comment_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);


--
-- Name: diary_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY diary
    ADD CONSTRAINT diary_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);


--
-- Name: entries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY entries
    ADD CONSTRAINT entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);


--
-- Name: users_profile_pic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_profile_pic_id_fkey FOREIGN KEY (profile_pic_id) REFERENCES media_file(media_id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

