import express from 'express';
import falcorExpress from 'falcor-express';
import FalcorRouter from 'falcor-router';
import Falcor from 'falcor';
import bodyParser from 'body-parser';
import HttpDataSource from 'falcor-http-datasource';

const SERVER_PORT = 15649;
const FALCOR_MODEL = '/model.json';
const FALCOR_MODEL_URL = `http://localhost:${SERVER_PORT}${FALCOR_MODEL}`;

let instance = null;

// Initialize Falcor HTTP client:
const testModel = new Falcor.Model(
	{ source: new HttpDataSource(FALCOR_MODEL_URL) }
);

const batchTestModel = new Falcor.Model(
	{ source: new HttpDataSource(FALCOR_MODEL_URL) }
);

export class TestServer {
	constructor() {
    if (!instance) {
			instance = this;
			this.app = express();
    }
    return instance;
	}

	refresh() {
		this.app = express();
		return this.app;
	}

	setRoutes(routes) {
		this.routes = routes;
		let Router = FalcorRouter.createClass(this.routes);
		this.app.use(FALCOR_MODEL, bodyParser.urlencoded( { extended: false } ),
			falcorExpress.dataSourceRoute( () => new Router() )
		);
		return this.app;
	}

	listen() {
		this.server = this.app.listen(SERVER_PORT);
		return this.server;
	}

	close() {
		if (this.server) {
			this.server.close();
			this.server = null;
			return true;
		} else {
			return false;
		}
	}

	restart(routes) {
		this.close();
		this.refresh();
		this.setRoutes(routes);
		return this.listen();
	}
}

export { testModel, batchTestModel };
