import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import express from 'express';
import bodyParser from 'body-parser';
import falcorExpress from 'falcor-express';
import FalcorRouter from 'falcor-router';
import Falcor from 'falcor';
import HttpDataSource from 'falcor-http-datasource';

import { cache } from './data/cache.js';

import { getCore } from './get.spec.js';
import { setCore } from './set.spec.js';
import { callCore } from './call.spec.js';

const SERVER_PORT = 15649;
const FALCOR_MODEL = '/model.json';
const FALCOR_MODEL_URL = `http://localhost:${SERVER_PORT}${FALCOR_MODEL}`;

chai.use(chaiAsPromised);
const should = chai.should();

const cacheModel = Falcor.model({
  'cache': cache
});

describe('Starting Server', function() {
  getCore(cacheModel);
  setCore(cacheModel);
  callCore(cacheModel);
});
