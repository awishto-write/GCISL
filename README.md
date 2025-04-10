# ACME-8-GCISL-FullStackApp

## Project summary     
- Improve the user-friendliness of the existing application for GCISL staff, faculty, and student
- Improve the capability of the administrators to manage the system by improving the administrative capabilities.
- Train GCISL staff and faculty so that they can use and manage the system.

### One-sentence description of the project
Our goal for this project is to enhance an existing senior living resident volunteer report tracking system for future research projects.

### Additional information about the project  
- Report Tracking System
- Display of existing research projects avaialable to every visitor
- Make sure there is no duplicate projects
- Have a system administrative portal that has APM 
- A portal for the volunteers to have access to their tasks
- A portal for the adminitrators to assign tasks and see the logs

## Installation   

### Prerequisites 

1. **Git** – Used for cloning the repository.
  - [Git Installation Guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

2. **Node.js and npm** – Required for running both frontend and backend.
  - **Node.js** version 14.x or higher (comes with npm).
  - [Node.js and npm Installation Guide](https://nodejs.org/)

3. **MongoDB** – Either a MongoDB Atlas account or a local MongoDB instance.
  - [MongoDB Atlas Guide](https://www.mongodb.com/cloud/atlas)

### Add-ons 
List which add-ons are included in the project, and the purpose each add-on serves in your app.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB, providing schema-based structure to application data.
- **Bcrypt**: Library used for hashing passwords, ensuring secure storage of user credentials.
- **JSON Web Token (JWT)**: Used to securely transmit authentication information between the frontend and backend.
- **Cors**: Middleware to enable Cross-Origin Resource Sharing, allowing frontend-backend communication across different origins.
- **dotenv**: Loads environment variables from a `.env` file, allowing sensitive information to be managed securely.
- **serverless-http**: Wraps the Express app to run as serverless functions, suitable for Vercel deployment.

### Installation Steps

  1. **Clone the Repository** 
  ```sh
  git clone https://github.com/your-username/GCISL.git
  ```
  2. **Install Project Dependencies** 
  - Backend
  ```sh
  cd projectGCISL/api
  npm install express cors dotenv mongoose bcryptjs jsonwebtoken
  npm install
  ```
  - Frontend
  ```sh
  cd projectGCISL/frontend
  npm install
  ```

  3. **Configure Environment Variables** 
  - Create a .env file in both the api and frontend directories.
  - Set the following environment variables:
     * Backend (projectGCISL/api/.env)
        MONGODB_URI=your_mongodb_uri
        JWT_SECRET=your_jwt_secret
     * Frontend (projectGCISL/frontend/.env):
       REACT_APP_API_URL=http://localhost:5001

  4. **Run the Website Locally**
  - Backend: Start the backend server (http://localhost:5001):
  ```sh
  cd projectGCISL/api
  npm node.js
  npm run dev
  ```
  - Frontend: Start the frontend development server(http://localhost:3000):
  ```sh
  cd projectGCISL/api
  npm start
  ```

## Functionality  

### Admin View

1. **Login**:
  - Secure login for admins, allowing only authorized users to access administrative functions.
  - Login credentials are verified through the backend, and successful authentication generates a session token.

2. **Task Management**:
  - **Create Tasks**: Admins can create new tasks that are visible to all volunteers. Each task includes details such as title, description, due date, and status.
  - **Edit Tasks**: Admins can edit existing tasks to update information or change status (e.g., to mark them as in progress, to redo or completed).
  - **Assign Tasks**: Admins can assign tasks directly to volunteers, ensuring clear distribution of responsibilities.
  - **Filter Tasks**: Admins can filter the tasks by status (all, none, in progress, to redo, completed).

3. **Log Management**:
  - **Create Log**: The system automatically create logs when an admin create a task, when the volunteer changes the status of a task to "completed" and when a task get deleted
  - **Delete Log**: Admins can delete a log by clicking on a row.
  - **Filter Log**: Admins can flter a log by due date (upcoming, overdue, no due date, all).

4. **View all the volunteers and their emails**

### Volunteer View

1. **Login**:
  - Secure login for volunteers, with access restricted to volunteer-specific pages and functionalities.
  - Volunteers are required to authenticate using their credentials, which are verified against the database.

2. **Task Management**:
  - **View Tasks**: Volunteers can view assigned tasks, including details like title, description, due date, and current status.
  - **Task Updates**: Volunteers can update the status of tasks they’re working on, marking them as in progress or completed.
  - **View Completed Tasks**: Volunteers can review completed tasks and leave notes or updates if additional follow-up is needed.

3. **View all the volunteers and their emails**

### Contact Page

- The **Contact Page** is publicly accessible to all visitors, allowing anyone who visits the site to reach out with inquiries, requests, or feedback.
- Information submitted through the contact form is securely sent to the admin for review, ensuring open communication between the site’s visitors and administrators.

### Additional Features

- **Role-based Access Control**: Differentiates between admin and volunteer roles to provide appropriate access to functionalities.
- **Session Management**: Ensures secure sessions with JWT tokens for authenticated users.
- **Responsive Design**: The frontend is designed to be fully responsive, allowing for use on various devices including mobile and desktop.

## Known Problems
Currently, there are no known problems.

## Contributing 
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Additional Documentation
* Sprint reports
   - [Sprint 1](https://github.com/awishto-write/GCISL/blob/main/Sprints/Sprint1)
   - [Sprint 2](https://github.com/awishto-write/GCISL/blob/main/Sprints/Sprint2)
   - [Sprint 3](https://github.com/awishto-write/GCISL/blob/main/Sprints/Sprint3)
   - [Sprint 4](https://github.com/awishto-write/GCISL/blob/main/Sprints/Sprint4)
   - [Sprint 5](https://github.com/awishto-write/GCISL/blob/main/Sprints/Sprint5)
   - [Sprint 6](https://github.com/awishto-write/GCISL/blob/main/Sprints/Sprint6)
* [Documentations](https://github.com/awishto-write/GCISL/blob/main/ProjectDocumentations)
* [Meetings Minutes](https://github.com/awishto-write/GCISL/blob/main/MeetingsMinutes)
* [Skill Trainings](https://github.com/awishto-write/GCISL/blob/main/SkillTraining)
* [Presentations](https://github.com/awishto-write/GCISL/blob/main/Presentations)
* User link: [Site Link](https://gciconnect.vercel.app/)

## License
- [License](https://github.com/awishto-write/GCISL/blob/main/LICENSE.txt)  
