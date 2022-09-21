-- Useful resource for database creation
-- https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-foreign-key/

DROP SCHEMA IF EXISTS blogtest CASCADE;
CREATE SCHEMA blogtest;
SET SEARCH_PATH TO blogtest;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS two_factor_codes;



CREATE TABLE users (
user_id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
username VARCHAR(30) NOT NULL UNIQUE,
email_address VARCHAR(100) NOT NULL UNIQUE,
user_password VARCHAR(64) NOT NULL,
two_factor INT
);


CREATE TABLE blog_posts (
id INT NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 10000),
title VARCHAR(300),
post TEXT,
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
user_id INT,
PRIMARY KEY(id),
FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE two_factor_codes (
    user_id INT NOT NULL,
    code VARCHAR(300),
    PRIMARY KEY (code),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);


INSERT INTO users(username, email_address, user_password, two_factor) VALUES ('best_blogger_101', 'bb101@gmail.com', '$2a$10$tS39afkLp9JnWqtg0QrA7.DPxrOZo5E7b4Mh.SZpf9IlL2Mg2Nx9.', 0);
INSERT INTO users(username, email_address, user_password, two_factor) VALUES ('test', 'test@gmail.com', '$2a$10$kaM9B/tYJ7cCs14H1rRcfue/heFu89/8vU2w7tzriTD4uHVi0Kk1y', 0);
INSERT INTO users(username, email_address, user_password, two_factor) VALUES ('f1fan', 'f1fan@gmaillcom', '$2b$10$AjSSmjeukEhz57ru1W1EGOS.13WM4d/PvY.j4chXHvIYyZ5KUzZ9.', 0);
INSERT INTO users(username, email_address, user_password, two_factor) VALUES ('anothertest', 'at@gmail.com', '$2b$10$67neOuSFZnRmyjYseCrIXuOR1pKhWx/8hjFzQEqxjfDwjUiibWXWy', 0);
INSERT INTO users(username, email_address, user_password, two_factor) VALUES ('wkn17jzu', 'wkn17jzu@uea.ac.uk', '$2a$10$AVC/2XjubgBR/TCjSbj7wunpMQawalNYoDAxwdXCdIk/W7huS/H4G', 1);



INSERT INTO blog_posts(title, post, user_id) VALUES ('I love dogs', 'I''ve just realised why dogs are the best creatures ever', 1);
INSERT INTO blog_posts(title, post, user_id) VALUES ('Just university things', 'Doing coursework at the last minute lol', 1);
INSERT INTO blog_posts(title, post, user_id) VALUES ('Why this blog is better than Reddit', 'Because I can post things instantly, and everybody can see it!', 2);
INSERT INTO blog_posts(title, post, user_id) VALUES ('Hamilton is the best!', 'I just watched the last race of the season and I am in disbelief', 3);
INSERT INTO blog_posts(title, post, user_id) VALUES ('I hate working', 'I cannot wait until I am allowed to quit', 3);

SELECT * FROM blogtest.users;

SELECT * FROM blogtest.blog_posts;