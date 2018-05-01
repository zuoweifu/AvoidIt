# Avoid It!
* Beta 0.1

Link to Chrome Store: 

## How did i came up with this idea?
I believe everyone has something to fear. Some are afraid of spider, some are afraid of lion, myself is afraid of snake. 
It happens to me a lot when i was browsing thourgh websites, some random snake picture came up and scraed shit out of me.
Therefore, i came up with the idea to make a Chrome Extension to hide all the pictures you are afraid of!

## Flow
* user input things as tags and store to local 
```javascript
chrome.storage.local.set(obj, function(){}); 
```
* To get all the images of a page 
```javascript
var images = document.getElementsByTagName('img'); 
```
* use machine learning to generate labels for the images
* Compare the lables and tags to see if there is any images need to be hided
* set opacity of the images need to be hided as 0 

## Thought process
I spent a solid 6 hours to investigate how to do the pattern recognition. (I am a newbie to this Machine Learning thing).
#### Python
I am using sickit library a lot in kaggle competitions. So my first thought is to use Python.
Obviously can't use Python since i am making a Chrome Extension (did i memtion that Chrome Extension is purely javascipt/html/css).
#### Tensorflow
Tensorflow has nodejs version so i can totally use that. But the problem is Chrome Extension is purely client side code. I'll need to set up a server to catch API call from my extension if i use tensorflow. 
I gave up this idea quickly since i don't have that many dataset to train my model plus it's not worth it to set up a server for this.
##### Google Vision API
I came across Google Vision API later and i immediately decided to use this as my pattern recognition server.
Reason is simple, cuz it's google. (Although, later i found out Google Vision API is not as accurate as i expected)


## Images ain't that easy to deal with
There were so many issuses when i was try to detecting these images. The biggest one is the inconsistency of src. Some image have 'src' some have 'data-src' some have only base64 uri. That's when things gets dirty and that's why i separated them into three cases. 
#### src
Just get the src of image and send it to goolge
```javascript
detect('LABEL_DETECTION', images[i].src , function (data) { 
```
#### data-src
Need to first check if it has src, if not check data-src. Send data-src as url to Google. (Had to use jQuery)
```javascript
detect('LABEL_DETECTION', $(images[i]).attr("data-src") , function (data) { 
```
#### base64
This is the begin of hell. I can not stop saying bad things about base64 but it is what it is (Although base64 images slow down my extension dramatically since sendng actual image is time consuming). To send base64 image to Google you have to remove "data:image\/(png|jpg);base64," in the string by doing something like this:
```javascript
 var b64data = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
```
and then 
```javascript
detectb64('LABEL_DETECTION', b64data , function (data) {
```
#### Special Note
For base64, the the request is image: {content: b64data}, for url, the request is image: {source: {imageUri:uri}}.

## How it look like
Didn't put too much effort on UI, all i can say is, it's in good shape.

## Future
* Compress base64 image to speed up the process
* Cover all cases (still missing some cases for image since still in Beta)
* Add face recognition to it, cover the face user don't want to see.
