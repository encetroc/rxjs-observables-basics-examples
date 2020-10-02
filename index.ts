import { BehaviorSubject, EMPTY, from, fromEvent, interval, NEVER, Observable, of, ReplaySubject, Subject, throwError, timer } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { filter, take } from 'rxjs/operators';

//simple observable
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const result = document.getElementById('result');

btnStart.addEventListener('click', () => {
  const observable = interval(1000) 

  const observer = {
    next: function(e) {
      result.textContent = e;
    }
  };

  const subscription = observable.subscribe(observer);

  btnStop.addEventListener('click', () => subscription.unsubscribe())
});

//creating observables using of()
const btnStart_of = document.getElementById('btnStart_of');
const result_of = document.getElementById('result_of');

btnStart_of.addEventListener('click', () => {
  const observable$ = of(1, 2, 3, 4)

  console.log('results for of()')
  observable$.subscribe(e => {
    console.log(e)
    result_of.textContent = e.toString()
  })
})

//creating subscriptions
const btnStart_subscription = document.getElementById('btnStart_subscription');
const result_subscription = document.getElementById('result_subscription');

btnStart_subscription.addEventListener('click', () => {
  const data$ = of(1, 2, 3, 4)
  const empty$ = EMPTY
  const never$ = NEVER
  const error$ = throwError(new Error('Something bad just happened'))
  const time$ = interval(1000).pipe(take(3))

  console.log('results for screating subscriptions')
  const observer = {
    next: e => {
      console.log(e)
      result_subscription.textContent = e
    },
    error: error => (result_subscription.textContent = error.message),
    complete: () => (result_subscription.textContent = 'Complete')
  };

  time$.subscribe(observer);
})

//creating observables from dom events
const allButtons = document.querySelectorAll('button');
const result_fromEvent = document.getElementById('result_fromEvent');
const canvas = <HTMLCanvasElement> document.getElementById('canvas');

fromEvent(allButtons, 'click').subscribe(
  e => (result_fromEvent.textContent = e.target.textContent)
);

fromEvent(canvas, 'mousemove').subscribe((e: MouseEvent) => {
  const x = e.offsetX;
  const y = e.offsetY;
  const ctx = canvas.getContext('2d')

  ctx.fillRect(x, y, 2, 2);
});

//creating observables using timer
const btnStart_timer = document.getElementById('btnStart_timer');
const btnStop_timer = document.getElementById('btnStop_timer');
const result_timer_date = document.getElementById('result_timer_date');
const result_timer_normal = document.getElementById('result_timer_normal');

btnStart_timer.addEventListener('click', () => {
  //timer using a date
  const startTime = new Date();
  startTime.setSeconds(startTime.getSeconds() + 3);
  const sub1 = timer(startTime, 1000).subscribe(e => (result_timer_date.textContent = e.toString()));
  //normal timer, starts after 3 second
  const sub2 = timer(5000, 1000).subscribe(e => (result_timer_normal.textContent = e.toString()));

  btnStop_timer.addEventListener('click', () => {
    sub1.unsubscribe()
    sub2.unsubscribe()
  })
});

//creating observables using from()
const btnStart_from = document.getElementById('btnStart_from');
const result_from_array = document.getElementById('result_from_array');
const result_from_promise = document.getElementById('result_from_promise');

btnStart_from.addEventListener('click', () => {
  const arr = [1, 2, 3]
  const p = new Promise(resolve => setTimeout(() => resolve(42), 2000));

  from(arr).subscribe(e => result_from_array.textContent = e.toString())
  from(p).subscribe(e => result_from_promise.textContent = e.toString())
})

//using ajax
const btnFetch_ajax = document .getElementById('btnFetch_ajax')
const result_ajax = document .getElementById('result_ajax')
const url = `https://api.chucknorris.io/jokes/random`;

btnFetch_ajax.addEventListener('click', () => {
  ajax.getJSON(url).subscribe(json => result_ajax.textContent = json.value);
})

//custom observables
const btnStart_custom = document.getElementById('btnStart_custom')
const btnStop_custom = document.getElementById('btnStop_custom')
const result_custom = document.getElementById('result_custom')

function time(ms) {
  return Observable.create(subscriber => {
    const handle = setInterval(() => {
      subscriber.next(new Date().toLocaleTimeString());
    }, ms);
    return () => clearInterval(handle);
  });
}

btnStart_custom.addEventListener('click', () => {
  const subscription = time(1000).subscribe(time => result_custom.textContent = time);

  btnStop_custom.addEventListener('click', () => subscription.unsubscribe())
})

//subject
const btnStart_subject = document.getElementById('btnStart_subject')
const result_replay_subject = document.getElementById('result_replay_subject')
const result_behaviour_subject = document.getElementById('result_behaviour_subject')
const result_subject = document.getElementById('result_subject')

btnStart_subject.addEventListener('click', () => {

  // replay subject
  const replaySubject = new ReplaySubject();
  //const replaySubject = new ReplaySubject(3);
  replaySubject.next('zero')
  replaySubject.next('one')
  replaySubject.next('two')
  replaySubject.subscribe(e => result_replay_subject.textContent = result_replay_subject.textContent + ' | ' + e)
  replaySubject.next('three')
  replaySubject.next('four')

  // behaviour subject
  const behaviorSubject = new BehaviorSubject('Start');
  behaviorSubject.next('zero')
  behaviorSubject.next('one')
  behaviorSubject.next('two')
  behaviorSubject.subscribe(e => result_behaviour_subject.textContent = result_behaviour_subject.textContent + ' | ' + e)
  behaviorSubject.next('three')
  behaviorSubject.next('four')

  // normal subject
  const subject = new Subject();
  subject.next('zero')
  subject.next('one')
  subject.next('two')
  subject.subscribe(e => result_subject.textContent = result_subject.textContent + ' | ' + e)
  subject.next('three')
  subject.next('four')
})

//cold vs hot observables
const btnStart_cold = document.getElementById('btnStart_cold')
const btnStop_cold = document.getElementById('btnStop_cold')
const result_cold = document.getElementById('result_cold')
const btnStart_hot = document.getElementById('btnStart_hot')
const btnStop_hot = document.getElementById('btnStop_hot')
const result_hot = document.getElementById('result_hot')

function coldObservable() {
  return Observable.create(subscriber => {
    let count = 0;
    const handle = setInterval(() => {
      const value = count++;
      subscriber.next(value);
    }, 100);

    return () => clearInterval(handle);
  });
}

function hotObservable() {
  const subject = new Subject();
  let count = 0;
  setInterval(() => {
    const value = count++;
    subject.next(value);
  }, 100);

  return subject;
}

const cold = coldObservable();
btnStart_cold.addEventListener('click', () => {
  const coldSub = cold.subscribe(time => (result_cold.textContent = time));

  btnStop_cold.addEventListener('click', () => coldSub.unsubscribe())
});

const hot = hotObservable();
btnStart_hot.addEventListener('click', () => {
  const hotSub = hot.subscribe(time => (result_hot.textContent = time));

  btnStop_hot.addEventListener('click', () => hotSub.unsubscribe())
});