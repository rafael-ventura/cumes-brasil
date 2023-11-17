import 'package:flutter/material.dart';
import '../models/viaModel.dart';
import '../widgets/ViaCard.dart';
import '../controller/ViaController.dart';

class ViasView extends StatefulWidget {
  @override
  _ListagemViasState createState() => _ListagemViasState();
}

class _ListagemViasState extends State<ViasView> {
  List<ViaModel> vias = [];
  ViaController viaController = ViaController();
  List<ViaModel> viasFiltradas = [];
  TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    metodo();
  }

  Future<void> metodo() async {
    try {
      List<ViaModel> fetchedVias =
          viaController.mockVias(); // Usando mockVias em vez de getAll()
      setState(() {
        vias = fetchedVias;
        viasFiltradas = vias;
      });
    } catch (error) {
      print('Erro ao buscar vias: $error');
    }
  }

  Future<void> metodo2() async {
    try {
      List<ViaModel> fetchedVias = await viaController.getMontanha(
          'NomeMontanha'); // Substitua 'NomeMontanha' pelo nome da montanha desejada
      setState(() {
        vias = fetchedVias;
        viasFiltradas = vias;
      });
    } catch (error) {
      print('Erro ao buscar vias por montanha: $error');
    }
  }

  void _performSearch(String query) {
    List<ViaModel> searchResults = [];
    if (query.isNotEmpty) {
      searchResults = vias
          .where((via) =>
              via.nome.toLowerCase().contains(query.toLowerCase()) ||
              via.grau!.toLowerCase().contains(query.toLowerCase()) ||
              via.montanha!.nome.toLowerCase().contains(query.toLowerCase()))
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
                labelText: 'Pesquisar',
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
                  onTap: () {
                    // Navegue para uma página de detalhes aqui.
                  },
                  child: ViaCard(
                    nome: via.nome ?? 'Nome não disponível',
                    grau: via.grau ?? 'Grau não disponível',
                    montanha: via.montanha?.nome ?? 'Montanha não disponível',
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
