# SmoothTabs - personal homepage [fullstack]

## Update 01.2023

This repository contains code for an app previously hosted on Heroku. It is no longer working due to removal of Heroku free tier. Since then the code has been splitted to separate frontend and backend repositories and hosted on Render:

https://github.com/Achenson/personal-homepage-MERN-frontend

https://github.com/Achenson/personal-homepage-MERN-backend

Live version of the app hosted on render:

https://smoothtabs.onrender.com/

## Info

Manage bookmarks, RSS channels and notes in a form of draggable & foldable tabs.

Register to get persistent data storage and an option to upload an image as a background. Unregistered user's data is preserved in local storage.

- Drag the tabs between columns
- Choose between plain color or image background modes
- Set default opened/closed state for each tab, reset to default with one click
- Control individual or global tab colors and RSS settings
- Customize number, color and width of columns

WARNING: uploaded images are visible to the admin, as the app uses an imgBB account for image storage. Images need to be reuploaded after every 6 months.

Refer to app's tips & trick note for advanced usage.

App inspired by iGTab - https://igtab.com/

## Technologies used

- React with React Router
- Typescript
- Zustand (state management)
- Urql (GraphQL client)
- MongoDB 
- Express
- JSON Web Token (authentication)
- Tailwind CSS

