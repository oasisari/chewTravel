/*
Written by Sariwati 2017
*/
angular.module('starter.services', [])

.factory('Chats', function($http) {
  // Might use a resource here that returns a JSON array
  var stop = false;
  var suggestion = '';
  var planets = [];
  var chosenId = -1;
  var prev = -1;
  
  var greetings = [{
      id: 0,
      text: 'Hello there!'
    }, {
      id: 1,
      text: 'Hi, what are you up to?'
    }, {
      id: 2,
      text: 'Hello. I\'m a robot. How about you?'
    }, {
      id: 3,
      text: 'Hello. Nice to see you here'
    }, {
      id: 4,
      text: 'Alo alo! Can you hear me?'
    },{
      id: 5,
      text: 'Hi! I\'m fine, thanks.'
    }];
  var answers = [{
      id: 0,
      text: 'I don\'t know the answer to that yet'
    }, {
      id: 1,
      text: 'I am not sure. Let\'s talk about what you want to do for your next holiday'
    }, {
      id: 2,
      text: 'This is totally off-topic but I like seaweed..'
    }, {
      id: 3,
      text: 'The answer to that is 42. Someone told me.'
    }, {
      id: 4,
      text: 'Can you rephrase that question?'
    }, {
      id: 5,
      text: 'I don\'t know that but I know someone who has a light saber'
    }, {
      id: 6,
      text: 'I need a major software upgrade to be able to know the answer to that'
    }, {
      id: 7,
      text: 'I need to think before I can answer that.. 💤'
    }];
  var randoms = [{
      id: 0,
      text: 'Are you feeling alright?'
    }, {
      id: 1,
      text: 'Pardon?'
    }, {
      id: 2,
      text: 'Tell me more about yourself'
    }, {
      id: 3,
      text: 'My favourite planet is Naboo. Don\'t ask me why.'
    }, {
      id: 4,
      text: 'Do you know where Luke is?'
    }, {
      id: 5,
      text: 'What type of holiday would you like to have? Relaxing, exciting or boring?'
    }, {
      id: 6,
      text: 'My master is currently away. Shall we go the pub instead?'
    }, {
      id: 7,
      text: 'Do you like lobster? My master does'
    }, {
      id: 8,
      text: 'I need a patch. Where is R2-D2 when you need him?'
    }];

  return {
    stop: function() {
      stop = true;
    },
    start: function() {
      stop = false;
    },
    getQ: function() {
      return Math.round(Math.random() * 500) + 100;
    },
    getChew: function() {
      return $http.get('http://swapi.co/api/people/13/').then(function(res){
        //console.log('res ' + JSON.stringify(res));
        return res.data;
      },function(er){
        return er;
      });
    },
    setChosenId: function(v) {
      chosenId = v;
    },
    getChosenId: function() {
      return chosenId;
    },
    getChosenPlanet: function() {
      var d = (Math.round(Math.random() * planets[chosenId].name.length) + 1) * +new Date();
      planets[chosenId].distance = d;
      planets[chosenId].duration = Math.round(Math.random() * planets[chosenId].name.length) + 2;
      planets[chosenId].que = Math.round(Math.random() * 500) + 100;
      return planets[chosenId];
    },
    makeBooking: function(p) {
      console.log('index ' + planets.indexOf(p));
      chosenId = planets.indexOf(p);
    },
    getPlanets: function() {
      return planets;
    },
    initPlanets: function() {
      return $http.get('http://swapi.co/api/planets/').then(function(res){
        var next = res.data.next;
        planets = res.data.results;
        //console.log('next = ' + next);
        return $http.get(next).then(function(res2){
          next = res2.data.next;
          planets = planets.concat(res2.data.results);
          return $http.get(next).then(function(res3){
            next = res3.data.next;
            planets = planets.concat(res3.data.results);
            return $http.get(next).then(function(res4){
              //next = res3.data.next;
              planets = planets.concat(res4.data.results);
              console.log('planets = ' + planets.length);
            }, function(err4){
              console.log('planets error4 = ' + JSON.stringify(err4));
            });
          }, function(err3){
            console.log('planets error3 = ' + JSON.stringify(err3));
          });
        }, function(err2){
          console.log('planets error2 = ' + JSON.stringify(err2));
        });
      },function(err){
        console.log('planets error = ' + JSON.stringify(err));
      });
      
    },
    sendQ: function(q, u) {
      suggestion = '';
      //console.log('q = ' + q);
      if (!stop) {
        if (this.isGreeting(q)) {
          return this.replyGreeting(q);
        } else if (this.isHolidayType(q)) {
          return this.replyHolidayType();
        } else if (this.isPlanet(q)) {
          return this.replyPlanet();
        } else if (this.isReaction(q)) {
          return this.replyReaction();
        } else if (this.isQuestion(q)) {
          return this.replyQuestion(q);
        } else if (this.isExclaim(q)) {
          return this.replyExclaim(q);
        } else if (this.isEmoji(q)) {
          return this.replyEmoji(q);
        } else {
          return this.replyRandom();
        }
      } 
    },
    isGreeting: function(q) {
      if (q.toLowerCase().indexOf('hello') != -1) {
        return true;
      } else if (q.toLowerCase().indexOf('how are you') != -1) {
        suggestion = 5;
        return true;
      } else if (q.toLowerCase().indexOf('how') != -1 && q.toLowerCase().indexOf('it going') != -1) {
        suggestion = 5;
        return true;
      } else if (q.toLowerCase().indexOf('how') != -1 && q.toLowerCase().indexOf('you doing') != -1) {
        suggestion = 5;
        return true;
      } else if (q.toLowerCase().indexOf('what\'s up') != -1) {
        return true;
      } else if (q.toLowerCase().startsWith('hi')) {
        return true;
      } 
      else {return false;}
    },
    replyGreeting: function(q) {
      if (suggestion != '') {
        return greetings[suggestion].text;  
      }
      var r = Math.round(Math.random() * (greetings.length -1));
      if (r == prev) {
        if (r < (greetings.length - 2)) {r++;}
        else { r--;}
      }
      prev = r;
      return greetings[r].text;
    },
    isPlanet: function(q) {
      for (var i = 0; i < planets.length; i++) {
        if (planets[i].name.toLowerCase() == q.toLowerCase()) {
          chosenId = i;
          return true;
        }
      }
      return false;
    },
    replyPlanet: function(){
      return 'Great. I will arrange the itinerary to Planet ' + planets[chosenId].name + '. Please check next page for more details.'; 
    },
    isHolidayType: function(q) {
      //breakdown question
      if (q.toLowerCase().indexOf('relaxing') != -1) {
        suggestion = 1; 
        return true;
      } else if(q.toLowerCase().indexOf('exciting') != -1) {
        suggestion = 2;
        return true;
      } else if (q.toLowerCase().indexOf('boring') != -1) {
        suggestion = 3;
        return true;
      } else if (q.toLowerCase().startsWith('whatever')) {
        suggestion = 4;
        return true;
      } 
      return false;
    },
    replyHolidayType: function(q) {
      var choices = [];
      if (suggestion == 1) {
        for(var i = 0; i < planets.length; i++) {
          if ((planets[i].climate.indexOf('temperate') != -1) && (planets[i].terrain.indexOf('grass') != -1 ||planets[i].terrain.indexOf('mountain') != -1)) {
            choices.push(planets[i]);
          }
        }
        return choices;
      } else if (suggestion == 2) {
        for(var i = 0; i < planets.length; i++) {
          if (planets[i].terrain.indexOf('jungle') != -1 || planets[i].terrain.indexOf('desert') != -1 || planets[i].terrain.indexOf('volcano') != -1 || planets[i].terrain.indexOf('cave') != -1) {
            choices.push(planets[i]);
          }
        }
        return choices;
      } else if (suggestion == 3) {
        for(var i = 0; i < planets.length; i++) {
          if ((planets[i].climate.indexOf('temperate') != -1) && (planets[i].terrain.indexOf('city') != -1 ||planets[i].terrain.indexOf('urban') != -1)) {
            choices.push(planets[i]);
          }
        }
        return choices;
      } else {
        for(var i = 0; i < planets.length; i++) {
          if (planets[i].climate.indexOf('temperate') == -1) {
            choices.push(planets[i]);
          }
        }
        return choices;
      }
    },
    isQuestion: function(q) {
      //breakdown question
      if (q.indexOf('?') != -1 || q.toLowerCase().startsWith('what') || q.toLowerCase().startsWith('where') || q.toLowerCase().startsWith('how')) {
        return true;
      } else if (q.toLowerCase().startsWith('why')) {
        suggestion = 1;
        return true;
      } else if (q.toLowerCase().startsWith('when')){
        suggestion = 2;
        return true;
      } else if (q.toLowerCase().startsWith('do you')){
        suggestion = 3;
        return true;
      }
      return false;
    },
    replyQuestion: function(q) {
      var c = 0;
      var r = Math.round(Math.random() * answers.length);
      if (r == answers.length) { r -= 1;}
      if (r == prev) {
        if (r < (answers.length - 1)) {r++;}
        else { r--;}
      }
      prev = r;
      if (suggestion == 1) {
        return 'You will find the answer within';
      } else if (suggestion == 2) {
        return 'When hell freezes over..';
      } else if (suggestion == 3) {
        if (count > 0 && count % 2 == 0) {
          count++;
          return 'Yes, I do like green tea with milk foam. Um, sorry, what was the question again?';  
        } else {
          count++;
          return 'No, I do not like nougats. Who does?';
        }      
      } else {
        return answers[r].text;
      }
    },
    isReaction: function(q) {
      if (q.toLowerCase() == 'no' || q.toLowerCase().startsWith('nope') || q.toLowerCase().startsWith('not good')) {
        suggestion = 1;
        return true;
      } else if (q.toLowerCase().startsWith('ok') || q.toLowerCase().startsWith('nice') || q.toLowerCase().startsWith('good') || q.toLowerCase().startsWith('great')) { 
        suggestion = 2;
        return true;
      } else if (q.toLowerCase().startsWith('thank')) {
        suggestion = 3;
        return true;
      } else if (q.toLowerCase().startsWith('lol')) {
        suggestion = 4;
        return true;
      } else {
        return false;  
      }
    },
    replyReaction: function() {
      if (suggestion == 1) {
        return 'Okay then. Do you want to change the type of holiday to something else? Relaxing, exciting or boring?';
      } else if (suggestion == 2){
        return 'Please select the planet you want to go to and click the Book button..';
      } else if (suggestion == 3) {
        return 'You are welcome! It\'s a pleasure to serve you, nice human.';
      } else {
        return 'Ha ha ha so funny I\'m slapping my thigh';
      }
    },
    isExclaim: function(q) {
      if (q.indexOf('!') != -1) {
        return true;
      } else if (q.indexOf('annoy') != -1 || q.indexOf('uck') != -1) {
        return true;
      } else if (q.indexOf('hate') != -1 || q.indexOf('dislike') != -1) {
        return true;
      } else if (q.indexOf('really') != -1 || q.indexOf('damn') != -1) {
        return true;
      }
      return false;
    },
    replyExclaim: function(q) {
      return 'Whoa, you sound a bit excited there';
    },
    isEmoji: function(q) {
      var ranges = [
          '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
          '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
          '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
      ];
      if (q.match(ranges.join('|'))) {
          return true;
      } else {
          return false;
      }
    },
    replyEmoji: function(q) {
      return '🎉';
    },
    replyRandom: function() {
      var r = Math.round(Math.random() * randoms.length);
      if (r == randoms.length) { r -= 1;}
      if (r == prev) {
        if (r < (randoms.length - 1)) {r++;}
        else { r--;}
      }
      prev = r;
      return randoms[r].text;
    }
  };
});
