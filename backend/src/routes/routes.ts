import { Router } from 'express';
import ViaRouter from "./ViaRouter";

const routes = Router();

routes.use('/vias', ViaRouter);

export default routes;