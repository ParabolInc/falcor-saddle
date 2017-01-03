# falcor-saddle

Experimental model route generation for
[Netflix Falcor](https://netflix.github.io/falcor/) – *giddyup!*

## Overview

Netflix Falcor is a library for efficiently querying data across a network.
It presents some useful solutions for querying data from multiple datasources,
caching, and batching queries for greater performance. Yet, getting Falcor
wired up to a back-end model can take _a lot_ of repetitive code.

`falcor-saddle` is a module that will generate CRUD-like routes for you if
you give it a set of methods for accessing your model.

Instead of writing this:

```javascript
import Todo from 'model-todo';

const routes = {
  {
    route: "todos.length",
    get: (pathSet) => {
      /* repetitive implementation */
    }
  },
  {
    route: "todos[ranges]",
    get: (pathSet) => {
      /* more repetitive implementation */
    }
  },
  {
    route: "todosById[keys]",
    get: (pathSet) => {
      /* yet more repetitive implementation */
    }
  },
  /* plus routes to set, create, and delete todos... */
}
```

You can write this instead:

```javascript
import Todo from 'model-todo';
import { createRoutes } from 'falcor-saddle';

const routes = createRoutes({
  routeBasename: 'todos',
  acceptedKeys: ['id', 'createdAt', 'content'],
  getLength: async () => Todo.count().execute(),
  getRange: async (from, to) =>
    Todo.orderBy('key').slice(from, to + 1).run(),
  getById: async (id) => Todo.get(id).run(),
  update: async (oldObj, newObj) => oldObj.merge(newObj).save(),
  create: async (params) => (new Todo(params)).save(),
  delete: async (id) => Todo.get(id).delete()
}),
```

...and `falcor-saddle` will create the following routes:

   * `todos.length`: get()
   * `todos[ranges]`: get()
   * `todosById[keys]`: get(), set()
   * `todos.create`: call()
   * `todosById[keys].delete`: call()

## Usage

The usual means of using `falcor-saddle` is through its `createRoutes()`
method and pass these routes to `falcor-router` in a manner similar to this:

```javascript
import FalcorRouter from 'falcor-router';
const routes = createRoutes({ /* options */ });
const MyRouter = FalcorRouter.createClass(routes);
```

...and then wire that router up to Express:

```javascript
/* ... other express imports */
import bodyParser from 'body-parser';
import falcorExpress from 'falcor-express';

const app = express();

app.use('/model.json', bodyParser.urlencoded({extended: false}),
  falcorExpress.dataSourceRoute( (req, res, next) =>
    new MyRouter(req, res, next)
));

/* ... additional app configuration, call to app.listen() ... */
```

### createRoutes

#### Syntax

```javascript
createRoutes(options)
```

#### Params

`options` is an object with the following key parameters:

   * `routeBasename`: String, given a value like `foo` it will create routes
     like `foo.length`, `foo[range]`, `fooById[keys]`, `foo.create` and
     `foo.delete`

   * `acceptedKeys`: Array of Strings, the keys you'd like your model to
     expose. A value of `['id', 'date', 'content']` will provide access to
     the `id`, `date`, and `content` keys from a model object. Make
     sure your model actually returns those keys ;)

   * `getLength`: Function or Promise of the form `() => length`. Must
     return the number of objects provided by your model.

   * `getRange`: Function or Promise of the form
     `(from, to) => [modelObject, ...]`  where `from` and `to` are
     inclusive (i.e. (from=0, to=0) would return an Array containing the
     model object at interval 0).

   * `getById`: Function or Promise of the form `(id) => modelObject`
     where `id` is the key used to retrieve a single item from your
     model collection.

   * `update`: Function or Promise of the form
     `(oldObj, newParams) => newObj` where `oldObj` will be given as a
     model instance retrieved by your `getById` function and `newParams`
     will be a plain Object containing the key values to update. As a
     side-effect, you must save `newObj` to your model store.

   * `create`: Function or Promise of the form
     `(newParams) => newObj` where `newParams` will be a plain Object
     containing the key values used to create the new model instance. As a
     side-effect, you must save `newObj` to your model store.

   * `delete`: Function or Promise of the form `(id) => null` where `id`
     is the key used to retrieve a single item from your model collection.
     As a side-effect, you must delete the model instance with this `id`
     from your model collection.

   * `modelIdKey`: (optional) String. The primary key used by your model
     collection. Default: `'id'`.

   * `modelKeyGetter`: (optional) Function of the form
     `(model, key) => model[key]`. It's the method used by `falcor-saddle`
     to retrieve keys from your model objects outside of the methods you
     specify. Rarely used.

   * `modelIdGetter`: (optional) Function of the form
     `(model) => model['id']`. It's the method used by `falcor-saddle`
     to retrieve the primary key value from your model collection. Default:
     `(model) => modelKeyGetter(model, modelIdKey)`. Rarely used.


