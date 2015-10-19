// Source: https://s3.amazonaws.com/mturk-public/externalHIT_v1.js
function turkGetParam( name, defaultValue ) { 
    var regexS = "[\?&]"+name+"=([^&#]*)"; 
    var regex = new RegExp( regexS ); 
    var tmpURL = window.location.href; 
    var results = regex.exec( tmpURL ); 
    if( results == null ) { 
        return defaultValue; 
    } else { 
        return results[1];    
    } 
}

var turkParams = {};

(function() {
    var url = window.location.href,
      src = param(url, "assignmentId") ? url : document.referrer,
      keys = ["assignmentId","hitId","workerId","turkSubmitTo"];
  
  keys.map(function(key) {
    turkParams[key] = unescape(param(src, key));
  });
})();

function UTWorkerLimitReached(ut_id, workerId, assignmentId) {
    var assignmentId = assignmentId || turkParams['assignmentId'];
    if (assignmentId != '' && assignmentId != 'ASSIGNMENT_ID_NOT_AVAILABLE') {
        var workerId = workerId || turkParams['workerId'];
        var url = '//uniqueturker.myleott.com/'+ut_id+'/'+workerId+'/'+assignmentId;

            var request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send();
            response = request.responseText;
    }
    return false;
}