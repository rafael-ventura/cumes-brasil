// lib/widgets/via_card.dart
import 'package:flutter/material.dart';
import 'package:frontend/views/via_pages/ListagemViasView.dart';

class SobreView extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          titleSpacing: 10,
          backgroundColor: Colors.amber[400],
          title: Text(
            'Sobre',
            selectionColor: Colors.amber[400],
          ),
        ),
        body: Column(
          children: [
            ElevatedButton(
              onPressed: () {},
              child: Text('Sair'),
            )
          ],
        ));
  }
}
