import 'package:flutter/material.dart';
import 'package:frontend/views/via_pages/ListagemViasView.dart';
import '../../../models/viaModel.dart';
import '../widgets/ViaCard.dart';
import '../../../controller/ViaController.dart';

class ListagemNewPageView extends StatefulWidget {
  @override
  _ListagemViasState createState() => _ListagemViasState();
}

class _ListagemViasState extends State<ListagemNewPageView> {
  List<ViaModel> vias = [];
  ViaController viaController = ViaController();

  @override
  void initState() {
    super.initState();
    metodo();
  }

  Future<void> metodo() async {
    try {
      List<ViaModel> fetchedVias = await viaController.getViasFromJsonFile();
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
        titleSpacing: 10,
        backgroundColor: Colors.green[800],
        title: Text('Listagem Vias'),
      ),
      body:
          ListagemViasView(), // Passando a lista de vias para a ListagemViasView
    );
  }
}
