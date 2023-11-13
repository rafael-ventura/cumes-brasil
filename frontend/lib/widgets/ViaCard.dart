import 'package:flutter/material.dart';
import 'package:frontend/views/PageVia.dart';

class ViaCard extends StatelessWidget {
  String nome;
  String grau;
  String montanha;

  ViaCard({required this.nome, required this.grau, required this.montanha});

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Container(
        height: 150,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: InkWell(
          onTap: () {
            // Navegue para a outra página aqui
            Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => PageVia(
                        grau: grau,
                        montanha: montanha,
                        nome: nome,
                      )), // Substitua 'NovaPagina' pelo nome da sua nova página
            );
          },
          child: Card(
            color: Colors.green.withOpacity(0.4),
            elevation: 4,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10.0),
            ),
            child: ListTile(
              contentPadding: EdgeInsets.all(16),
              title: Text(
                nome,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              subtitle: Text(
                '$grau - $montanha',
                style: TextStyle(
                  fontSize: 14,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
