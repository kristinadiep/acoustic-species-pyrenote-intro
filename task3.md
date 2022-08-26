# Task 3: Rest APIs and SQLAlchemy
Now that we can make annotations on a spectrogram, we need some way of saving this data to the sever. For that, we are going to have to build out the API request some more. Your tasks are to finish the frontend Axios method in handleSave() of src\frontend\src\pages\annotate.js and the create_segmentation() method in src\backend\routes\data.py. At the end of this we should be able to upload data to the backend from the frontend. 


**Hint**:
- Look up resources on sqlalchemy and axios
- What data are we sending to the backend? How can you access that data globally in react? (hint: the state might come into play here)
- For the URL notice on the frontend, we write api/url but on the backend we have api.route(url). These are both mean the same thing, just diffrent syntaxes.  
- Saving the python file should reload the backend with your newest changes (unless you are making a new sql table, in which case shut down the container and start it up again). If you are not messing with the sql tables, and just working on api calls, if you are unable to have it reload from just saving a webpage, go to src\backend\models.py and use crtl+s on that file. That should cause the backend to reload. 

## Finale

Once you are done, you have worked on a little bit of each aspect of the code. Message the current project leads to get the next assignment for web development. If you haven't done so already, clone pyrenote and get that set up on your local machine. Don't forget the .env file!!

Congratulations on completing the intro assignment and welcome to the team! 