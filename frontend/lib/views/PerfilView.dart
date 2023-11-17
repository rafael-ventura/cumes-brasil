import 'package:flutter/material.dart';
import '../controller/UserController.dart';
import '../models/userModel.dart';

class PerfilView extends StatelessWidget {
// Id do usuário
  final UserController _userController = UserController();

  PerfilView();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 10,
        backgroundColor: Colors.amber[800],
        title: Text(
          'Meu Perfil',
          selectionColor: Colors.green,
        ),
      ),
      body: FutureBuilder<UserModel>(
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
                crossAxisAlignment: CrossAxisAlignment.start,
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
    );
  }
}
