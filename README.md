# Maaltijden Studentenhuis
## Endnodes

- **register:** `[api/v1/register]` (POST: name, email, password, secret_key)
- **login:** `[api/v1/login]` (POST: email, password)


- **new_meal:** `[api/v1/meal]` (POST: user, datetime, title, desc, max_people, image) 
- **get_meal:** `[api/v1/meal/:id]` (GET: title, desc, joined_people[], max people) 
- **all_meals:** `[api/v1/meals]` (GET: title + number of people, max people)
- **join_meal:** `[api/v1/meal/join]` (POST: meal_id, user, amount of people)
- **leave_meal:** `[api/v1/meal/leave]` (POST: meal_id, user)

## Install
- Run `npm install`
- Copy `config/db.example.json` to `config/db.json` and change values
- Run `npm start`

## Packages

- **Express:** HTTP Web Framework
- **Morgan:** HTTP Request Logger
- **Multer:** ?
- **Mysql:** Database connection
- **Nodemon:** Auto reload server after file changes