#ENDNOTES


- register (POST: name, email, password, secret_key)
- login (POST: email, password)

- new_meal (POST: user, datetime, title, desc, max_people, image)
- get_meal (GET: title, desc, joined_people[], max people)
- all_meals (GET: title + number of people, max people)
- join_meal (POST: meal_id, user, amount of people)
- leave_meal (POST: meal_id, user)
