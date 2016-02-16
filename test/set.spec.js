import chai from 'chai';

import { createSetByIdRoute } from '../src/index';

export function setCore(model) {
	describe("Set Core", function() {
		describe('createSetByIdRoute', function() {
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
	  });
	});
}
