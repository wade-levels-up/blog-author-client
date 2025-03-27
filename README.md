# Blog-API

⛰️ Objective: The objective of this project was to create a Blog Page Jamstack project where the back end and front ends exist seperately from each other. The focus was on creating a RESTFUL API in Express for my back end with API end points used to access resources such as blog posts and comments. This project has two React front end clients, one for authors and one for non-author users and uses JSON Web Tokens to authenticate both.
Authors can sign-up, create blog posts which can be published or saved as drafts. They're also able to edit posts they've already made and delete user comments from their posts.
Non-author users can read blog posts from the non-author client as well as leave comments on posts once they're signed up.
Anyone who isn't signed up can still view posts but cannot add comments.

💪🏻 Challenges: As this was my first Jamstack project I had to think forward as to how the front end clients would consume my back end API and which URI's needed to be made available. Security using JWT's was also something that needed careful consideration and I opted to use Passport's JWT strategy which allowed be to attached the user object to the request. This proved useful time and time again for validating the user no matter which end points they tried to access.

⚙️ Technologies Used: HTML, CSS, JavaScript, Node.js, Express, Prisma, PostgreSQL, Passport, React

Here's the live non-author client: https://coblog.netlify.app/
And here's the live author client: https://coblogauthor.netlify.app/
