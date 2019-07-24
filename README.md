# Bougebeta
## Requirements
- node (>=7.10)
- npm (>=4)
- Postgres (>=9)

## Setup Postgres Locally
[Follow instructions to install Postgres in your local setup](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup)

### Create database and table
Log in local Postgres by running in your terminal
```
psql
```
Once logged, create database by running:
```
create database <your_database_name>;
```
Connect to the newly created database by running:

```
\c <your_database_name>;
```

Run the query to create the table(s) by simply copy pasting the CREATE TABLE query in `/migrations/001-init.sql`. Don't forget to add a semicolon at the end of the query.

Make sure the table is there by running:
```
table <your_table_name>;
```

*Note: No sophisticated migration system for now. Just roughly running the needed sql queries manually.*

## Setup Node.js app
Run the following in the root directory to install app dependencies

```
npm install
```

Create an .env file in your local machine specifying a variable pointing to your local database url string:
```
//.env
DATABASE_URL='postgres://localhost:5432/<your_database_name>'
```

## Deploy in Heroku
To deploy your app in [Heroku](https://www.heroku.com/) you need to be have an account created.

Once you have the account make sure to [install the Heroku cli](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)

### Create the app
Navigate to the root of the project and type the following to create your app:
```
heroku create <app_name>
```
You then will be able to access it from this URL `https://<app_name>.herokuapp.com`

Deploy your code to sync Heroku with the content of your repo by running:
```
git push heroku master
```

Open the app in the browser:
```
heroku open
```


### Set Postgres in Heroku
Now add an 'add-on' to have a Postgres database running along your Heroku app by running:
```
heroku addons:create heroku-postgresql:hobby-dev
```
This will auto-magically create a database for you. The database URL string will be set to the environment variable `DATABASE_URL` on a .env filed created by Heroku. Your app will use such .env file once it is deployed.

Finally create the necessary database tables in the Heroku Postrges database. To do so first log in to the database by running:
```
heroku pg:psql
```

Once logged copy paste in the terminal the create table query or queries as you previously did to create them in your local database.

Check more commands to check Postgres database in Heroku in [this guide](https://devcenter.heroku.com/articles/heroku-postgresql#using-the-cli)

### More about Heroku + Node.js + Postgres   

To have more details of the process you can head to the [Getting Started with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) from Heroku and [this comprehensive tutorial](https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database).

Finally a [good resource to work with Node and Postgres](https://node-postgres.com/).    
