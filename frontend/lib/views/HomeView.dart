import 'package:flutter/material.dart';
import 'package:frontend/views/ListagemViasView.dart';

class HomeView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 100,
      width: 400,
      child: InkWell(
        onTap: () {
          // Navegue para a outra página aqui
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) =>
                    ListagemViasView()), // Substitua 'NovaPagina' pelo nome da sua nova página
          );
        },
        child: Container(
          alignment: Alignment.center,
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10), color: Colors.green),
          child: Text(
            "Listagem de Vias",
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}
