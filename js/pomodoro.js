
// State:
// 0: Initial state
// 1: Paused
// 2: Running a pomodoro cycle
// 3: Running a break cycle
// 4: Running a long break

var Pomodoro = function(pomodoroTime, breakTime, longBreakTime, longBreakCnt, target, sound, notification, continous){
  /*
    sound - string , wheter has sound when cycle ends;
    notification - boolean, use desktop notification or not;
    continous - start work/break continously;
  */

  this.pomodoroTime = pomodoroTime * 60 ;
  this.breakTime = breakTime * 60; // minutes
  this.longBreakTime = longBreakTime * 60;
  this.longBreakCnt = longBreakCnt;
  this.target = target;

  // all bealean variables as settings
  this.sound = sound;
  this.notification = notification;
  this.continous = continous;

  this.pomodoroCnt = 0; // how many pomodoro passed
  this.state = 0 ; // Initial state.
  this.lastState = 2; //
  this.timeLeft = pomodoroTime * 60;

  this.totalCycleTime = pomodoroTime * 60;
  this.updateDisplay(this.pomodoroTime);
}


Pomodoro.prototype.start = function(){
  var self = this;
  if (this.state == 0 || this.state == 1) {
    this.newState(this.lastState);
    tick(self.notification);
    this.timer = setInterval(function(){
      tick(self.notification);
    },1000);
  }
  function tick(notification){
    self.timeLeft = self.timeLeft - 1;
    self.updateDisplay(self.timeLeft);

    if (self.timeLeft == 0) {
      // entering next state
      if (self.state == 2) {
        self.pomodoroCnt++;
        // used to display
        document.getElementById('pomodoroCnt').innerHTML =  self.pomodoroCnt + ' / ' + self.target;
        if (self.pomodoroCnt % self.longBreakCnt == 0 ) {
          self.timeLeft = self.longBreakTime;
          self.state = 4;
          if (notification) {
            self.notifyme('Long break - WALK AROUND!');
          }
        } else {
          self.timeLeft = self.breakTime;
          self.state = 3;
          if (notification) {
            self.notifyme('Short break - STAND UP!');
          }
        }
      } else {
        self.timeLeft = self.pomodoroTime;
        self.state = 2;
        if (notification) {
          self.notifyme('WORK WORK!');
        }
      }
      console.log(self.sound);

      if (self.sound)
      {
        var audio = new Audio('resources/beep.ogg');

        var playPromise = audio.play();

        // In browsers that don’t yet support this functionality,
        // playPromise won’t be defined.
        if (playPromise !== undefined) {
          playPromise.then(function() {
            // Automatic playback started!
            console.log('should be played');
          }).catch(function(error) {
            // Automatic playback failed.
            // Show a UI element to let the user manually start playback.
            console.log('failed');
          });
        }
      }
      self.newState(self.state);
      if (! self.continous) {
        self.pause();
      }
    }
  }
}


Pomodoro.prototype.notifyme = function(message){
  if (Notification.permission === "granted") {
    var notification = new Notification(message,{
      icon : 'resources/tomato.png'
    });
    setTimeout(function() { notification.close(); }, 5000);
  } else {
    Notification.requestPermission();
  }
}



Pomodoro.prototype.pause = function(){
  if (this.state == 2 || this.state == 3 || this.state == 4) {
    this.newState(1);
    clearInterval(this.timer);
  }
}

Pomodoro.prototype.reset = function(){
  this.newState(0);
  this.timeLeft = this.pomodoroTime;
  clearInterval(this.timer);
  this.updateDisplay(this.timeLeft);
}

