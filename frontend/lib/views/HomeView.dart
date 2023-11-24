import 'package:flutter/material.dart';
import 'package:frontend/views/via_pages/widgets/ListagemNewPageView.dart';

class HomeView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 100,
      width: 400,
      child: InkWell(
        onTap: () {
          // Navegue para a outra página aqui usando o Navigator do contexto atual
          Navigator.of(context).push(
            MaterialPageRoute(builder: (context) => ListagemNewPageView()),
          );
        },
        child: Container(
          alignment: Alignment.center,
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10), color: Colors.red),
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
