// lib/widgets/via_card.dart
import 'package:flutter/material.dart';
import 'package:frontend/views/PerfilView.dart';
import 'package:frontend/controller/UserController.dart';
import 'package:frontend/views/PerfilDetalhesView.dart';

class CriarContaView extends StatelessWidget {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _password2Controller = TextEditingController();

  // Adicione o seu UserController
  final UserController _userController = UserController();

  Future<void> _enviarMensagem(BuildContext context) async {
    if (_formKey.currentState!.validate()) {
      // Validar se o nome já existe
      bool nomeJaExiste = await _userController
          .verificarNomeExistente(_usernameController.text);
      if (nomeJaExiste) {
        // Nome já existe, trate conforme necessário (exibindo uma mensagem, por exemplo)
        print('Nome de usuário já existe');
        return;
      }

      // Validar se o e-mail já existe
      bool emailJaExiste =
          await _userController.verificarEmailExistente(_emailController.text);
      if (emailJaExiste) {
        // E-mail já existe, trate conforme necessário (exibindo uma mensagem, por exemplo)
        print('E-mail já cadastrado');
        return;
      }

      // Validar se a senha possui pelo menos 8 caracteres
      if (_passwordController.text.length < 8) {
        // Senha muito curta, trate conforme necessário (exibindo uma mensagem, por exemplo)
        print('Senha deve ter pelo menos 8 caracteres');
        return;
      }

      try {
        await _userController.postUser(
          nome: _usernameController.text,
          email: _emailController.text,
          senha: _passwordController.text,
          // Adicione outros parâmetros conforme necessário
        );

        // Se a chamada for bem-sucedida, você pode navegar para outra tela, por exemplo
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => PerfilDetalhesView()),
        );
      } catch (error) {
        // Trate erros, se necessário
        print('Erro ao criar usuário: $error');
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
              controller: _usernameController,
              decoration: InputDecoration(hintText: 'Nome de Usuário'),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Por favor, insira um nome de usuário';
                }
                return null;
              },
            ),
            TextFormField(
              controller: _emailController,
              decoration: InputDecoration(hintText: 'Cadastrar email'),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Por favor, insira um email';
                }
                // Adicione lógica de validação de email, se necessário
                return null;
              },
            ),
            TextFormField(
              controller: _passwordController,
              decoration: InputDecoration(hintText: 'Senha'),
              obscureText: true,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Por favor, insira uma senha';
                }
                // Adicione lógica de validação de senha, se necessário
                return null;
              },
            ),
            TextFormField(
              controller: _password2Controller,
              decoration: InputDecoration(hintText: 'Confirmar Senha'),
              obscureText: true,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Por favor, insira uma senha';
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
