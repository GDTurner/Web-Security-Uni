# DSSBlog
A small blog system designed to be secure against a range of threats such as account enumeration, SQL injection and cross-site scripting.
Written by PGT12.

https://tailwindcss.com/docs/installation
- Template paths are already configured providing you use the tailwind.config.js file in the repo.
- run this code in your ide terminal to build the css and make it actually work: ~~`npx tailwindcss -i ./input.css -o ./public/css/style.css --watch`~~
- - Can now use `npm run dev` instead of the above code to build css


NPM packages installed:
```
├── @tailwindcss/line-clamp@0.3.1
├── autoprefixer@10.4.5
├── bcrypt@5.0.1
├── cors@2.8.5
├── crypto@1.0.1
├── ejs@3.1.7
├── express-flash@0.0.2
├── express-session@1.17.2
├── express-validator@6.14.0
├── express@4.18.0
├── nodemailer@6.7.5
├── passport-2fa-totp@0.0.1
├── passport-custom@1.1.1
├── passport-local@1.0.0
├── passport@0.5.3
├── pg@8.7.3
└── tailwindcss@3.0.24

```


## Setup Guide
### Windows 
Use the linux guide as most of the steps are the same except commands, but here is the general workflow:
1. run `npm install` to install the required packages
2. Get a postgres database running (use instructions tailored to your OS)
3. copy the file at `generic/config.js` to the root of the project, and change the username and password fields to the ones you have setup with posgres
4. Run the DDL in posgres to initialise the database
5. The blog system will now work, run `app.js` and navigate to `localhost:3000` 


### Linux
In order to get this project up and running on Linux (Ubuntu) you will need to do the following:
1. Install Node.js and npm (on Ubuntu, command it `sudo apt install nodejs npm`)
2. Clone this repository to your local files
3. Run `npm install` at the root directory of the project - this will install the required packages
4. With the terminal still at the project root dir, run `npx tailwindcss -i ./input.css -o ./public/css/style.css --watch`, this will get the TailWind CSS files generated
5. Install PostgreSQL and pgAdmin 4 using steps from [this]("https://www.tecmint.com/install-postgresql-and-pgadmin-in-ubuntu/", "How to Install PostgreSQL and pgAdmin4 in Ubuntu 20.04") link (summarised below):
   - `sudo apt update`
   - `sudo apt install postgresql`
   - Check status of newly installed postgresql using this command: `sudo systemctl status postgresql`
   - Confirm db software is ready to accept connections from clients: `sudo pg_isready` - this command should return `/var/run/postgresql:5432 - accepting connections`
   - Change account to postgres by running `sudo su - postgres`, then, as postgres user, run `psql`
   - Run the following (replacing user with your username and password with the password you want to use: 
     - `CREATE USER user WITH PASSWORD 'securep@wd'`
     - `CREATE DATABASE postgres;`
     - `GRANT ALL PRIVILEGES ON DATABASE postgres to user`; 
     - `\q`
     - Exit out of postgres user account by typing `exit` in your current terminal
6. Install pgAdmin 4 using the following commands:
   1. `curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add`
   2. `sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'`
   3. `sudo apt install pgadmin4`
   4. `sudo /usr/pgadmin4/bin/setup-web.sh`
   5. You can now access pgAdmin 4 using the following address http://SERVER_IP/pgadmin4
7. Access pgAdmin, login with the credentials you made earlier
8. In the left pane, navigate to servers, localhost, databases, postgres, schemas.  Right click schemas and click query tool
9. Copy and paste the DDL contained within the `Database DDL.txt` file in the root directory of this project into the text field. Run the DDL.
10. You should now be able to run `app.js`

### Getting Postgres to Interact with the App
Once you have this node project setup, you will need to copy the config.js file from 'generic/config.js' to the root dir. 
You should then change the username and password fields to your postgres details.

### NPM Error Guide 
In case you get the following error `npm ERR! typeerror Error: Missing required argument #1` when installing all the project packages, run the following commands to fix:
```
sudo npm install -g n
sudo n stable
sudo npm install -g npm
npm i
```

The error is to do with having an older version of Node.js and npm installed.
Look [here](https://github.com/npm/cli/issues/681#issuecomment-793916156) for more information. 

## Git Guide
Here is a quick guide for you guys so that you can upload / implement your changes to the repository:

Download and install git to your machines. It can be found [here](https://git-scm.com/downloads). You can install with the default settings.
Once installed, open the git bash program. Some useful commands:
- `pwd` - prints your current working directory (in other words, where you are currently in the filesystem)
- `cd [directory goes here]` - change to this directory 
- `cd ..` - move up one directory (so from `/dir1/dir2/dir3` to `dir1/dir2`)

Git specific stuff:
- `git clone https://github.com/GDTurner/DSSBlog.git` - make a local copy of the repository on your computer
- `git pull` - when you are in the repository directory, run this command to pull any changes made from the github repo to your local repo

You can imagine git as a snapshot tracker - it saves snapshots of files exactly as they are, so that you can move between versions / files are backed up. 
When you clone the repo to your computers, you are essentially downloading the latest snapshot of the files to your pc.

Once you have made changes and would like to share them 
- `git add --all` - add all changed files to be committed
- `git commit -m '[message goes here]''` - save a snapshot of files exactly as they are with a message
- `git push` - push you changes to the online repo so that we can all download them locally

If you can push because you do not have local changes, pull first then push once you have committed. 


## Task Breakdown - Engagement Report

Sam:
- CSRF
- Authentication
- Salt/Hashing
- Report

Holly:
- SQL injection
- Account Enumeration
- Report
- Testing

Chris:
- Salting/Hashing
- Authentication
- Database
- Report

Guy:
- Cross site scripting
- Node routing
- Frontend css/js
- Report



