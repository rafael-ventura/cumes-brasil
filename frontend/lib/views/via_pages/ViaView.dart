// lib/widgets/via_card.dart
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:frontend/controller/ViaController.dart';
import 'package:frontend/views/via_pages/widgets/MontanhaComponent.dart'; //Componente para pegar valores de montanha
import '../../models/viaModel.dart';

class ViaView extends StatefulWidget {
  final int viaId; // Alteração: Adicionando o ID da via no construtor
  final String image =
      'https://images.squarespace-cdn.com/content/v1/598b7343f7e0abaa677c5fd8/1576953784201-VT0GE0GJTZR6OYRNAN33/escalada-rio-de-janeiro-morro-da-urca-face-norte-2.jpg?format=2500w';

  const ViaView({
    required this.viaId,
  });

  @override
  _ViaViewState createState() => _ViaViewState();
}

class _ViaViewState extends State<ViaView> {
  late Future<ViaModel> viaFuture;
  ViaController viaController = ViaController();
  late Future<MontanhaModel> montanhaFuture;
  late int idMontanha;

  @override
  void initState() {
    super.initState();
    getViaById();
  }

  Future<void> getViaById() async {
    try {
      viaFuture = viaController.getById(widget.viaId);
      await viaFuture; // Esperar a conclusão do Future antes de chamar o setState
      setState(() {}); // Atualizar a interface após a conclusão do Future
    } catch (error) {
      print('Erro ao buscar vias: $error');
    }
  }

  Future<void> getViaByIdMock() async {
    try {
      viaFuture = viaController.getViaByIdFromJsonFile(widget.viaId);
      await viaFuture; // Esperar a conclusão do Future antes de chamar o setState
      setState(() {}); // Atualizar a interface após a conclusão do Future
    } catch (error) {
      print('Erro ao buscar vias: $error');
    }
  }

  Future<void> getMontanha() async {
    try {
      montanhaFuture = viaController.getMontanhaByIdromJsonFile(4);
      await montanhaFuture;
      setState(() {});
    } catch (error) {
      print('Erro ao buscar montanha 3: $error');
    }
  }

  //@Style
  Widget buildSectionTitle(String title) {
    return Text(
      title,
      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
    );
  }

  //@Style
  Widget buildSectionContent(String content) {
    return Text(
      content,
      style: TextStyle(fontSize: 16),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          titleSpacing: 10,
          backgroundColor: Colors.green,
          title: FutureBuilder<ViaModel>(
            future: viaFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return CircularProgressIndicator();
              } else if (snapshot.hasError) {
                return Text('Erro: ${snapshot.error}');
              } else {
                final viaModel = snapshot
                    .data!; // Acesso aos dados após a conclusão do Future

                return Text(
                  '${viaModel.nome}',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                );
              }
            },
          ),
        ),
        body: FutureBuilder<ViaModel>(
            future: viaFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return Center(child: CircularProgressIndicator());
              } else if (snapshot.hasError) {
                return Center(child: Text('Erro: ${snapshot.error}'));
              } else {
                final viaModel = snapshot.data!;
                return SingleChildScrollView(
                  child: Column(
                    children: [
                      Container(
                        width: min(400, 600),
                        child:
                            Image.network((widget.image), fit: BoxFit.contain),
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
                                    //@MontanhaComponente
                                    MontanhaComponent(
                                        montanha_id: int.parse(
                                            viaModel.montanha ?? '1')),
                                    SizedBox(height: 16),
                                    buildSectionTitle('Detalhes:'),
                                    SizedBox(height: 8),
                                    buildSectionContent(
                                        '${viaModel.detalhes ?? "Sem Detalhes"}'),
                                    SizedBox(height: 16),
                                    if (viaModel.data != null)
                                      Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          buildSectionTitle('Data:'),
                                          SizedBox(height: 8),
                                          buildSectionContent(
                                              '${viaModel.data}'),
                                        ],
                                      ),
                                    // Adicione mais widgets conforme necessário para outros atributos
                                  ],
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    buildSectionTitle('Grau:'),
                                    SizedBox(height: 2),
                                    buildSectionContent(
                                        '${viaController.getFormattedGrau(viaModel.grau) ?? "Sem Grau"}'),
                                    SizedBox(height: 15),
                                    buildSectionTitle('Crux:'),
                                    SizedBox(height: 2),
                                    buildSectionContent(
                                        '${viaModel.crux ?? "Sem Crux"}'),
                                    SizedBox(height: 15),
                                    buildSectionTitle('Artificial:'),
                                    SizedBox(height: 2),
                                    buildSectionContent(
                                        '${viaModel.artificial ?? "Não"}'),
                                    SizedBox(height: 15),
                                    buildSectionTitle('Altura:'),
                                    SizedBox(height: 2),
                                    buildSectionContent('${"Sem Altura"}'),
                                    SizedBox(height: 15),
                                    buildSectionTitle('Duração:'),
                                    SizedBox(height: 2),
                                    buildSectionContent(
                                        '${viaModel.duracao ?? "Sem Duração"}'),
                                    SizedBox(height: 15),
                                    buildSectionTitle('Exposição:'),
                                    SizedBox(height: 2),
                                    buildSectionContent(
                                        '${viaModel.exposicao ?? "Sem Exposição"}'),
                                    SizedBox(height: 15),
                                    buildSectionTitle('Extensão:'),
                                    SizedBox(height: 2),
                                    buildSectionContent(
                                        '${viaModel.extensao ?? "Sem Extensão"}'),
                                  ],
                                ),
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                buildSectionTitle('Conquistadores:'),
                                SizedBox(height: 8),
                                buildSectionContent(
                                    '${viaModel.conquistadores ?? "Sem conquistadores"}')
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              }
            }));
  }
}
