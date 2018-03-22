//API key
var API_KEY = 'AIzaSyATtlv0ME3vEsTimOKnpE1ZH8cZyQ6VPjg';
//Max Labls
var MAX_LABELS = 4; // Only show the top few labels for an image.
//specila code for google.com
var googleurl = 'https://www.google';
if (document.URL.substr(0,18) == googleurl){
    console.log('visiting google');
}




//get all images in a page
var images = document.getElementsByTagName('img'); 
console.log('there are ',images.length,'images');
//get all tags stored locally
var alltags = [];
chrome.storage.local.get(null, function(items) {
    alltags = Object.keys(items);
    console.log('keys are',alltags);
});




// detect makes a Cloud Vision API request with the API key.
var detect = function (type, b64data, cb) {
    console.log("detecting",b64data);
  var url = 'https://vision.googleapis.com/v1/images:annotate?key=' + API_KEY;
  var data = {
    requests: [{
       //image: {content: b64data},
       image: {source: {imageUri:b64data}},
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



//match tag and lable, if matched, do  
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
        console.log('Labels detected', t);
        if(alltags.indexOf(labels[i].description) > -1){
            images[index].style.opacity = "0";
          }
        }
      });
};



for (var x = 0, l = images.length; x < l; x++) {
       if (images[x].src.substr(0,10)=="data:image") continue;
       if($(images[x]).attr("data-src")){
        console.log('data-src',$(images[x]).attr("data-src"));
        match(x,$(images[x]).attr("data-src"));
       }else{
        console.log('src',images[x].src);
        match(x,images[x].src);
       }
}


