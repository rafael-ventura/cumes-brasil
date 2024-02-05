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
    if (_formKey.currentState!.validate()) {
      bool validarLogin = await _userController.autenticarUsuario(
        email: _emailController.text,
        senha: _passwordController.text,
      );
      if (validarLogin) {
        print('');
        return;
      }

      try {
        await _userController.autenticarUsuario(
          email: _emailController.text,
          senha: _passwordController.text,
        );
        // Se a chamada for bem-sucedida, navegar para outra tela
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => PerfilView()),
        );
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
        title: Text(
          'Criando Conta',
          selectionColor: Colors.green,
        ),
      ),
      body: Form(
        key: _formKey,
        child: Column(
          children: [
            TextFormField(
              controller: _emailController,
              decoration: InputDecoration(hintText: 'Seu email'),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Por favor, insira seu email';
                }
                // Adicione lógica de validação de email, se necessário
                return null;
              },
            ),
            TextFormField(
              controller: _passwordController,
              decoration: InputDecoration(hintText: 'Sua senha'),
              obscureText: true,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Por favor, insira sua senha';
                }
                // Adicione lógica de validação de senha, se necessário
                return null;
              },
            ),
            ElevatedButton(
              onPressed: () => _enviarMensagem(context),
              child: Text('Salvar'),
            ),
          ],
        ),
      ),
    );
  }
}
