# Web Dev Intro Assignment
Hello! Congratulations on getting into the E4E Acoustics Species Identification Team! If you are getting this intro assignment, it is because we are working with us as a web dev on Pyrenote, our audio annotation platform. 

## Why are we building an annotation platform anyway?
Our team's goal is to automatically annotate field audio to estimate on population counts of usually hard-to-count species (such as birds). To do so, we need to be able to count the number of calls in an audio clip. Pyrenote is designed to gather the training and testing data to ensure we can develop software to achieve this goal.   

Now, while there exists many tools for audio annotation, we need a precise count of bird species. To count birds in audio clips, we need to know the precise start and end times of those calls in an audio clip. We refer to this as strongly labeled data. Most tools available only weakly label data, where we only know if there is or is not a bird in an entire clip. Strongly labeled data gives more information about when bird calls occur. Since there are not too many tools designed specifically for this purpose, we made our tool! You can learn more about Pyrenote in the published paper: https://ieeexplore.ieee.org/document/9637784.   

## Your intro assignment Task!
Pyrenote currently works as follows
1. Create a project
2. Edit annotation settings in that project
3. Share the project with other Pyrenote users
4. Users annotate the data
5. Administrator downloads annotations for analysis

This requires multiple people, a lot of backend work, and a pretty big system overall. Suppose you have been asked to continue work done on the annotation platform, "Pyrelite," which allows a single user to control this entire process! Pyrelite uses many of the similar functions of Pyrenote except we do not create a project to store data under. Each user works on data they upload and downloads their own annotations.Luckily for you, someone has already gone through and started working on the task! It is up to you to finish up the work (frequently with working on Pyrenote there will already be people who have gone through and created part if not all the features you might be tasked to work on. So it is important to practice working with other's people's code!).  

To get started on Pyrelite, let's start by [getting set up here](Setup.md).