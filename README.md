# safe-prop

an npm package to safely access the properties

Sometime the object or json has nested object properties. When trying to access a property from undefined, like:

```js
const resFromServer = {
  fruit: {
    name: 'banana',
    color: 'yellow'
  }
};
const colorOfBanana = resFromServer.fruit.color; // 'yellow'
const colorOfTomato = resFromServer.vegetable.color; //Uncaught TypeError: Cannot read property 'color' of undefined
// The following code will never be excecuted

// some code to process tomato

// some code to process banana
```

instead, we can do like this

```js

if (resFromServer && resFromServer.vegetable) {
  const colorOfTomato = resFromServer.vegetable.color;
// some code to process tomato

} else {
  // handle no vegetable
}

if (resFromServer && resFromServer.fruit) {
  const colorOfBanana = resFromServer.fruit.color;
// some code to process banana

} else {
  // handle no fruit
}
```

but if there are many nested properties, it will be like

```js
// what we want to do is just getting id from reqeust object
if (request && request.body && request.body.event &&
  request.body.event.data && request.body.event.data.new &&
  equest.body.event.data.new.id) {

} else {
  // handle no id here
  response.status = 400;
  response.error = 'invalid request';
}
```

with safe-prop, you can simplify your property check like this

```js
const sp = new SafeProp();
// even if request is an empty object
// sp.set(request).get('body.event.data.new.id').val is undefined, and no error will be thrown
if (sp.set(request).get('body.event.data.new.id').val) {

}
```

## install (not ready yet)

```bash
npm install safe-prop
```

## usage

### basic

```ts
import { SafeProp } from "safe-prop";

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
const date = testObj.request.header.date; //Uncaught TypeError: Cannot read property 'request' of undefined
const safeDate = sp.set(testObj).get('request.header.date').val; // undefined
const firstMessageTitle = sp.set(testObj).get('response.body.message[0].title').val; // 'system'
// you can use number as property
const firstMessageBody = sp.set(testObj).get('response.body.message.0.content').val; // 'user info update successful'


// you can run function as well
const testFuncObj = {
  fruit: {
    methods: [
      {
        log: (fruit) => {
              console.log(fruit);
              },
      }, {
        getAnother: () => {
          return 'banana';
        }
      }
    ]
  }
}
sp.set(testFuncObj).get('fruit.methods[0].log').val('apple'); // console.log('apple');
sp.set(testFuncObj).get('fruit.methods[1].getAnother').val(); // 'banana'
}

```

### parameters

1. mode: 'log' | 'strict' | 'default'(if not specified as previous two values)

- `log` mode: errors will be logged with console.error, like `safeProp Error: Cannot read property request of undefined!`
- `strict` mode: errors will be thrown with message, like `safeProp Error: Cannot read property request of undefined!`
- `default` mode: no errors will be logged or thrown, just return undefined (or null, if you configure `returnEmptyType`);

```js
const testObj = {
  food: {
    fruit: {
      color: 'red',
      name: 'apple',
    }
  }
}
const spDefaultMode = new SafeProp(); // or const spDefaultMode = new safeProp('any string not equal to log or strict');
spDefaultMode.set(testObj).get('food.fruit.color').val; // 'red'
spDefaultMode.set(testObj).get('food.vegetable.color').val; // undefined

const spLogMode = new SafeProp('log'); // equal to const sp = new SafeProp(); sp.mode = 'log';
spLogMode.set(testObj).get('food.fruit.color').val; // 'red'
spLogMode.set(testObj).get('food.vegetable.color'); // console.error('safeProp Error: Cannot read property color of undefined!');

const spStrictMode = new SafeProp('strict'); // equal to const sp = new SafeProp(); sp.mode = 'log';
spStrictMode.set(testObj).get('food.fruit.color').val; // 'red'
spStrictMode.set(testObj).get('food.vegetable.color').val; // throw new Error('safeProp Error: Cannot read property color of undefined!');


```

2.returnEmptyType: 'undefined'(default value) | 'null' | 'generic'

2.1 returnEmptyType: 'undefined'(default value)

```js

const testObj = {
  a: undefined,
  b: null,
};

const spReturnUndefined = new SafeProp();
const a = spReturnUndefined.set(testObj).get('a').val; // undefined
const valueOfA = spReturnUndefined.set(testObj).get('a.value').val; // undefined
const b = spReturnUndefined.set(testObj).get('b').val; // null
const valueOfB = spReturnUndefined.set(testObj).get('b.value').val; // undefined
```

2.2 returnEmptyType: 'null'

```js
const testObj = {
  a: undefined,
  b: null,
};

const spReturnNull = new SafeProp('default', 'null'); // eqaul to: const spReturnNull = new SafeProp(); spReturnNull.returnEmptyType = 'null';
const a = spReturnNull.set(testObj).get('a').val; // undefined
const valueOfA = spReturnNull.set(testObj).get('a.value').val; // null
const b = spReturnNull.set(testObj).get('b').val; // null
const valueOfB = spReturnNull.set(testObj).get('b.value').val; // null


```

2.3 returnEmptyType: 'generic'

```js
const testObj = {
  a: undefined,
  b: null,
};

const spReturnGeneric = new SafeProp('default', 'generic'); // eqaul to: const spReturnGeneric = new SafeProp(); spReturnGeneric.returnEmptyType = 'generic';
const a = spReturnGeneric.set(testObj).get('a').val; // undefined
const valueOfA = spReturnGeneric.set(testObj).get('a.value').val; // undefined
const b = spReturnGeneric.set(testObj).get('b').val; // null
const valueOfB = spReturnGeneric.set(testObj).get('b.value').val; // null


```
