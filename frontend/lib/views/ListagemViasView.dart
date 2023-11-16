import 'package:flutter/material.dart';
import '../models/viaModel.dart';
import '../widgets/ViaCard.dart';
import '../controller/ViaController.dart';

class ListagemViasView extends StatefulWidget {
  @override
  _ListagemViasState createState() => _ListagemViasState();
}

class _ListagemViasState extends State<ListagemViasView> {
  List<ViaModel> vias = [];
  ViaController viaController = ViaController();

  @override
  void initState() {
    super.initState();
    metodo();
  }

  Future<void> metodo() async {
    try {
      List<ViaModel> fetchedVias = await viaController.getAll();
      setState(() {
        vias = fetchedVias;
      });
    } catch (error) {
      print('Erro ao buscar vias: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Listagem de Vias'),
      ),
      body: ListView.builder(
        itemCount: vias.length,
        itemBuilder: (context, index) {
          final via = vias[index];
          return InkWell(
            onTap: () {
              // Você pode navegar para uma página de detalhes aqui.
            },
            child: ViaCard(
              nome: via.nome ?? 'Nome não disponível',
              grau: via.grau ?? 'Grau não disponível',
              montanha: via.montanha?.nome ?? 'Montanha não disponível',
            ),
          );
        },
      ),
    );
  }
}
