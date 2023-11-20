// lib/widgets/via_card.dart
import 'dart:math';

import 'package:flutter/material.dart';
import '../views/ListagemViasView.dart';
import '../models/viaModel.dart';

class ViaView extends StatelessWidget {
  final ViaModel viaModel;
  final String image =
      'https://images.squarespace-cdn.com/content/v1/598b7343f7e0abaa677c5fd8/1576953784201-VT0GE0GJTZR6OYRNAN33/escalada-rio-de-janeiro-morro-da-urca-face-norte-2.jpg?format=2500w';

  const ViaView({
    required this.viaModel,
  });

  Widget buildSectionTitle(String title) {
    return Text(
      title,
      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
    );
  }

  Widget buildSectionContent(String content) {
    return Text(
      content,
      style: TextStyle(fontSize: 16),
    );
  }

  Widget buildConquistadoresList() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        buildSectionTitle('Conquistadores:'),
        SizedBox(height: 8),
        ListView.builder(
          shrinkWrap: true,
          itemCount: viaModel.conquistadores!.length,
          itemBuilder: (context, index) {
            return Text('- ${viaModel.conquistadores![index]}',
                style: TextStyle(fontSize: 16));
          },
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          titleSpacing: 10,
          backgroundColor: Colors.green,
          title: Text(
            '${viaModel.nome}',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
        body: SingleChildScrollView(
            child: Column(
          children: [
            Container(
              width: min(400, 600),
              child: Image.network((image), fit: BoxFit.contain),
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          buildSectionTitle('Montanha:'),
                          SizedBox(height: 8),
                          buildSectionContent(
                              '${"Sem Nome || nome da montanha deve ficar aqui!"}'),
                          SizedBox(height: 16), SizedBox(height: 16),
                          buildSectionTitle('Detalhes:'),
                          SizedBox(height: 8),
                          buildSectionContent(
                              '${viaModel.detalhes ?? "Sem Detalhes"}'),
                          SizedBox(height: 16),
                          if (viaModel.data != null)
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                buildSectionTitle('Data:'),
                                SizedBox(height: 8),
                                buildSectionContent(
                                    '${viaModel.data!.toLocal()}'),
                              ],
                            ),
                          // Adicione mais widgets conforme necessário para outros atributos
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          buildSectionTitle('Grau:'),
                          SizedBox(height: 8),
                          buildSectionContent('${viaModel.grau ?? "Sem Grau"}'),
                          SizedBox(height: 8),
                          buildSectionTitle('Artificial:'),
                          SizedBox(height: 8),
                          buildSectionContent(
                              '${viaModel.artificial ?? "Não"}'),
                          buildSectionTitle('Altura:'),
                          SizedBox(height: 8),
                          buildSectionContent(
                              '${"Sem Montanha altura da Montanha"}'),
                          SizedBox(height: 8),
                          buildSectionTitle('Duração:'),
                          SizedBox(height: 8),
                          buildSectionContent(
                              '${viaModel.duracao ?? "Sem Duração"}'),
                          SizedBox(height: 8),
                          buildSectionTitle('Exposição:'),
                          SizedBox(height: 8),
                          buildSectionContent(
                              '${viaModel.exposicao ?? "Sem Exposição"}'),
                          SizedBox(height: 8),
                          buildSectionTitle('Extensão:'),
                          SizedBox(height: 8),
                          buildSectionContent(
                              '${viaModel.extensao ?? "Sem Extensão"}'),
                        ],
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  GestureDetector(
                    onTap: () {
                      // Adicione a lógica para lidar com o clique em crux
                    },
                    child: buildSectionTitle('Crux:'),
                  ),
                  SizedBox(height: 8),
                  buildConquistadoresList(),
                ],
              ),
            ),
          ],
        )));
  }
}
