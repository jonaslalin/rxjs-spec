import { defer, of, throwError } from 'rxjs';

describe('errors', () => {
  let nextSpy;
  let errorSpy;
  let completeSpy;

  beforeEach(() => {
    nextSpy = jest.fn();
    errorSpy = jest.fn();
    completeSpy = jest.fn();
  });

  describe('should invoke next and complete callbacks', () => {
    test('of(new Error())', () => {
      const source = of(new Error());
      source.subscribe(nextSpy, errorSpy, completeSpy);

      expect(nextSpy).toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    test(`of('it borked')`, () => {
      const source = of('it borked');
      source.subscribe(nextSpy, errorSpy, completeSpy);

      expect(nextSpy).toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('should only invoke the error callback', () => {
    test('throwError(new Error())', () => {
      const source = throwError(new Error());
      source.subscribe(nextSpy, errorSpy, completeSpy);

      expect(nextSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
      expect(completeSpy).not.toHaveBeenCalled();
    });

    test(`throwError('it borked')`, () => {
      const source = throwError('it borked'); // lacks stack trace information
      source.subscribe(nextSpy, errorSpy, completeSpy);

      expect(nextSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
      expect(completeSpy).not.toHaveBeenCalled();
    });

    test('throw new Error()', () => {
      const source = defer(() => {
        throw new Error();
      });
      source.subscribe(nextSpy, errorSpy, completeSpy);

      expect(nextSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
      expect(completeSpy).not.toHaveBeenCalled();
    });

    test(`throw 'it borked'`, () => {
      const source = defer(() => {
        throw 'it borked'; // lacks stack trace information
      });
      source.subscribe(nextSpy, errorSpy, completeSpy);

      expect(nextSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
      expect(completeSpy).not.toHaveBeenCalled();
    });
  });
});
