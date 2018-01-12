'use strict';
var Alexa = require("alexa-sdk");

// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build

// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-west-1'});
var ec2 = new AWS.EC2();


exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var find_instance = function(name, self, handler) {
    var params = {
        Filters: [
            {
                Name: 'tag:Name',
                Values: [
                    name,
                    /* more items */
                ]
            },
            /* more items */
        ]
    };
    ec2.describeInstances(params, function(err, data) {
        if (err) {
            self.response.speak('Error calling describe instances!');
            self.emit(':responseReady');
            console.log(err, err.stack); // an error occurred
        } else {
            console.log(data);           // successful response
            var res = data.Reservations;
            if (res.length > 0) {
                var inst = res[0].Instances;
                if (inst.length > 0) {
                    handler(inst[0]);
                } else {
                    self.response.speak('I couldn\'t find any instances tagged ' + name);
                    self.emit(':responseReady');
                }
            } else {
                self.response.speak('I couldn\'t find any reservations tagged ' + name);
                self.emit(':responseReady');
            }
        }
    });
};

var handlers = {
    'LaunchRequest': function () {
        console.log('Launch request');
        this.emit('SayHello');
    },
    'IsItOnIntent': function () {
        var self = this;
        var name = this.event.request.intent.slots.name.value;
        console.log('IsItOnIntent');
        find_instance(name, self, function(instance) {
            var state = instance.State.Name;
            self.response.speak('Your instance ' + name + ' is ' + state);
            self.emit(':responseReady');
        });
    },
    'IPIntent': function () {
        var self = this;
        var name = this.event.request.intent.slots.name.value;
        console.log('IPIntent');
        find_instance(name, self, function(instance) {
            var state = instance.State.Name;
            var ip = instance.PublicIpAddress;
            if (state == 'running') {
                self.response.speak('Your instance ' + name + ' is on ' + ip);
                self.emit(':responseReady');
            } else {
                self.response.speak('I can\'t give you the address because your instance ' + name + ' is ' + state);
                self.emit(':responseReady');
            }
        });
    },
    'UptimeIntent': function () {
        var self = this;
        var name = this.event.request.intent.slots.name.value;
        console.log('UptimeIntent');
        find_instance(name, self, function(instance) {
            var state = instance.State.Name;
            if (state == 'running') {
                var now = new Date();
                var uptime = Math.ceil((now.getTime() - instance.LaunchTime.getTime()) / (1000 * 3600));
                self.response.speak('Your instance ' + name + ' has been on for ' + uptime + ' hours');
                self.emit(':responseReady');
            } else {
                self.response.speak('I can\'t check uptime because your instance ' + name + ' is ' + state);
                self.emit(':responseReady');
            }
        });
    },
    'StartIntent': function () {
        var self = this;
        var name = this.event.request.intent.slots.name.value;
        console.log('IsItOnIntent');
        find_instance(name, self, function(instance) {
            var state = instance.State.Name;
            if (state == 'stopped') {
                var params = {
                    InstanceIds: [ instance.InstanceId ]
                };
                ec2.startInstances(params, function(err, data) {
                    if (err) {
                        self.response.speak('Your instance ' + name + ' could not be started');
                        self.emit(':responseReady');
                        console.log(err, err.stack); // an error occurred
                    } else {
                        self.response.speak('Your instance ' + name + ' is now starting');
                        self.emit(':responseReady');
                        console.log(data);           // successful response
                    }
                });
            } else {
                self.response.speak('I can\'t start instance ' + name + ' because it is ' + state);
                self.emit(':responseReady');
            }
        });
    },
    'StopIntent': function () {
        var self = this;
        var name = this.event.request.intent.slots.name.value;
        console.log('IsItOnIntent');
        find_instance(name, self, function(instance) {
            var state = instance.State.Name;
            if (state == 'running') {
                var params = {
                    InstanceIds: [ instance.InstanceId ]
                };
                ec2.stopInstances(params, function(err, data) {
                    if (err) {
                        self.response.speak('Your instance ' + name + ' could not be stopped');
                        self.emit(':responseReady');
                        console.log(err, err.stack); // an error occurred
                    } else {
                        self.response.speak('Your instance ' + name + ' is now stopping');
                        self.emit(':responseReady');
                        console.log(data);           // successful response
                    }
                });
            } else {
                self.response.speak('I can\'t stop instance ' + name + ' because it is ' + state);
                self.emit(':responseReady');
            }
        });
    },
    'SayHello': function () {
        this.response.speak('Hello!');
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: 'alexa, hello world' or 'alexa, ask hello world my" +
            " name is awesome Aaron'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, hello world'" +
            " or 'alexa, ask hello world my name is awesome Aaron'");
    }
};
