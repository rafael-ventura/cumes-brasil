import 'package:flutter/material.dart';
import 'package:frontend/widgets/ViaCard.dart';

class ViasView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        ViaCard(nome: 'Corcovado 3', grau: '4', montanha: 'Corcovado'),
        ViaCard(nome: 'Pão de Açucar 2', grau: '7', montanha: 'Pão de Açucar'),
        ViaCard(nome: 'Pão de Açucar 2', grau: '7', montanha: 'Pão de Açucar'),
        ViaCard(nome: 'Pão de Açucar 2', grau: '7', montanha: 'Pão de Açucar'),
        ViaCard(nome: 'Pão de Açucar 2', grau: '7', montanha: 'Pão de Açucar'),
        ViaCard(nome: 'Pão de Açucar 2', grau: '7', montanha: 'Pão de Açucar'),
        ViaCard(nome: 'Pão de Açucar 2', grau: '7', montanha: 'Pão de Açucar'),
        ViaCard(nome: 'Pão de Açucar 2', grau: '7', montanha: 'Pão de Açucar'),
        ViaCard(nome: 'Dedo de Deus 6', grau: '11', montanha: 'Dedo de Deus')
      ],
    );
  }
}
