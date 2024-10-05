Update your `README.md` using the template below. We are specifically interested in the installation instructions (e.g., all the gems, how to load real or seed data, etc.). This sample README was developed for a Rails project, so you can swap the "Gems" section of the "Installation" instructions to include add-ons that are relevant to you.

If any of the sections in this template grows to more than one screen, consider placing it in its own file and linking to it from this file. Those files could live in a subdirectory called `docs`.

**Make sure to check out the repo anew and test your installation instructions.**

Provide a README file with the following information:

# Project Name
Project ACME-8-GCISL-FullStackApp

# GCISL  # What I added right now
Enhancing and existing senior living resident volunteer report tracking system for future research projects

## Project summary
-Improve the user-friendliness of the existing application for GCISL staff, faculty, and student
- Improve the capability of the administrators to manage the system by improving the administrative capabilities.
- Train GCISL staff and faculty so that they can use and manage the system.

### One-sentence description of the project

TODO: Our goal for this project is to enhance an existing senior living resident volunteer report tracking system for future research projects.

### Additional information about the project

TODO: Write a compelling/creative/informative project description / summary
- Report Tracking System
- Track existing research projects
- Add new research projects
- Make sure there is no duplicate projects
- Have a group of related projects and ability to search them by topic
- Have a system administrative portal that has APM and user assistance 
- A portal for the volunteerS to have access to the projects
- A portal for users 

## Installation
After meeting, will install necessary applications to make the project as efficient as possible

### Prerequisites

TODO: List what a user needs to have installed before running the installation instructions below (e.g., git, which versions of Ruby/Rails)
TBD


### Add-ons

TODO: List which add-ons are included in the project, and the purpose each add-on serves in your app.
- Have APM and user assistance
- Bigger font for the users to see better the information
- Make the instructions simpler
- Reduce the steps to get to final desired user result
- Implement additional features identified by the GCISL team 

### Installation Steps

TODO: Describe the installation process (making sure you mention `bundle install`).
Instructions need to be such that a user can just copy/paste the commands to get things set up and running.

TBD


## Functionality

TODO: Write usage instructions. Structuring it as a walkthrough can help structure this section,and showcase your features.
TBD

## Known Problems

TODO: Describe any known issues, bugs, odd behaviors or code smells.
Provide steps to reproduce the problem and/or name a file or a function where the problem lives.

TBD

## Contributing

TODO: Leave the steps below if you want others to contribute to your project.

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Additional Documentation

TODO: Provide links to additional documentation that may exist in the repo, e.g.,
 * Sprint reports
 * User links

## License

If you haven't already, add a file called `LICENSE.txt` with the text of the appropriate license.
We recommend using the MIT license: <https://choosealicense.com/licenses/mit/>




### ----------------------- The original README -------------------------------

# gciConnect - GCISL

### Repository for gciConnect for Granger Cobb Institute of Senior Living (GCISL)

### Project Description:
gciConnect is a web application that connects senior residents with GCISL. Purpose of gciConnect is to connect senior residents who are interested in taking part in community projects.

### Team Members:
Muhammad Ali Dzulfiqar
Kristen Leanne Blue
Luke Thorvilson

### gciConnect Deployment Site
https://gciconnect.onrender.com/

### How to run project from the source
1) Open the project on your IDE of your own choice.
2) Open a terminal where you open the project
3) Write the command 'cd projectGCISL'
4) Run 'python manage.py collectstatic'
5) Lastly, run the command 'python manage.py runserver'
6) Open the link with a control-click to navigate to the devolpment site.

### Get schema Information
1) Open a terminal where you open the project
2) Write the command 'cd projectGCISL'
3) Run 'python manage.py inspectdb'