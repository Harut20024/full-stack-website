# My Portfolio Website
![Portfollio](https://github.com/Harut20024/full-stack-website/blob/main/views/screnn/Screenshot_1.png)
Welcome to my portfolio website repository! This project showcases my full-stack development skills and serves as my personal portfolio website. The website allows visitors to explore my biography, view my work, and leave comments. The comments left by visitors are stored in a database, creating an interactive and dynamic user experience.

## Features

- User Authentication: The website includes a user authentication system, allowing users to register, log in, and log out securely.
- Personal Biography: Learn about me, my background, and my skills.
- Project Showcase: Browse through my completed projects and view details about each one.
- Comment System: Registered users can leave comments on the website. Comments are stored in a database and associated with the user's profile.
- CRUD Operations: The website supports CRUD (Create, Read, Update, Delete) operations for comments, allowing administrators to manage comments effectively.
- Responsive Design: The website is designed to be responsive and accessible across various devices and screen sizes.

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: JSON files for user and comment data storage
- Authentication: Passport.js for user authentication
- Image Uploads: Multer for handling image uploads
- Styling: CSS for styling and layout

## Admin User
An admin user has the privilege to manage comments on the website. Admins can delete comments that violate the website's policies or are considered inappropriate.

## Getting Started

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Run the project using `npm run dev`.
5. Access the website in your browser at `http://localhost:3000`.


## CRUD Operations for Comments
- As an user, you can perform CRUD operations on comments:

1. Create Comment: Add new comments and provide valuable feedback.
2. Read Comment: View comments.
3. Update Comment: Edit comments to correct errors or provide additional information.
4. Delete Comment: as Admin you can remove inappropriate or irrelevant comments.

## Usage

1. Register or log in to access the full features of the website.
2. Explore the different sections of the website, including the biography and project showcase.
3. Leave comments on projects to provide feedback or ask questions.
4. Log out when you're done using the website.

## Contributing

I welcome contributions, bug reports, and feature requests. Feel free to submit issues and pull requests on GitHub. Your input is valuable and helps make this project better.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions, please feel free to contact me:

Let's work together to make the Ninja Game even more exciting and enjoyable for players!



## if it dont work do this steps

1.Clear npm cache and reinstall dependencies: Sometimes, corrupted cached files can lead to issues. Try clearing the npm cache and then reinstalling the dependencies by running the following commands in your project directory:
```bash
npm cache clean --force
npm install
```
2.Delete node_modules and package-lock.json: If the above step doesn't work, you can try deleting the node_modules directory and the package-lock.json file, and then reinstalling the dependencies:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```
3.Reinstall bcrypt: If none of the above steps work, you can try uninstalling bcrypt completely and then installing it again:
```bash
npm uninstall bcrypt
npm install bcrypt
```
4.Check Node.js version: The error message indicates that you're using Node.js version "v20.5.1," which seems unusual as of my knowledge cutoff in September 2021. Make sure that you are using a supported and stable version of Node.js. You can check the Node.js website for the latest LTS (Long Term Support) version and use that.
  
  
