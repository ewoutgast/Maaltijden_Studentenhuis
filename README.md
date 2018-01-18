# Maaltijden Studentenhuis
## Endpoints

- **Register:** `POST [URL/register]`
    - Body: name, email, password (6 karakters & 2 speciale tekens & 1 digit), secret_key
- **Login:** `POST [URL/login]` 
    - Body: email, password
    - Return: token

For all endpoints below you must use this token in the header (`X-Access-Token`):

- **New meal:** `POST [URL/meal]`
    - Body: user, datetime (Y-m-d H:i:s), title, desc, max_people, image
- **Get all meals:** `GET [URL/meals]`
    - Return: title, amount (joined people), max_amount
- **Get meal:** `GET [URL/meal/:id]`
    - Return: title, desc, joined_people[name, guest], max_amount
- **Join meal:** `POST [URL/meal/join]` 
    - Body: meal_id, user_id, guest_amount
- **Leave meal:** `POST [URL/meal/leave]`
    - Body: meal_id, user_id
- **Get image:** `GET [api/v1/meal/img/:imgName]`
    - Return: image

## Installation

- Run `npm install`
- Copy `config/db.example.json` to `config/db.json` and change values
- Make folder `uploads/meal_img` in rootdir
- Run `npm start`

## Packages

- **Nodemon:** Auto reload server after file changes
- **Express:** HTTP Web Framework
- **Morgan:** HTTP Request Logger
- **Mysql:** Database connection
- **Mocha:** Test framework
- **Chai:** Test framework extension
- **Chai-HTTP:** Test framework extension
- **JWT-Simple:** JSON Web Token encoder/decoder
- **Multer:** Multipart/form-data parser (uploading files)
- **Moment:** Parsing, validating, manipulating and formatting dates
- **Body-Parser:** Parsing off the HTTP body
- **Bcrypt:** Password encryption
