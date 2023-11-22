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
  List<ViaModel> viasFiltradas = [];
  TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    getAllVia();
  }

  Future<void> getMock() async {
    try {
      List<ViaModel> fetchedVias = await viaController
          .getViasFromJsonFile(); // Usando mockVias em vez de getAll()
      setState(() {
        vias = fetchedVias;
        viasFiltradas = vias;
      });
    } catch (error) {
      print('Erro ao buscar vias: $error');
    }
  }

  Future<void> getAllVia() async {
    try {
      List<ViaModel> listaVias = await viaController.getAll();
      setState(() {
        vias = listaVias;
        viasFiltradas = vias;
      });
    } catch (error) {
      print('Erro ao buscar vias2: $error');
    }
  }

  void _performSearch(String query) {
    List<ViaModel> searchResults = [];
    if (query.isNotEmpty) {
      searchResults = vias
          .where((via) =>
              via.nome.toLowerCase().contains(query.toLowerCase()) ||
              via.grau!.toLowerCase().contains(query.toLowerCase()))
          .toList();
    } else {
      searchResults = List.from(vias);
    }
    setState(() {
      viasFiltradas = searchResults;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: _searchController,
              onChanged: _performSearch,
              decoration: InputDecoration(
                labelText: 'Pesquisar (Via, Montanha, Grau)',
                prefixIcon: Icon(Icons.search),
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: viasFiltradas.length,
              itemBuilder: (context, index) {
                final via = viasFiltradas[index];
                return InkWell(
                  onTap: () {},
                  child: ViaCard(
                    viaModel: via,
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}