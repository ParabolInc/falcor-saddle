import chai from 'chai';

import { createGetLengthRoute,
				 createGetRangesRoute,
			   createGetByIdRoute 	 } from '../src/index';

chai.use(chaiAsPromised);
const should = chai.should();

export function getCore(model) {
	describe("get core", function() {
		describe('createGetLengthRoute', function() {
	    it('exists', function () {
	      should.exist(createGetLengthRoute);
	    });

	    it('routes', async function () {
	      const app = express();

	      // What "length" to return for the test route:
	      const modelPromise = async () => 42;

	      // Create falcor route:
	      const routes = [ createGetLengthRoute('test', modelPromise) ];
	      const Router = FalcorRouter.createClass(routes);
	      app.use('/model.json', bodyParser.urlencoded({extended: false}),
	        falcorExpress.dataSourceRoute( () => new Router()
	      ));

	      // Wait for express server to start:
	      await app.listen(SERVER_PORT, function server() {
	        console.log('Test server listening at port %s', SERVER_PORT);
	      });

	      // Initialize Falcor HTTP client:
	      const model = new Falcor.Model(
	        { source: new HttpDataSource(FALCOR_MODEL_URL) });

	      // Test!
	      return model.getValue('test.length').should.eventually.equal(42);
	    });

			it('creates', async function () {
	      const app = express();

	      // What "length" to return for the test route:
	      const modelPromise = async () => 42;

	      // Create falcor route:
	      const routes = [ createGetLengthRoute('test', modelPromise) ];
	      const Router = FalcorRouter.createClass(routes);
	      app.use('/model.json', bodyParser.urlencoded({extended: false}),
	        falcorExpress.dataSourceRoute( () => new Router()
	      ));

	      // Wait for express server to start:
	      await app.listen(SERVER_PORT, function server() {
	        console.log('Test server listening at port %s', SERVER_PORT);
	      });

	      // Initialize Falcor HTTP client:
	      const model = new Falcor.Model(
	        { source: new HttpDataSource(FALCOR_MODEL_URL) });

	      // Test!
	      return model.getValue('test.length').should.eventually.equal(42);
	    });

			it('returns nice things when successful', async function () {
	      const app = express();

	      // What "length" to return for the test route:
	      const modelPromise = async () => 42;

	      // Create falcor route:
	      const routes = [ createGetLengthRoute('test', modelPromise) ];
	      const Router = FalcorRouter.createClass(routes);
	      app.use('/model.json', bodyParser.urlencoded({extended: false}),
	        falcorExpress.dataSourceRoute( () => new Router()
	      ));

	      // Wait for express server to start:
	      await app.listen(SERVER_PORT, function server() {
	        console.log('Test server listening at port %s', SERVER_PORT);
	      });

	      // Initialize Falcor HTTP client:
	      const model = new Falcor.Model(
	        { source: new HttpDataSource(FALCOR_MODEL_URL) });

	      // Test!
	      return model.getValue('test.length').should.eventually.equal(42);
	    });

			it('returns nice things when unsuccessful', async function () {
	      const app = express();

	      // What "length" to return for the test route:
	      const modelPromise = async () => 42;

	      // Create falcor route:
	      const routes = [ createGetLengthRoute('test', modelPromise) ];
	      const Router = FalcorRouter.createClass(routes);
	      app.use('/model.json', bodyParser.urlencoded({extended: false}),
	        falcorExpress.dataSourceRoute( () => new Router()
	      ));

	      // Wait for express server to start:
	      await app.listen(SERVER_PORT, function server() {
	        console.log('Test server listening at port %s', SERVER_PORT);
	      });

	      // Initialize Falcor HTTP client:
	      const model = new Falcor.Model(
	        { source: new HttpDataSource(FALCOR_MODEL_URL) });

	      // Test!
	      return model.getValue('test.length').should.eventually.equal(42);
	    });
	  });
		describe('createGetRangesRoute', function() {
	    it('exists', function () {
	      should.exist(createGetRangesRoute);
	    });

	    it('routes', async function () {
	      const app = express();

	      // What "length" to return for the test route:
	      const modelPromise = async () => 42;

	      // Create falcor route:
	      const routes = [ createGetLengthRoute('test', modelPromise) ];
	      const Router = FalcorRouter.createClass(routes);
	      app.use('/model.json', bodyParser.urlencoded({extended: false}),
	        falcorExpress.dataSourceRoute( () => new Router()
	      ));

	      // Wait for express server to start:
	      await app.listen(SERVER_PORT, function server() {
	        console.log('Test server listening at port %s', SERVER_PORT);
	      });

	      // Initialize Falcor HTTP client:
	      const model = new Falcor.Model(
	        { source: new HttpDataSource(FALCOR_MODEL_URL) });

	      // Test!
	      return model.getValue('test.length').should.eventually.equal(42);
	    });
	  });
		describe('createGetByIdRoute', function() {
	    it('exists', function () {
	      should.exist(createGetByIdRoute);
	    });

	    it('routes', async function () {
	      const app = express();

	      // What "length" to return for the test route:
	      const modelPromise = async () => 42;

	      // Create falcor route:
	      const routes = [ createGetLengthRoute('test', modelPromise) ];
	      const Router = FalcorRouter.createClass(routes);
	      app.use('/model.json', bodyParser.urlencoded({extended: false}),
	        falcorExpress.dataSourceRoute( () => new Router()
	      ));

	      // Wait for express server to start:
	      await app.listen(SERVER_PORT, function server() {
	        console.log('Test server listening at port %s', SERVER_PORT);
	      });

	      // Initialize Falcor HTTP client:
	      const model = new Falcor.Model(
	        { source: new HttpDataSource(FALCOR_MODEL_URL) });

	      // Test!
	      return model.getValue('test.length').should.eventually.equal(42);
	    });
	  });
	});
}
