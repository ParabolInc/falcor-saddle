import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import express from 'express';
import bodyParser from 'body-parser';
import falcorExpress from 'falcor-express';
import FalcorRouter from 'falcor-router';
import Falcor from 'falcor';
import HttpDataSource from 'falcor-http-datasource';

import { createGetLengthRoute } from '../src/index';

const SERVER_PORT = 15649;
const FALCOR_MODEL = '/model.json';
const FALCOR_MODEL_URL = `http://localhost:${SERVER_PORT}${FALCOR_MODEL}`;

chai.use(chaiAsPromised);
const should = chai.should();

describe('starting server', function() {
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
  });
});