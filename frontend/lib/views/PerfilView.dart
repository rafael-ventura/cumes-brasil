import 'package:flutter/material.dart';

class PerfilView extends StatelessWidget {
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
        body: Container(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                width: 300,
                height: 300,
                color: Colors.amberAccent,
                child: Text(
                  'Dados do usuário',
                  style: TextStyle(fontSize: 28),
                ),
              )
            ],
          ),
        ));
  }
}
