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
  expect(sp.set(testObj).f('a').f('b').f('c').f('d').f(0).val).toBe('apple');
  expect(sp.set(testObj).get('a.b.c.d[0]').val).toBe('apple');
  expect(sp.set(testObj).get('').val).toBe(undefined);
  expect(sp.set(testObj).get('a.b.c.d.0').val).toBe('apple');
  expect(sp.set(testObj).get('a.b.c.d[1]').val).toBe(undefined);
  expect(sp.set(testObj).get('b.c.d').val).toBe(undefined);
  expect(sp.set(testObj).get('e').val).toBe(null);
  expect(sp.set(testObj).get('f').val).toBe(undefined);
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
  expect(sp.set(testObj).f('a').f('b').f('c').f('d').val).toBe('apple');
  expect(sp.set(testObj).get('a.b.c.d').val).toBe('apple');
  expect(sp.set(testObj).get('b.c.d').val).toBe(null);
  expect(sp.set(testObj).get('e.c.d').val).toBe(null);
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
  expect(sp.set(testObj).f('a').f('b').f('c').f('d').val).toBe('apple');
  expect(sp.set(testObj).get('a.b.c.d').val).toBe('apple');
  expect(sp.set(testObj).get('b.c.d').val).toBe(undefined);
  expect(sp.set(testObj).get('e.c.d').val).toBe(null);
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
  expect(sp.set(testObj).f('a').f('b').f('c').f('d').val).toBe('apple');
  expect(sp.set(testObj).get('a.b.c.d').val).toBe('apple');
});

test('log mode: try access prop of undefined', () => {
  const testObj = {
    a: undefined,
    b: null,
  }
  const restoreConsole = mockConsole();
  const sp = new SafeProp('log');
  expect(sp.set(testObj).get('a.b.c.d').val).toBe(undefined);
  expect(sp.set(testObj).f('b').f('b').f('c').f('d').val).toBe(undefined);
  expect(sp.set(testObj).get('').val).toBe(undefined);
  expect(sp.set(testObj).get('...').val).toBe(undefined);
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

test('README test 1', () => {
  const testObj = {
    response: {
      body: {
        message: [
          {
            title: 'system',
            content: 'user info update successful',
          }
        ]
      }
    }
  }
  
  const sp = new SafeProp();

  expect(sp.set(testObj).get('request.header.date').val).toBe(undefined); // undefined
expect(sp.set(testObj).get('response.body.message[0].title').val).toBe('system'); // 'system'
  // you can use number as property
expect(sp.set(testObj).get('response.body.message.0.content').val).toBe('user info update successful'); // 'user info update successful'
  
  
  // you can run function as well
  const testFuncObj = {
    fruit: {
      methods: [
        {
          log: (fruit: string) => {
                console.log(fruit);
                return true;
                },
        }, {
          getAnother: () => {
            return 'banana';
          }
        }
      ]
    }
  }
  expect(() => sp.set(testFuncObj).get('fruit.methods[0].log').val('apple')).toBeTruthy(); // console.log('apple') and return true;
 expect(sp.set(testFuncObj).get('fruit.methods[1].getAnother').val()).toBe('banana'); // 'banana'
  
})

test('README test 2', () => {
  const testObj = {
    food: {
      fruit: {
        color: 'red',
        name: 'apple',
      }
    }
  }
  const spDefaultMode = new SafeProp(); // or const spDefaultMode = new safeProp('any string not equal to log or strict');
  expect(spDefaultMode.set(testObj).get('food.fruit.color').val).toBe('red'); // 'red'
  expect(spDefaultMode.set(testObj).get('food.vegetable.color').val).toBe(undefined); // undefined
  
  const spLogMode = new SafeProp('log'); // equal to const sp = new SafeProp(); sp.mode = 'log';
  expect(spLogMode.set(testObj).get('food.fruit.color').val).toBe('red'); // 'red'
  expect(spLogMode.set(testObj).get('food.vegetable.color').val).toBe(undefined); // console.error('safeProp Error: Cannot read property color of undefined!');
  
  const spStrictMode = new SafeProp('strict'); // equal to const sp = new SafeProp(); sp.mode = 'log';
  expect(spStrictMode.set(testObj).get('food.fruit.color').val).toBe('red');  // 'red'
  expect(() => spStrictMode.set(testObj).get('food.vegetable.color').val).toThrowError('safeProp Error: Cannot read property color of undefined!'); // throw new Error('safeProp Error: Cannot read property color of undefined!');
})

test('README test 3', () => {
const testObj = {
  a: undefined,
  b: null,
};

const spReturnUndefined = new SafeProp();
expect(spReturnUndefined.set(testObj).get('a').val).toBe(undefined); // undefined
expect(spReturnUndefined.set(testObj).get('a.value').val).toBe(undefined); // undefined
expect (spReturnUndefined.set(testObj).get('b').val).toBe(null); // null
expect(spReturnUndefined.set(testObj).get('b.value').val).toBe(undefined); // 
})

test('README test 4', () => {
  const testObj = {
    a: undefined,
    b: null,
  };
  
  const spReturnNull = new SafeProp('default', 'null'); // eqaul to: const spReturnNull = new SafeProp(); spReturnNull.returnEmptyType = 'null';
  expect(spReturnNull.set(testObj).get('a').val).toBe(undefined); // undefined
  expect(spReturnNull.set(testObj).get('a.value').val).toBe(null); // null
  expect(spReturnNull.set(testObj).get('b').val).toBe(null); // null
  expect(spReturnNull.set(testObj).get('b.value').val).toBe(null); // null
})

test('README test 5', () => {
  const testObj = {
    a: undefined,
    b: null,
  };
  
  const spReturnGeneric = new SafeProp('default', 'generic'); // eqaul to: const spReturnGeneric = new SafeProp(); spReturnGeneric.returnEmptyType = 'generic';
  expect(spReturnGeneric.set(testObj).get('a.value').val).toBe(undefined); // undefined
  expect(spReturnGeneric.set(testObj).get('a').val).toBe(undefined); // undefined
  expect(spReturnGeneric.set(testObj).get('b').val).toBe(null); // null
  expect(spReturnGeneric.set(testObj).get('b.value').val).toBe(null); // null
})
