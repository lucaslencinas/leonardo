# 🎨 Features - Ideas for Leonardo

## 🌟 Must

- Email login
- Notification when someone makes a prediction
- Be able to split results based on connection type. Connection field can be: family or friends. Sofie and Lucas will have this checkbox marked for both. In the UI this check can be added in the name and email stage, it can be a checkbox where you can select both. Anybody can see the results for the family or friends

## 🌈 Nice to Have

- Parents upload baby's first photos
- Winner Reveal Ceremony. With fun, with invented/fake facts about the competition.

## Bugs

- I'd like if the prediction page occupies 100% of height of the page when possible. Right now it is way more than 100% of the height, check screenshot in this repository .claude/bugs/image.png and image copy.png. Perhaps when people are already inside the /predict flow, you can remove some parts of the title and subtitle and reduce some padding of the current step, for example in this case the weight section
- In bugs/image copy 2.png you can see the eye color section. It is very hard for us later if the baby has either brown or dark brown and so on. We need more "spacing"/"difference" between the colors. So for now, group together: - dark brown and black, - Brown and light brown, - blue-grey and blue,
  If you find someone who already voted for for one of those colors, adjust the database as needed and put them in the right bucket.
- Similar problem with the hair color. In bugs/image copy 3.png, I'd like you to group: - Black, near black and very dark brown - dark brown, brown - dark blonde and blonde
  If you find someone who already voted for for one of those colors, adjust the database as needed and put them in the right bucket.
- In the Review Your prediction step, there is so much spacing in between the smaller areas, you can make it more compact.
- Add a countdown of seconds on the page after clicking on the email verification link. It says that I'll be redirected but not sure when, so it would be nice to add a small text saying 5 4 3 2 1 secs before redirect
