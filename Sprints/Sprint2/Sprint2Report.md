 # Sprint 2 Report (10/05/2024 - 11/05/2024)


## YouTube link of Sprint 2 Video (Make this video unlisted)
[Sprint 2 Demo](https://youtu.be/fWyVFEDtFps)

## What's New (User Facing) 
* Successful deployment and integration of the React app on Vercel
* Redesigned pages for improved user experience
* MongoDB integration for dynamic content and data management
  
## Work Summary (Developer Facing) 
In this sprint, we continued our transition from the original static codebase, built with HTML, CSS, and JavaScript, to a dynamic React-based application that includes a fully redesigned frontend. This transformation required not only a complete rebuild of the code structure but also a revision of the site’s visual and functional design to better suit the project’s goals and make it more appealing and professional. The new design, implemented in React with a streamlined component structure, allows for a more user-friendly and interactive experience. We also integrated MongoDB as our primary database, moving from static content to a dynamically managed data structure, and configured both the frontend and backend for deployment on Vercel. This deployment involved setting up serverless functions and establishing smooth connections between the React frontend and MongoDB, which required configuring secure API routes and managing the environment variables across Vercel’s infrastructure. Setting up these connections presented challenges as we worked to ensure seamless communication between frontend and backend, especially with the new design and the shift to Vercel. By experimenting with deployment strategies, precise configurations, and iterating on our approach, we overcame these hurdles. This sprint provided us with a strong understanding of full-stack application structure, deployment processes, and the demands of designing a responsive and interactive user experience.

## Unfinished Work  
The task assignment has not been completed because we have not yet allowed the admin to assign tasks to the users, so the volunteers cannot view tasks,other work like task notification and log completion of tasks cant be completed until the admin can assign tasks. We still need to grasp the extent of the project to get a better idea of how to test for system reliability. Test functions have not yet been implemented, so they will be part of the next sprint.

## Completed Issues/User Stories 
Here are links to the issues that we completed in this sprint:
* [User Registration](https://github.com/awishto-write/GCISL/issues/2)  
* [Contact Us Page](https://github.com/awishto-write/GCISL/issues/9) 
* [User Login](https://github.com/awishto-write/GCISL/issues/31) 
* [About - Page](https://github.com/awishto-write/GCISL/issues/32) 
* [Get Involved - Page](https://github.com/awishto-write/GCISL/issues/33) 
* [Home Page](https://github.com/awishto-write/GCISL/issues/34) 
* [Login - UI](https://github.com/awishto-write/GCISL/issues/35) 
* [Registration - UI](https://github.com/awishto-write/GCISL/issues/36) 
* [Solution Approach](https://github.com/awishto-write/GCISL/issues/37) 
* [Testing and Acceptance Plans](https://github.com/awishto-write/GCISL/issues/38)
  
## Incomplete Issues/User Stories  
Here are links to issues we worked on but did not complete in this sprint:
* [Task Assignment](https://github.com/awishto-write/GCISL/issues/4) - We did not get to this issue because we currently have been able to allow the admin to create tasks, so we need more time to allow the admin to link those tasks to the volunteers
* [Task Notifications](https://github.com/awishto-write/GCISL/issues/5) - We did not get to this issue because we have not been able to implement task assignments yet, so the notifications cannot occur. 
* [Log completion of tasks](https://github.com/awishto-write/GCISL/issues/6) - We did not get to this issue because we did not yet implement the task assignment to be able to mark it as complete upon completion.
* [System Rebliability](https://github.com/awishto-write/GCISL/issues/10) - We did not get to this issue because we still have not been able to get more information related to how far the issue will be used.
* [Test Functions](https://github.com/awishto-write/GCISL/issues/39) - We did not get to this issue because we just recently completed the functions using the API.

## Code Files for Review   
N/A

## Retrospective Summary   
Here's what went well: 
 * Implemented an admin and volunteer view
 * Connected registered users successfully to MongoDB
 * Added more detail to issues and pull requests

Here's what we'd like to improve: 
  * We should get better at having 2+ lines with in depth descriptions for our commits
  * We should get better at creating a pull request for our all our commits and associate them with our issues
  * We should, as individual team member, get better at making comments on our teammates pull request and mention potential areas to improve each other code quality and functionality

Here are changes we plan to implement in the next sprint: 
  * Connecting the admin page to the volunteer page more thoroughly
  * Connecting assigned tasks to the database and logging activity to the website
  * Been able to go back and forth with reaching out to a volunteer
