import { Subject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

describe('value/error division', () => {
  let testScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('should protect consumers from error and complete', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const input1 = '-a-b-c-#          ';
      const input2 = '-----------d-e-f-|';
      const source1 = cold(input1); // private
      const source2 = cold(input2); // private

      const value$ = new Subject(); // public api
      const error$ = new Subject(); // public api
      source1.subscribe(value$.next.bind(value$), error$.next.bind(error$));
      source2.subscribe(value$.next.bind(value$), error$.next.bind(error$));

      // connect these streams to the ui (async pipe)
      expectObservable(value$).toBe('-a-b-c-----d-e-f--');
      expectObservable(error$).toBe('-------x----------', { x: 'error' });
    });
  });
});
