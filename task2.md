# Fixing frontend errors in Wavesurfer.js
Once you finsh the create user feature, go ahead and log into the site. You will be met with a fully completed page to upload audio clips. Feel free to find some audio clips on XentoCanto. We often get a large amount of XentoCanto clips to help us gather some extra datasets to work with. Click here and download some [Screaming Piha clips you like](https://xeno-canto.org/species/Lipaugus-vociferans) . Upload those and then hit annotate. Here you are greeted to a spectrogram of the image you have seen. Go ahead and play around a little bit. You can drag and click on the spectrogram to make annotations of bird calls (in pyrelite they are automatically labeled as bird, in pyrenote they are manually labeled). The spectrogram itself is rendered by the [wavesurfer.js](https://wavesurfer-js.org/) react library. Feel free to look at the site to learn more. 

However, you may notice that there are a few weird visual bugs. These bugs include:
- Spectrogram doesn't move with the timeline
- Regions cannot be made on the first section
- A waveform blocks spectrogram when running

To solve, these issues, we can look at these two files:
-src\frontend\src\css\index.css
- src\frontend\src\pages\annotate.js

Your task is to attempt to fix these various issues. 
(This is based on a very real issue that took me way longer to fix than I would have liked the first time I encountered the bugs)

Hints: 
- Try playing around with the position and float values of the various wavesurfer related containers such as waveform to timeline in index.css
- Look up wavesurfer.js documentation for attributes to wavesurfer.create() that could change a property that could make the wavesurfer.js functionally invisible. 
- The inspect tool on your browser can allow you to change the styling of an element in real time, use this to try and play around with the position and float of the various wavesurfer containers to try and solve the spectrogram alignment issues