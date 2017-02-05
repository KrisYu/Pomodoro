// TODO: 1.click to start
//       2.click to pause
//       3.update correct time left
//       4.print pomodoro


const draw = {
  radius : 100,
  circleTopMargin : 25,
  lineWidth : 6,
  triangleEdge : 30,
  triangleLineWidth : 3,
  resetRaidus : 10,
  resetLineWidth : 2,
  resetCrossLength : 4,
  workColor : '#ff9999',
  restColor : '#53bc95',
  plainColor : '#a9a9a9',
  blackColor : '#a8a8a8',

};



window.onload = function(){

  var canvas = document.getElementById('myCanvas');
  var pomodoroTime, breakTime, longBreakTime, longBreakCnt, target, sound, notification, continous;

  var myPomodoro = new Pomodoro();

  if (localStorage['pomodoroTime'] == undefined) {
    initPomodoroSettings();
  }
  setPomodoro();


  function initPomodoroSettings() {
    localStorage['pomodoroTime'] = 25;
    localStorage['breakTime'] = 5;
    localStorage['longBreakTime'] = 15;
    localStorage['longBreakCnt'] = 4;
    localStorage['target'] = 10;
    localStorage['sound'] = true;
    localStorage['notification'] = true;
    localStorage['continous'] = false;
  }

  function setPomodoro() {
    pomodoroTime = localStorage['pomodoroTime'] ;
    breakTime = localStorage['breakTime'];
    longBreakTime = localStorage['longBreakTime'];
    longBreakCnt = localStorage['longBreakCnt'];
    target = localStorage['target'];
    sound = localStorage['sound'] === 'true' ? true: false;
    notification = localStorage['notification'] === 'true' ? true: false;
    continous = localStorage['continous'] === 'true' ? true: false;

    myPomodoro = new Pomodoro(pomodoroTime, breakTime, longBreakTime, longBreakCnt, target, sound, notification, continous);
  }


  function updatePomodoro(){
    pomodoroTime = localStorage['pomodoroTime'] ;
    breakTime = localStorage['breakTime'];
    longBreakTime = localStorage['longBreakTime'];
    longBreakCnt = localStorage['longBreakCnt'];
    target = localStorage['target'];
    sound = localStorage['sound'] === 'true' ? true: false;
    notification = localStorage['notification'] === 'true' ? true: false;
    continous = localStorage['continous'] === 'true' ? true: false;

    myPomodoro.pomodoroTime = pomodoroTime * 60;
    myPomodoro.breakTime = breakTime * 60;
    myPomodoro.longBreakTime = longBreakTime * 60;
    myPomodoro.longBreakCnt = longBreakCnt;
    myPomodoro.target = target;
    myPomodoro.sound = sound;
    myPomodoro.notification = notification;
    myPomodoro.continous = continous;

    myPomodoro.reset();
    myPomodoro.totalCycleTime = myPomodoro.pomodoroTime;
    myPomodoro.updateDisplay(myPomodoro.pomodoroTime);
  }




  canvas.addEventListener('click', function(e){
    // should also minus circle's center
    var x = e.pageX - this.offsetLeft - (canvas.width / 2),
        y = e.pageY - this.offsetTop - (draw.circleTopMargin + draw.radius);

    // click inside the reset button
    var x1 = e.pageX - this.offsetLeft - (canvas.width / 2 + draw.radius),
        y1 = e.pageY - this.offsetTop - (draw.circleTopMargin);

    // console.log(x,y);
    if (x * x + y * y < draw.radius * draw.radius) {
      if (myPomodoro.state == 1 || myPomodoro.state == 0) {
        myPomodoro.start();
      } else {
        myPomodoro.pause();
      }
    }
    else if (x1 * x1 + y1 * y1 < draw.resetRaidus * draw.resetRaidus) {
      if (confirm('Are you sure you want skip the current interval?')) {
        myPomodoro.reset();
      }
    }
  });




  var settings = document.getElementById('settings');
  settings.addEventListener('click',function(e){

    var gui = require('nw.gui');
    var params = {resizable: false, height: 400, width: 350};
    var about_win = gui.Window.open('settings.html',params);
  });


  window.addEventListener('storage',function(){
    console.log('something happend');
    updatePomodoro();
  });

  // for hot keys
  var gui = require('nw.gui');
  var shortcut1 = new gui.Shortcut({
    key : "Ctrl+P",
    active : function() {
      myPomodoro.pause();
    }
  });

  var shortcut2 = new gui.Shortcut({
    key : "Ctrl+S",
    active : function(){
      myPomodoro.start();
    }
  })
  gui.App.registerGlobalHotKey(shortcut1);
  gui.App.registerGlobalHotKey(shortcut2);



}
