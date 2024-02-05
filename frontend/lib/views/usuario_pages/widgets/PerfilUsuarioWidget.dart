import 'package:flutter/material.dart';
import 'package:frontend/controller/UserController.dart';
import 'package:frontend/models/userModel.dart';

class PerfilUsuarioWidget extends StatelessWidget {
  final UserController _userController = UserController();
  @override
  Widget build(BuildContext context) {
    return Container(
        child: Column(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        FutureBuilder<UserModel>(
          future: Future.value(
              _userController.createMockUser()), // Simulando um usuário logado
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return CircularProgressIndicator(); // widget de carregamento
            } else if (snapshot.hasError) {
              return Text('Erro: ${snapshot.error}');
            } else if (!snapshot.hasData || snapshot.data == null) {
              return Text('Usuário não encontrado');
            } else {
              UserModel user = snapshot.data!;
              return Container(
                padding: EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    CircleAvatar(
                      // imagem do perfil deve ficar aqui
                      radius: 50,
                      //backgroundImage: NetworkImage(user.imageUrl),
                    ),
                    SizedBox(height: 16),
                    Text(
                      'Nome: ${user.nome}',
                      style: TextStyle(fontSize: 18),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'E-mail: ${user.email}',
                      style: TextStyle(fontSize: 18),
                    ),
                    // Adicione mais informações conforme necessário
                  ],
                ),
              );
            }
          },
        ),
      ],
    ));
  }
}
