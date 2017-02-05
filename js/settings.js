window.onload = function(){

  var pomodoroTime, breakTime, longBreakTime, longBreakCnt, target, sound, notification, continous;


  pomodoroTime = localStorage['pomodoroTime'] ;
  breakTime = localStorage['breakTime'];
  longBreakTime = localStorage['longBreakTime'];
  longBreakCnt = localStorage['longBreakCnt'];
  target = localStorage['target'];
  sound = localStorage['sound'] === 'true' ? true: false;
  notification = localStorage['notification'] === 'true' ? true: false;
  continous = localStorage['continous'] === 'true' ? true: false;


  pomodoroTimeElem = document.getElementById('pomodoroTime');
  breakTimeElem = document.getElementById('breakTime');
  longBreakTimeElem = document.getElementById('longBreakTime');
  longBreakCntElem = document.getElementById('longBreakCnt');
  targetElem = document.getElementById('target');
  soundElem = document.getElementById('sound');
  notificationElem = document.getElementById('notification');
  continousElem = document.getElementById('continous');


  pomodoroTimeElem.value = pomodoroTime + ' minutes';
  breakTimeElem.value = breakTime + ' minutes';
  longBreakTimeElem.value = longBreakTime + ' minutes';
  longBreakCntElem.value = longBreakCnt + ' intervals';
  targetElem.value = target + ' intervals';
  soundElem.checked = sound;
  notificationElem.checked = notification;
  continousElem.checked = continous;

  const textInputs = document.querySelectorAll('.textfield');
  textInputs.forEach(input => input.addEventListener('change',parseInput));

  function parseInput(){
    // parse input as int/boolean, if it works, display it, store it in the local variable
    // need add event listener in the app.js
    switch (this.id) {
      case 'pomodoroTime':
      case 'breakTime':
      case 'longBreakTime':
        var newVal = parseInt(this.value);
        if (isNaN(newVal))
          return;
        this.value = newVal + ' minutes';
        localStorage[this.id] = newVal;
        break;
      case 'longBreakCnt':
      case 'target':
        var newVal = parseInt(this.value);
        if (isNaN(newVal))
          return;
        this.value = newVal + ' intervals';
        localStorage[this.id] = newVal;
        break;
      case 'sound':
      case 'notification':
      case 'continous':
        var newVal = this.checked;
        localStorage[this.id] = this.checked;
        console.log(this.id);

        console.log(localStorage[this.id]);
        break;
    }

  }


}
