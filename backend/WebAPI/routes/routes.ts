import { Router } from "express";
import ViaRouter from "./ViaRouter";
import UsuarioRouter from "./UsuarioRouter";
import MontanhaRouter from "./MontanhaRouter";
import FonteRouter from "./FonteRouter";
import FaceRouter from "./FaceRouter";
import CroquiRouter from "./CroquiRouter";
import ColecaoRouter from "./ColecaoRouter";
import EscaladaRouter from "./EscaladaRouter";
import PerfilRouter from "./PerfilRouter";
import { ConexaoController } from "../Controllers/ConexaoController";
import { ConexaoService } from "../../Application/services/ConexaoService";
import { AppDataSource } from "../../Infrastructure/config/db";
import AuthenticateRouter from "./AuthenticateRouter";
import { authenticateToken } from "../Middlewares/AuthenticateMiddleware";

const routes = Router();
const conexaoController = new ConexaoController(new ConexaoService(AppDataSource));
routes.get("/conexao", conexaoController.checkDatabaseHealth);
/* routes.use("", AuthenticateRouter); */
routes.use("/vias", ViaRouter);
routes.use("/fontes", FonteRouter);
routes.use("/montanhas", MontanhaRouter);
routes.use("/faces", FaceRouter);
routes.use("/croquis", CroquiRouter);
routes.use("/usuarios", UsuarioRouter);
/* routes.use(authenticateToken); */
routes.use("/colecoes", ColecaoRouter);
routes.use("/escaladas", EscaladaRouter);
routes.use("/perfil", PerfilRouter);

export default routes;