## Client Usage

Given a NodeJS server providing routes created by `falcor-saddle` at
`http://localhost/api/model.json`, how do you use this thing? Some examples
are given below.

### Creating the Client-side Model (HTTP):

```javascript
const model = new falcor.Model({source: new HttpDataSource('/api/model.json') });
```

### Length

```javascript
model.
  getValue('todos.length')
  .then((response) => console.log(`todos.length: ${response}`));
```

### Retrieve Range

```javascript
model
  .get('todos[0..1]["id", "content"]')
  .then((response) => {
    console.log('todos[0..1]: ' + JSON.stringify(response));
  });
```

### Set (Update) First Item

```javascript
const aTodoResponse = await model.get('todos[0]["id", "content"]');
const updateTodoReq = { json: { todosById: { } } };
updateTodoReq.json.todosById[aTodoResponse.json.todos['0'].id] = {
  content: 'this is some updated content!'
};
model.
  .set(updateTodoReq)
  .then( (response) => {
    console.log('todos[0]:' + JSON.stringify(response));
  });
```

### Get By Id

```javascript
// bd8d468d-a330-4a13-b916-9ff46be54f3e is an example primary key value:
const key = 'bd8d468d-a330-4a13-b916-9ff46be54f3e';
model.
  .get(['todosById', [key]])
  .then( (response) => {
    console.log('todosById[key]:' + JSON.stringify(response));
  });
```

### Create

```javascript
model.
  call('todos.create', [
    // Values for first item to create:
    { content: 'snow day today' }
  ],
    // Fields to retrieve from created items:
    ['id', 'content', 'createdAt']
  )
  .then( (response) => {
        console.log('todos.create: ' + JSON.stringify(response));
  });
```

### Delete

```javascript
const firstItemId = await model.getValue(['meetings', 0, 'id']);
model
  .call('todosById.delete', [firstItemId])
  .then((response) => {
    console.log('todosById.delete: ', response);
  });
```


## Caveats

### Maturity

Falcor itself is currently in preview release. This module, and the capability
it provides should be considered experimental.

We wrote it for developing our own applications, but heck, we're not sure if
if `falcor-saddle` is even a good idea. We do know that it's helped us
sketch out applications – so, at a minimum, consider it useful for that
purpose.

### Ranges

The way ranges are handled (e.g. `todo[0..n]`) is presently rather lazy.
When a new item is created with `todo.create` it is added to the end of the
range (i.e. `todo[n+1]`). When an item is deleted with `todo.delete`
rather than rebuilding, the entire range we merely invalidate the item
from the list.

This may change in the future.

### Serialization

Although Falcor provides its own serialization, there are some corner cases
where it fails: for example, we've observed returning a Date object causes
an exception to be thrown. To avoid this, we've created a simple serializer.

Model serialization is implemented in `src/serialization.js`. Your model's
return values are run through this serializer. At present, anything that's
not a:

   * Boolean or
   * Number or
   * String or
   * `null` or `undefined`

...will be serialized using `JSON.stringify()`.


## Releases

### Semantic Versioning

`falcor-saddle` uses [Semantic Versioning](http://semver.org/).

### Change Log

[CHANGELOG](https://github.com/ParabolInc/falcor-saddle/blob/master/CHANGELOG.md)

## About

### Team

`falcor-saddle` is an experiment from [Parabol](http://parabol.co). A
young company building a human operating-system for teams and organizations.

* [jordanh](https://github.com/jordanh)
* [ackernaut](https://github.com/ackernaut)

With other contributions by:

* [jrwells](https://github.com/jrwells)

### Contributing

We'd love to see this project grow.

Provide [Issues](https://github.com/ParabolInc/falcor-saddle/issues),
fork to your heart's content, and submit pull requests.

### License

[MIT](https://github.com/ParabolInc/falcor-saddle/blob/master/README.md)
