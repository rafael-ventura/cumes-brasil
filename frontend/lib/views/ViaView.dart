// lib/widgets/via_card.dart
import 'package:flutter/material.dart';
import '../views/ListagemViasView.dart';

class ViaView extends StatelessWidget {
  final String nome;
  final String grau;
  final String montanha;
  final String image =
      'https://images.squarespace-cdn.com/content/v1/598b7343f7e0abaa677c5fd8/1576953784201-VT0GE0GJTZR6OYRNAN33/escalada-rio-de-janeiro-morro-da-urca-face-norte-2.jpg?format=2500w';

  const ViaView({
    required this.nome,
    required this.grau,
    required this.montanha,
  });

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 10,
        backgroundColor: Colors.green,
        title: Text(
          '$nome',
          selectionColor: Colors.green,
        ),
      ),
      body: Column(
        children: [
          Container(
            color: Colors.amber,
            child: Text('Nome: $nome'),
          ),
          Container(
            color: Colors.amber,
            child: Text('Grau: $grau'),
          ),
          Container(
            color: Colors.amber,
            child: Text('Montanha: $montanha'),
          ),
          Container(
            color: Colors.pink,
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
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: Colors.green),
                child: Row(children: [
                  Container(
                    child: Image.network(
                      image,
                      width: 10,
                    ),
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(30.0)),
                  ),
                  Container(
                    width: 20,
                  ),
                  Column(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Container(
                          child: Text(
                            nome,
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        Container(
                          child: Text('$grau - $montanha',
                              style: TextStyle(
                                fontSize: 18,
                              )),
                        ),
                      ]),
                ]),
              ),
            ),
          )
        ],
      ),
    );
  }
}