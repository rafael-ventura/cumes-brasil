// lib/widgets/via_card.dart
import 'package:flutter/material.dart';
import 'package:frontend/views/PerfilView.dart';
import 'package:frontend/controller/UserController.dart';

class LoginUserView extends StatelessWidget {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // Adicione o seu UserController
  final UserController _userController = UserController();

  Future<void> _enviarMensagem(BuildContext context) async {
    final scaffoldMessenger = ScaffoldMessenger.of(context);
    final navigator = Navigator.of(context);
    if (_formKey.currentState!.validate()) {
      try {
        bool validarLogin = await _userController.autenticarUsuario(
          email: _emailController.text,
          senha: _passwordController.text,
        );
        if (!validarLogin) {
          scaffoldMessenger.showSnackBar(
            const SnackBar(content: Text('Credenciais inválidas')),
          );
        } else {
          // Navega para a tela de perfil se o login for bem-sucedido
          navigator.pushReplacement(
            MaterialPageRoute(builder: (context) => PerfilView()),
          );
        }
      } catch (error) {
        print('Erro ao logar usuário: $error');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 10,
        backgroundColor: Colors.amber[800],
        title: const Text(
          'Login',
          selectionColor: Colors.green,
        ),
      ),
      body: Form(
        key: _formKey,
        child: Column(
          children: [
            TextFormField(
              controller: _emailController,
              decoration: const InputDecoration(hintText: 'Seu email'),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Por favor, insira seu email';
                }
                return null;
              },
            ),
            TextFormField(
              controller: _passwordController,
              decoration: const InputDecoration(hintText: 'Sua senha'),
              obscureText: true,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Por favor, insira sua senha';
                }
                return null;
              },
            ),
            ElevatedButton(
              onPressed: () => _enviarMensagem(context),
              child: const Text('Entrar'),
            ),
          ],
        ),
      ),
    );
  }
}
