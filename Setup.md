
# Setup for work
Start by **forking this GitHub repo**. After doing so, **clone this fork** to your personal computer.  

One thing you may notice is that there are a lot of things going on. You got the frontend, backend, SQL, Redis, and nginx stuff all going on in this area. Don't worry about this for now. Your main goal working with us will be to spend on the frontend and/or backend elements of the project. 

Next, we got to set up the environment for our project. To do so, we will be using a system known as docker. Docker is a containerization system, which if you are unfamiliar with that, is like a lite virtual machine focused on only running a specific program rather than simulating a whole computer ([See more here](https://www.docker.com/resources/what-container/)). Each docker container comminates with the other to create Pyrelite. Understanding how this work is not important to help contribute to the team, but helpful for your understanding overall. 

Download docker from [docker](https://www.docker.com/) as well as [docker-compose](https://docs.docker.com/compose/. Docker-compose is a tool for starting up some of the many docker containers we will run. (It is also strongly recommended to have either git or GitHub desktop installed on your system. 

**While docker is getting set up**
We have one more file to add. We have to add a .env file to the src folder. the reason for this is security. To access pyrelite, we need the first account to be created. To do this without hardcoding a username and password into our public repos, we can put a .env file in the src folder that we **never** upload to GitHub. This way we can securely create our system. 

Create a new file named .env in your src directory. Then copy and paste the following into the file:
```sh
ADMIN_USERNAME=INSERT_SOMEHTING
ADMIN_PASSWORD=INSERT_SOMETHING
JWT_SECRET_KEY=INSERT_SOMETHING
```
Replace the INSERT_SOMETHING with whatever you choose. The admin_username and admin_password will be used to log into your account. the JWT_SECRET_KEY can be anything you want. Don't worry about what JWT is for now. We will talk more about what JWT is when we discuss backend work. 


**What is going on?**
Let's talk a bit about some of what is going on. In the main src folder, there is a bunch of .yml files. Each of these defines what containers we want to start, where the code is for each container, and what port we want that container to listen to for any messages coming towards it. 


**To build the services (do this when you first start it), run:**
**Note** Remember to cd into audino before starting
```sh
$ docker-compose -f docker-compose.dev.yml build
```

**To bring up the services, run:**
```sh
$ docker-compose -f docker-compose.dev.yml up
```
Then, in a browser, go to [http://localhost:3000/](http://localhost:3000/) to view the application.

**To bring down the services, run:**

```sh
$ docker-compose -f docker-compose.dev.yml down
```
## Troubleshooting for starting docker

1) Docker containers do not even get a chance to start
  - Make sure docker is set up properly
  - Make sure the docker itself has started. On windows check the system tray and hover over the icon to see the current status. Restart it if necessary
2) Backend crashes
  - For this error, check the top of the log. It should be complaining about /r characters in the run-dev.sh files
  - For window users, the backend will crash if the endline characters are not set to LF rather than CRLF
  - On VSCode, you can swap this locally via going into the file and changing the CRLF icon in the bottom right to LF
  - Do this for frontend/scripts/run-dev.sh and backend/scripts/run-dev.sh 
3) Database migration issues
  - If the backend complains about compiler issues while the database migration is occurring go into backend/scripts/run-dev.sh
  - Check to make sure in line 25, the stamp command is pointing to the right migration for the database,
      - Ask for help on this one

If everything worked out with getting docker set up, when after a few minutes (give it some time for Frist runs it can take a second to get set up )you should be able to [http://localhost:3000/](http://localhost:3000/). Remember to reach out to project leads in case something does not get set up correctly. Once you see a page to log in to Pyrelite in [http://localhost:3000/](http://localhost:3000/), you are ready for [the next step](./task1.md).