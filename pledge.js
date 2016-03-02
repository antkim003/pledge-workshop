'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:


var $Promise = function(){
  this.state = 'pending';
  this.handlerGroups = [];
};

$Promise.prototype.then = function(successcb, errorcb) {
  if (typeof successcb != 'function') {
    successcb = null;
  }
  if (typeof errorcb != 'function') {
    errorcb = null;
  }
  var obj = {
    successCb: successcb,
    errorCb: errorcb
  };
  this.handlerGroups.push(obj);
  this.callHandler();
};
$Promise.prototype.callHandler = function() {
  if (this.state === 'pending') {
    return;
  }
  var state = this.state === 'resolved' ? 'successCb' : 'errorCb';
  if (this.handlerGroups.length > 0) {
    for (var i = 0; i < this.handlerGroups.length; i++) {
      if (this.handlerGroups[i][state]) {
        this.handlerGroups[i][state](this.value);  
      }
    }
    this.handlerGroups = [];
  }
};

$Promise.prototype.catch = function(errorcb) {
  this.then(null, errorcb);
};

var Deferral = function(){
  this.$promise = new $Promise;
};

Deferral.prototype.resolve = function(data) {
  if (!(this.$promise.state === 'pending')) {
    return;
  }

  this.$promise.value = data;
  this.$promise.state = 'resolved';
  this.$promise.callHandler();
};

Deferral.prototype.reject = function(reason) {
  if (!(this.$promise.state === 'pending')) {
    return;
  }

  this.$promise.value = reason;
  this.$promise.state = 'rejected';
  this.$promise.callHandler(); 
};

function defer() {
  return new Deferral;
}


/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
