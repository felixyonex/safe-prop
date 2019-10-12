import { SafeProp } from "..";
import mockConsole from 'jest-mock-console';

test('Default mode, default return type', () => {
  const testObj = {
    a: {
      b: {
        c: {
          d: ['apple'],
        }
      }
    },
    e: null,
    f: undefined,
  };
  const sp = new SafeProp();
  expect(sp.set(testObj).f('a').f('b').f('c').f('d').f(0).val === 'apple');
  expect(sp.set(testObj).get('a.b.c.d[0]').val === 'apple');
  expect(() => sp.set(testObj).get('').get('') === undefined);
  expect(sp.set(testObj).get('a.b.c.d.0').val === 'apple');
  expect(sp.set(testObj).get('a.b.c.d[1]').val === undefined);
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
  expect(sp.set(testObj).get('e.c.d').val === null);
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
    a: undefined,
    b: null,
  }
  const restoreConsole = mockConsole();
  const sp = new SafeProp('log');
  expect(sp.set(testObj).get('a.b.c.d').val === undefined);
  expect(sp.set(testObj).f('b').f('b').f('c').f('d').val === null);
  expect(sp.set(testObj).get('') === undefined);
  expect(sp.set(testObj).get('...') === undefined);
  restoreConsole();
});

test('Strict mode: try access prop of undefined', () => {
  const testObj = {
    a: undefined
  }
  const sp = new SafeProp('strict');
  expect(() => {sp.set(testObj).get('b.a')}).toThrowError('safeProp Error: Cannot read property a of undefined!')
  expect(() => {sp.set(testObj).f('a').f('b').f('c').f('d')}).toThrowError('safeProp Error: Cannot read property b of undefined!');
  expect(() => {sp.set(testObj).get('a.b.c.d')}).toThrowError('safeProp Error: Cannot read property b of undefined!');
})

test('Strict mode: try access prop of null', () => {
  const testObj = {
    a: null
  }
  const sp = new SafeProp('strict');
  expect(() => {sp.set(testObj).f('a').f('a')}).toThrowError('safeProp Error: Cannot read property a of null!')
  expect(() => {sp.set(testObj).f('a').f('b').f('c').f('d')}).toThrowError('safeProp Error: Cannot read property b of null!');
  expect(() => {sp.set(testObj).get('a.b.c.d')}).toThrowError('safeProp Error: Cannot read property b of null!');
  expect(() => {sp.set(testObj).get('')}).toThrowError('SafeProp: Invalid input!');
})