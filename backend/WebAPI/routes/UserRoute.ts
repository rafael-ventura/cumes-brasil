import {UsuarioController} from "../Controllers/UsuarioController";
import { Router } from 'express';

const usuarioController = new UsuarioController(usuarioService);
const router = Router();

router.get("/:id", usuarioController.getUsuarioById);
router.post("/login", usuarioController.login);
router.post("/logout/:id", usuarioController.logout);
router.post("/alterar-senha/:id", usuarioController.alterarSenha);
router.post("/recuperar-senha", usuarioController.iniciarRecuperacaoSenha);
router.post("/redefinir-senha", usuarioController.redefinirSenha);
router.put("/:id", usuarioController.atualizarPerfil);
router.post("/verificar-email", usuarioController.verificarEmail);

export default router
