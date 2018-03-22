var API_KEY = 'AIzaSyATtlv0ME3vEsTimOKnpE1ZH8cZyQ6VPjg';
var MAX_LABELS = 1; // Only show the top few labels for an image.
var LINE_COLOR = '#f3f315';
var googleurl = 'https://www.google';
console.log(googleurl.length);
if (document.URL.substr(0,18) == googleurl){
    console.log('google');
}
var images = document.getElementsByTagName('img'); 
console.log('there are ',images.length,'images');

chrome.storage.local.get(null, function(items) {
    var allKeys = Object.keys(items);
    console.log('keys are',allKeys);
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
var urls = [];
var count = 0;
for (var i = 0, l = images.length; i < l; i++) {
    // if (images[i].src.substr(0,10)=="data:image") {
    //   detect('LABEL_DETECTION', images[i].src, function (data) {
    //     var labels = (((data.responses || [{}])[0]).labelAnnotations || [{}]);
    //     if (labels.length === 0) {
    //       notify('No labels detected');
    //       return;
    //     }
    //     var t = '';
    //     for (var i = 0; i < labels.length && i < MAX_LABELS; i++) {
    //       // if (labels[i].description=='cat'){
    //       //   console.log('detected cat in',images[i]);
    //       // } 
    //       t += labels[i].description + ' (' + labels[i].score + ')\n';
    //        console.log('Labels detected', t ,'for',images[i]);
    //     }
    //   });

    //     console.log('b64-----',images[i].src);
    //     count++;
    // }else{
       if (images[i].src.substr(0,10)=="data:image") continue;
       if($(images[i]).attr("data-src")){
        urls.push($(images[i]).attr("data-src"));
       console.log('------data-src-------',$(images[i]).attr("data-src"))
        count++;
       }else{
        urls.push(images[i].src);
        count++;
        console.log('src',images[i].src);
       }
    
      //   var url = '';
      //   if(images[i].hasAttribute("data-src")){
      //       console.log(images[i].data)
      //   }else if(images[i].hasAttribute("src")){
      //       url = images[i].src;
      //   };
      //   detect('LABEL_DETECTION', url, function (data) {
      //   var labels = (((data.responses || [{}])[0]).labelAnnotations || [{}]);
      //   if (labels.length === 0) {
      //     notify('No labels detected');
      //     return;
      //   }
      //   var t = '';
      //   for (var i = 0; i < labels.length && i < MAX_LABELS; i++) {
      //     // if (labels[i].description=='cat'){
      //     //   console.log('detected cat in',images[i]);
      //     // } 
      //     t += labels[i].description + ' (' + labels[i].score + ')\n';
      //      //console.log('Labels detected', t);
      //   }
       
      // });
    // }
}

console.log('calculated',count,'images');
console.log(urls);

for(var i = 0 ,  l = urls.length; i < l; i++){
    //b64(urls[i], function (b64data) {
    console.log('detecting',urls[i]);
    detect('LABEL_DETECTION', urls[i] , function (data) {
        var labels = (((data.responses || [{}])[0]).labelAnnotations || [{}]);
        if (labels.length === 0) {
          notify('No labels detected');
          return;
        }
        var t = '';
        for (var i = 0; i < labels.length && i < MAX_LABELS; i++) {
          // if (labels[i].description=='cat'){
          //   console.log('detected cat in',images[i]);
          // } 
        t += labels[i].description + ' (' + labels[i].score + ')\n';
        console.log('Labels detected', t);
        }
       
      });
   // });
};


// for (var i = 0, l = images.length; i < l; i++) {
//       obj = images[i];
//       console.log(obj.src);
//       if(obj.src.substr(0,10)=='data:image') {continue}
//       //b64(images[i].src, function (b64data) {
//       detect('LABEL_DETECTION', obj.src, function (data) {
//         var labels = (((data.responses || [{}])[0]).labelAnnotations || [{}]);
//         if (labels.length === 0) {
//           notify('No labels detected');
//           return;
//         }
//         var t = '';
//         for (var i = 0; i < labels.length && i < MAX_LABELS; i++) {
//           // if (labels[i].description=='cat'){
//           //   console.log('detected cat in',images[i]);
//           // } 
//           t += labels[i].description + ' (' + labels[i].score + ')\n';
//            console.log('Labels detected', t);
//         }
       
//       });
//  // });
// }

