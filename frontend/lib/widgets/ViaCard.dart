// lib/widgets/via_card.dart
import 'package:flutter/material.dart';

class ViaCard extends StatelessWidget {
  final String nome;
  final String grau;
  final String montanha;

  ViaCard({required this.nome, required this.grau, required this.montanha});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(nome),
        subtitle: Text('$grau - $montanha'),
      ),
    );
  }
}
