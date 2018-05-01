/*
Avoid It Beta 0.1
This is a Chrome Extension that automatically hide the images you don't wanna see.
Basically what it does is to scan thourgh all the images in the page that you are visiting
and uses Google Vision API to do pattern recognition and generate labels for them.
If the lables matched with the tags you pre-entered, the image will be hided.
*/

//API key for Google Vision API
var API_KEY = ;

//Max Labls
var MAX_LABELS = 2; // Only show the top few labels for an image.

//get all images in a page
var images = document.getElementsByTagName('img'); 

//get all tags stored locally
var alltags = [];
chrome.storage.local.get(null, function(items) {
    alltags = Object.keys(items);
});

//count the number of matched images
var matchedimages = 0;

// detect makes a Cloud Vision API request with the API key.
var detect = function (type, uri, cb) {
  var url = 'https://vision.googleapis.com/v1/images:annotate?key=' + API_KEY;
  var data = {
    requests: [{
       image: {source: {imageUri:uri}},
      features: [{'type': type}]
    }]
  };
  http('POST', url, JSON.stringify(data), cb);
};

// detectb64 makes a Cloud Vision API request with the API key.
//images are base64 format in this function
var detectb64 = function (type, b64data, cb) {
  var url = 'https://vision.googleapis.com/v1/images:annotate?key=' + API_KEY;
  var data = {
    requests: [{
       image: {content: b64data},
      features: [{'type': type}]
    }]
  };
  http('POST', url, JSON.stringify(data), cb);
};


//http makes an HTTP request and calls callback with parsed JSON.
var http = function (method, url, body, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) { return; }
    if (xhr.status >= 400) {
      console.log('XHR failed', xhr.responseText);
      return;
    }
    cb(JSON.parse(xhr.responseText));
  };
  xhr.send(body);
};


//b64 converter
var b64 = function (url, cb) {
  var image = new Image();
  image.setAttribute('crossOrigin', 'anonymous');
  image.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    canvas.getContext('2d').drawImage(this, 0, 0);
    var b64data = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
    cb(b64data);
  };
  image.src = url;
};


//check if lables matchs pre-entered tags
var match = function (index,url){
detect('LABEL_DETECTION', url , function (data) {
        var labels = (((data.responses || [{}])[0]).labelAnnotations || [{}]);
        if (labels.length === 0) {
          notify('No labels detected');
          return;
        }
        var t = '';
        for (var i = 0; i < labels.length && i < MAX_LABELS; i++) {
        t += labels[i].description + ' (' + labels[i].score + ')\n';
        if(alltags.indexOf(labels[i].description) > -1){
            console.log('Labels detected', t);
            images[index].style.opacity = "0";
            matchedimages++;
          }
        }
      });
};



//check if lables matchs pre-entered tags
var matchb64 = function (index,uri){
  b64(uri, function (b64data) {
    detectb64('LABEL_DETECTION', b64data , function (data) {
        var labels = (((data.responses || [{}])[0]).labelAnnotations || [{}]);
        if (labels.length === 0) {
          notify('No labels detected');
          return;
        }
        var t = '';
        for (var i = 0; i < labels.length && i < MAX_LABELS; i++) {
        t += labels[i].description + ' (' + labels[i].score + ')\n';
        if(alltags.indexOf(labels[i].description) > -1){
            console.log('Labels detected', t);
            images[index].style.opacity = "0";
            matchedimages++;
          }
        }
      });
  });
}


//loop thourgh all the images
for (var x = 0, l = images.length; x < l; x++) {
       if (images[x].src.substr(0,10)=="data:image"){
        //console.log('base64',images[x].src);
        matchb64(x,images[x].src);
       }
       if($(images[x]).attr("data-src")){
        //console.log('data-src',$(images[x]).attr("data-src"));
        match(x,$(images[x]).attr("data-src"));
       }else{
        //console.log('src',images[x].src);
        match(x,images[x].src);
       }
}

//notification

