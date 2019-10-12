import { SafeProp } from "..";
import mockConsole from 'jest-mock-console';

test('Default mode, default return type', () => {
  const testObj = {
    a: {
      b: {
        c: {
          d: 'apple',
        }
      }
    },
    e: null,
    f: undefined,
  };
  const sp = new SafeProp();
  expect(sp.set(testObj).f('a').f('b').f('c').f('d').val === 'apple');
  expect(sp.set(testObj).get('a.b.c.d').val === 'apple');
  expect(sp.set(testObj).get('b.c.d').val === undefined);
  expect(sp.set(testObj).get('e').val === null);
  expect(sp.set(testObj).get('f').val === undefined);
})

test('Default mode, null return type', () => {
  const testObj = {
    a: {
      b: {
        c: {
          d: 'apple',
        }
      }
    },
    e: null,
  };
  const sp = new SafeProp('default', 'null');
  expect(sp.set(testObj).f('a').f('b').f('c').f('d').val === 'apple');
  expect(sp.set(testObj).get('a.b.c.d').val === 'apple');
  expect(sp.set(testObj).get('b.c.d').val === null);
  expect(sp.set(testObj).get('e.c.d').val === null);
  expect(sp.set(undefined).get('e.c.d').val === null);
  expect(sp.set(null).get('e.c.d').val === null);
});

test('Default mode, generic return type', () => {
  const testObj = {
    a: {
      b: {
        c: {
          d: 'apple',
        }
      }
    },
    e: null,
  };
  const sp = new SafeProp('default', 'generic');
  expect(sp.set(testObj).f('a').f('b').f('c').f('d').val === 'apple');
  expect(sp.set(testObj).get('a.b.c.d').val === 'apple');
  expect(sp.set(testObj).get('b.c.d').val === undefined);
  expect(sp.set(undefined).get('b.c.d').val === undefined);
  expect(sp.set(testObj).get('e.c.d').val === null);
  expect(sp.set(null).get('e.c.d').val === null);
});

test('log mode: valid property', () => {
  const testObj = {
    a: {
      b: {
        c: {
          d: 'apple',
        }
      }
    }
  }
  const sp = new SafeProp('log');
  expect(sp.set(testObj).f('a').f('b').f('c').f('d').val === 'apple');
  expect(sp.set(testObj).get('a.b.c.d').val === 'apple');
});

test('log mode: try access prop of undefined', () => {
  const testObj = {
    a: undefined
  }
  const restoreConsole = mockConsole();
  const sp = new SafeProp('log');
  expect(sp.set(testObj).get('a.b.c.d').val === undefined);
  expect(sp.set(null).f('a').f('b').f('c').f('d').val === null);
  expect(console.error).toHaveBeenCalled();
  restoreConsole();
});

test('Strict mode: try access prop of undefined', () => {
  const testObj = {
    a: undefined
  }
  const sp = new SafeProp('strict');
  expect(() => {sp.set(undefined).f('a')}).toThrowError('safeProp Error: Cannot read property a of undefined!')
  expect(() => {sp.set(testObj).f('a').f('b').f('c').f('d')}).toThrowError('safeProp Error: Cannot read property b of undefined!');
  expect(() => {sp.set(testObj).get('a.b.c.d')}).toThrowError('safeProp Error: Cannot read property b of undefined!');
})

test('Strict mode: try access prop of null', () => {
  const testObj = {
    a: null
  }
  const sp = new SafeProp('strict');
  expect(() => {sp.set(null).f('a')}).toThrowError('safeProp Error: Cannot read property a of null!')
  expect(() => {sp.set(testObj).f('a').f('b').f('c').f('d')}).toThrowError('safeProp Error: Cannot read property b of null!');
  expect(() => {sp.set(testObj).get('a.b.c.d')}).toThrowError('safeProp Error: Cannot read property b of null!');
})