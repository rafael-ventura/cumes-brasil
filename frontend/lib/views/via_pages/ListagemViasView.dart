import 'package:flutter/material.dart';
import 'package:frontend/views/via_pages/widgets/ViaCard.dart';
import 'package:frontend/models/viaModel.dart';

import '../../controller/ViaController.dart';

class ListagemViasView extends StatefulWidget {
  const ListagemViasView({super.key});

  @override
  _ListagemViasState createState() => _ListagemViasState();
}

class _ListagemViasState extends State<ListagemViasView> {
  List<ViaModel> vias = [];
  ViaController viaController = ViaController();
  List<ViaModel> viasFiltradas = [];
  TextEditingController _searchController = TextEditingController();
  Map<String, MontanhaModel> montanhasMap = {};

  @override
  void initState() {
    super.initState();
    getAllVia();
  }

  Future<void> getAllVia() async {
    try {
      List<ViaModel> listaVias = await viaController.getAll();
      setState(() {
        vias = listaVias;
        viasFiltradas = vias;
        // Pré-carregar informações da montanha
        for (ViaModel via in vias) {
          String montanhaId = via.montanha!;
          if (!montanhasMap.containsKey(montanhaId)) {
            // Se a montanha ainda não foi carregada, carregue-a
            getMontanhaNome(montanhaId);
          }
        }
      });
    } catch (error) {
      print('Erro ao buscar vias 2: $error');
    }
  }

  Future<void> getMontanhaNome(String montanhaId) async {
    try {
      MontanhaModel montanha =
          await viaController.getMontanhaById(int.parse(montanhaId));
      setState(() {
        montanhasMap[montanhaId] = montanha;
      });
    } catch (error) {
      print('Erro ao buscar nome da montanha: $error');
      throw Error();
    }
  }

  void _performSearch(String query) {
    List<ViaModel> searchResults = [];
    if (query.isNotEmpty) {
      searchResults = vias
          .where((via) =>
              via.nome.toLowerCase().contains(query.toLowerCase()) ||
              via.grau!.toLowerCase().contains(query.toLowerCase()) ||
              montanhasMap[via.montanha!]
                      ?.nome
                      .toLowerCase()
                      .contains(query.toLowerCase()) ==
                  true)
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
                final montanha = montanhasMap[via.montanha!];
                return InkWell(
                  onTap: () {},
                  child: ViaCard(
                    viaModel: via,
                    montanhaNome: montanha?.nome ?? 'Carregando montanha...',
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
