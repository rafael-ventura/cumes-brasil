import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:frontend/views/ViaView.dart';

class ViaCard extends StatelessWidget {
  final String nome;
  final String grau;
  final String montanha;
  final String image =
      'https://images.squarespace-cdn.com/content/v1/598b7343f7e0abaa677c5fd8/1576953784201-VT0GE0GJTZR6OYRNAN33/escalada-rio-de-janeiro-morro-da-urca-face-norte-2.jpg?format=2500w';

  ViaCard({
    required this.nome,
    required this.grau,
    required this.montanha,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Container(
        height: 140,
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: InkWell(
          onTap: () {
            // Navegue para a outra página aqui
            Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => ViaView(
                        grau: grau,
                        montanha: montanha,
                        nome: nome,
                      )), // Substitua 'NovaPagina' pelo nome da sua nova página
            );
          },
          child: Container(
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10), color: Colors.green),
            child: Row(children: [
              Container(
                child: Image.network(image, fit: BoxFit.contain),
                decoration:
                    BoxDecoration(borderRadius: BorderRadius.circular(30.0)),
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
      ),
    );
  }
}
