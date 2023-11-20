import 'package:flutter/material.dart';
import 'package:frontend/views/PerfilDetalhesView.dart';
import 'package:frontend/views/SobreView.dart';
import 'package:frontend/views/CriarContaView.dart';
import 'package:frontend/views/LoginUserView.dart';

class PerfilView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
        child: Column(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        Container(
          decoration: BoxDecoration(
              color: Colors.amber[900],
              borderRadius: BorderRadius.circular(100),
              border: BoxBorder.lerp(Border.all(), Border.all(), 10)),
          width: 150,
          height: 150,
          child: InkWell(
            onTap: () {
              // Navegue para a outra página aqui
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) =>
                        PerfilDetalhesView()), // Substitua 'NovaPagina' pelo nome da sua nova página
              );
            },
            child: Container(
                child: Center(
              child: Text(
                "Perfil",
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
            )),
          ),
        ),
        Container(
            height: 300,
            width: 400,
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                border: BoxBorder.lerp(Border.all(), Border.all(), 10)),
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
                          color: Colors.amber[800]),
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
                          color: Colors.amber[500]),
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
                Container(
                  child: InkWell(
                    onTap: () {
                      // Navegue para a outra página aqui
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) =>
                                SobreView()), // Substitua 'NovaPagina' pelo nome da sua nova página
                      );
                    },
                    child: Container(
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          color: Colors.amber[300]),
                      child: Text(
                        "Sobre",
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
