import 'package:flutter/material.dart';
import 'package:frontend/views/SobreView.dart';
import 'package:frontend/views/CriarContaView.dart';
import 'package:frontend/views/LoginUserView.dart';
import 'package:frontend/widgets/PerfilUsuarioWidget.dart';

class PerfilView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
        child: Column(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        PerfilUsuarioWidget(),
        Container(
            height: 300,
            width: 300,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Container(
                  child: InkWell(
                    onTap: () {
                      // Navegue para a outra página aqui
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) =>
                                CriarContaView()), // Substitua 'NovaPagina' pelo nome da sua nova página
                      );
                    },
                    child: Container(
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          color: Colors.amber[600]),
                      height: 80,
                      child: Text(
                        "Criar Conta",
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
                Container(
                  child: InkWell(
                    onTap: () {
                      // Navegue para a outra página aqui
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) =>
                                LoginUserView()), // Substitua 'NovaPagina' pelo nome da sua nova página
                      );
                    },
                    child: Container(
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          color: Colors.amber[300]),
                      height: 80,
                      child: Text(
                        "Login",
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            )),
      ],
    ));
  }
}
