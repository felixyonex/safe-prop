import { SafeProp } from ".."

test('Safe mode', () => {
  const testObj = {
    a: {
      b: {
        c: {
          d: 'apple',
        }
      }
    }
  }
  const sp = new SafeProp('safe');
  expect(sp.set(testObj).f('a').f('b').f('c').f('d').val === 'apple');
  expect(sp.set(testObj).get('a.b.c.d').val === 'apple');
});

test('Safe mode: try access prop from undefined', () => {
  const testObj = {
    a: undefined
  }
  const sp = new SafeProp('safe');
  expect(sp.set(testObj).f('a').f('b').f('c').f('d').val === undefined);
});

test('Default mode: try access prop from undefined', () => {
  const testObj = {
    a: undefined
  }
  const sp = new SafeProp();
  expect(() => {sp.set(undefined).f('a')}).toThrowError('safeProp Error: Cannot read property a from undefined!')
  expect(() => {sp.set(testObj).f('a').f('b').f('c').f('d')}).toThrowError('safeProp Error: Cannot read property b from undefined!');
  expect(() => {sp.set(testObj).get('a.b.c.d')}).toThrowError('safeProp Error: Cannot read property b from undefined!');
})