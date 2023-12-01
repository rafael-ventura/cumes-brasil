import {UsuarioController} from "../Controllers/UsuarioController";
import { Router } from 'express';
import {UsuarioService} from "../../Application/services/UsuarioService";


const usuarioService = new UsuarioService();
const usuarioController = new UsuarioController(usuarioService);


const UserRouter = Router();

router.post("/new", usuarioController.createUser);
router.get("/:id", usuarioController.getUsuarioById);
router.post("/login", usuarioController.login);
router.post("/logout/:id", usuarioController.logout);
router.post("/alterar-senha/:id", usuarioController.alterarSenha);
router.post("/recuperar-senha", usuarioController.iniciarRecuperacaoSenha);
router.post("/redefinir-senha", usuarioController.redefinirSenha);
router.put("/:id", usuarioController.atualizarPerfil);
router.post("/verificar-email", usuarioController.verificarEmail);

export default UserRouter