import { publishReplay, refCount, shareReplay } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

describe('replay differences', () => {
  let testScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  describe('late subscriber', () => {
    it('shareReplay(1)', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        const input = '    a---b---|    ';
        const consumer1 = '-^-!         ';
        const consumer2 = '---------^---'; // late subscriber
        const expected1 = '-a--         ';
        const expected2 = '---------(b|)';
        const source = cold(input).pipe(shareReplay(1));

        expectObservable(source, consumer1).toBe(expected1);
        expectObservable(source, consumer2).toBe(expected2);
      });
    });

    it('publishReplay(1)', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        const input = '    a---b---|         ';
        const consumer1 = '-^-!              ';
        const consumer2 = '---------^--------'; // late subscriber
        const expected1 = '-a--              ';
        const expected2 = '---------(aa)b---|'; // stream is restarted
        const source = cold(input).pipe(
          publishReplay(1),
          refCount()
        );

        expectObservable(source, consumer1).toBe(expected1);
        expectObservable(source, consumer2).toBe(expected2);
      });
    });
  });
});
