import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

describe('subscription', () => {
  let teardown;
  let teardownSpy;
  let source: Observable<string>;
  let sourceIntervalId;

  beforeEach(() => {
    jest.useFakeTimers();

    teardown = intervalId => clearInterval(intervalId);
    teardownSpy = jest.fn(teardown);

    source = new Observable(subscriber => {
      const msg = 'Hello, Observer!';
      sourceIntervalId = setInterval(() => subscriber.next(msg), 1000);

      return () => teardownSpy(sourceIntervalId);
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('should dispose of resources from unsubscribe()', () => {
    const result = [];
    const subscription = source.subscribe(next => result.push(next));
    setTimeout(() => subscription.unsubscribe(), 5000);

    expect(teardownSpy).not.toHaveBeenCalled();
    expect(subscription.closed).toBe(false);
    expect(result.length).toBe(0);

    jest.advanceTimersByTime(5000);

    expect(teardownSpy).toHaveBeenCalledWith(sourceIntervalId);
    expect(subscription.closed).toBe(true);
    expect(result.length).toBe(5);
  });

  test('should dispose of resources from unsubscribe.next()', () => {
    const unsubscribe = new Subject();
    const result = [];
    const subscription = source
      .pipe(takeUntil(unsubscribe))
      .subscribe(next => result.push(next));
    setTimeout(() => unsubscribe.next(), 5000);

    expect(teardownSpy).not.toHaveBeenCalled();
    expect(subscription.closed).toBe(false);
    expect(result.length).toBe(0);

    jest.advanceTimersByTime(5000);

    expect(teardownSpy).toHaveBeenCalledWith(sourceIntervalId);
    expect(subscription.closed).toBe(true);
    expect(result.length).toBe(5);
  });
});
