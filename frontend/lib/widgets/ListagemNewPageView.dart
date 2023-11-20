import 'package:flutter/material.dart';
import 'package:frontend/views/ListagemViasView.dart';
import '../models/viaModel.dart';
import '../widgets/ViaCard.dart';
import '../controller/ViaController.dart';

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

  Future<void> metodo2() async {
    try {
      List<ViaModel> fetchedVias =
          await viaController.getMontanha('NomeMontanha');
      setState(() {
        vias = fetchedVias;
      });
    } catch (error) {
      print('Erro ao buscar vias por montanha: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Listagem New Page'),
      ),
      body:
          ListagemViasView(), // Passando a lista de vias para a ListagemViasView
    );
  }
}
