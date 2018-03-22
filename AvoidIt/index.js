window.onload = function() {
  chrome.storage.local.get(null, function(items) {
    var allKeys = Object.keys(items);
    document.getElementById("tagadded").innerHTML = allKeys;
    console.log(allKeys);
  });
};
// processform.js
document.addEventListener('DOMContentLoaded', function(){
  // Bind from JS, not inline
  document.forms["tagform"].addEventListener('submit', handleIt, false );
});

function handleIt() {
    document.getElementById('tagsubmit').addEventListener('click', 
    function() {  console.log(document.getElementById('tag'));
  });
};

function readText(){
    var TestVar = document.getElementById('taginput').value;
    console.log(TestVar); alert(TestVar);
    //chrome.tabs.create({"url":"http://www.google.co.in","selected":true}, function(tab){  });
}

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('tagsubmit');
    // onClick's logic below:
    link.addEventListener('click', function() {
      var obj = {};
      obj[document.getElementById('taginput').value] = 'true';
      chrome.storage.local.set(obj, function(){});
      //alert(obj);
    });
});
chrome.storage.local.remove(["tagkey"],function(){
 var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }
})