Pomodoro.prototype.updateDisplay = function(time){

  context.clearRect(0, 0, canvas.width, canvas.height);

  var strokeColor;

  if (this.state == 2 || this.state == 0 || (this.state == 1 && this.lastState == 2)) {
    strokeColor = draw.workColor;
  }
  else if (this.state == 3 || this.state == 4 || (this.state == 1 && this.lastState == 3) || (this.state == 1 && this.lastState == 4) ) {
    strokeColor = draw.restColor;
  }

  // console.log('this.state', this.state);
  // console.log('total',total);
  var percent =  100 - time * 100 / this.totalCycleTime ;
  // console.log('percent', percent);
  var startAngel = 1.5 * Math.PI;
  var endAngel = (2 * Math.PI) *  percent / 100 ;


  // draw puse button if pause, else
  context.lineWidth = draw.triangleLineWidth;
  context.fillStyle = strokeColor;
  context.strokeStyle = strokeColor;
  if (this.state == 1 || this.state == 0 ) {
    context.moveTo(canvas.width / 2 + draw.triangleEdge/2, draw.radius * 2 - draw.triangleEdge );
    context.lineTo(canvas.width / 2 - draw.triangleEdge/2, draw.radius * 2 - draw.triangleEdge * 3/2 );
    context.lineTo(canvas.width / 2 - draw.triangleEdge/2, draw.radius * 2 - draw.triangleEdge * 1/2 );
    context.lineTo(canvas.width / 2 + draw.triangleEdge/2, draw.radius * 2 - draw.triangleEdge);
    context.stroke();
  } else {
    context.moveTo(canvas.width / 2 - draw.triangleEdge/3,draw.radius * 2 - draw.triangleEdge * 3/2);
    context.lineTo(canvas.width / 2 - draw.triangleEdge/3, draw.radius * 2 - draw.triangleEdge * 1/2 );
    context.moveTo(canvas.width / 2 + draw.triangleEdge/3,draw.radius * 2 - draw.triangleEdge * 3/2);
    context.lineTo(canvas.width / 2 + draw.triangleEdge/3,draw.radius * 2 - draw.triangleEdge * 1/2);
    context.stroke();
  }


  // draw rest button
  // console.log(this.state);
  // console.log(this.state !== 0);
  if (this.state !== 0) {

    context.beginPath();
    context.arc(canvas.width/2 + draw.radius, draw.circleTopMargin, draw.resetRaidus, 0 , Math.PI * 2);
    context.strokeStyle = draw.blackColor;
    context.lineWidth = draw.resetLineWidth;
    context.lineCap = 'round';
    context.closePath();
    context.stroke();

    context.moveTo(canvas.width/2 + draw.radius - draw.resetCrossLength, draw.circleTopMargin - draw.resetCrossLength);
    context.lineTo(canvas.width/2 + draw.radius +  draw.resetCrossLength, draw.circleTopMargin +  draw.resetCrossLength);
    context.stroke();

    context.moveTo(canvas.width/2 + draw.radius + draw.resetCrossLength, draw.circleTopMargin - draw.resetCrossLength);
    context.lineTo(canvas.width/2 + draw.radius -  draw.resetCrossLength, draw.circleTopMargin +  draw.resetCrossLength);
    context.stroke();
  }




  // text
  context.beginPath();
  context.font = '48px sans-serif';
  context.textBaseline = 'mid';
  context.textAlign = 'center';
  context.lineWidth = draw.lineWidth;
  context.font = 'sans-serif';
  context.fillText(getFormattedTime(time), canvas.width/2, draw.radius + draw.circleTopMargin);



  // finished part
  context.beginPath();
  context.arc(canvas.width / 2, draw.radius + draw.circleTopMargin, draw.radius, startAngel, startAngel + endAngel );
  context.strokeStyle = draw.plainColor;
  context.lineWidth = draw.lineWidth;
  context.lineCap = 'round';
  context.stroke();

  // unfished part
  var unstartAngel = percent == 0 ? -1.5 * Math.PI : startAngel + endAngel;
  context.beginPath();
  context.arc(canvas.width / 2, draw.radius + draw.circleTopMargin , draw.radius, unstartAngel, 1.5 * Math.PI);
  context.strokeStyle = strokeColor;
  context.lineWidth = draw.lineWidth;
  context.lineCap = "round";
  context.stroke();


  // draw a marker or not ?



  function getFormattedTime(seconds){
    var minsLeft = Math.floor(seconds / 60);
        secondsLeft = seconds - (minsLeft * 60);

    return zeroPad(minsLeft) + ':' + zeroPad(secondsLeft);

    function zeroPad(number){
      return number < 10 ? '0' + number : number;
    }
  }

}



Pomodoro.prototype.newState = function(state){
  this.lastState = this.state;
  this.state = state;
  var message;
  switch (state) {
    case 0:
      this.lastState = 2;
      console.log('New state set: Initial state');
      break;
    case 1:
      console.log('New sate set: Paused');
      break;
    case 2:
      console.log('New state set: Pomodoro Cycle');
      this.totalCycleTime = this.pomodoroTime;
      message = 'WORK WORK!';
      break;
    case 3:
      console.log('New state set: Break Cycle');
      this.totalCycleTime = this.breakTime;
      message = 'STAND UP!';
      break;
    case 4:
      console.log('New state set: Long Break Cycle');
      this.totalCycleTime = this.longBreakTime;
      message = 'WALK AROUND';
      break;
  }
  this.updateDisplay(this.timeLeft, message);
}



var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');




// alert('1');
// myPomodoro.start();
