import { EMPTY, NEVER, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

describe('catchError() strategies', () => {
  let testScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('catch and complete', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const input = '-a-b-#';
      const source = cold(input).pipe(catchError(() => EMPTY));
      const output = '-a-b-|';

      expectObservable(source).toBe(output);
    });
  });

  it('catch and never complete', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const input = '-a-b-#';
      const source = cold(input).pipe(catchError(() => NEVER));
      const output = '-a-b------';

      expectObservable(source).toBe(output);
    });
  });

  it('catch and replace', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const input = '-a-b-#';
      const source = cold(input).pipe(catchError(() => of('c')));
      const output = '-a-b-(c|)';

      expectObservable(source).toBe(output);
    });
  });

  it('catch and rethrow', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const input = '-a-b-#';
      const source = cold(input).pipe(
        catchError(() => throwError('it borked'))
      );
      const output = '-a-b-#';
      const outputValues = { a: 'a', b: 'b' };
      const outputError = 'it borked';

      expectObservable(source).toBe(output, outputValues, outputError);
    });
  });
});
