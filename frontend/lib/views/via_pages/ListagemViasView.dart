import 'package:flutter/material.dart';
import 'package:frontend/models/viaModel.dart';
import 'package:frontend/views/via_pages/widgets/ViaCard.dart';
import 'package:frontend/controller/ViaController.dart';

class ListagemViasView extends StatefulWidget {
  const ListagemViasView({super.key, required String initialSearchQuery});

  @override
  _ListagemViasState createState() => _ListagemViasState();
}

class _ListagemViasState extends State<ListagemViasView> {
  List<ViaModel> vias = [];
  ViaController viaController = ViaController();
  List<ViaModel> viasFiltradas = [];
  final TextEditingController _searchController = TextEditingController();
  List<MontanhaModel> montanhas = List<MontanhaModel>.empty(growable: true);

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      _performSearch(_searchController.text);
    });
    getAllVia();
  }

  Future<void> getAllVia() async {
    try {
      List<ViaModel> fetchedVias = await viaController.getAll();
      setState(() {
        vias = fetchedVias;
        viasFiltradas = vias;
      });
    } catch (error) {
      print('Erro ao buscar vias: $error');
    }
  }

  Future<void> getMontanhaById(int id) async {
    try {
      for (var via in vias) {
        if (via.id == id) {
          montanhas
              .add(await viaController.getMontanhaById(via.montanha as int));
        }
      }
      setState(() {});
    } catch (error) {
      print('Erro ao buscar montanha 3: $error');
    }
  }

  void _performSearch(String query) {
    setState(() {
      viasFiltradas = vias.where((via) {
        return via.nome.toLowerCase().contains(query) ||
            (via.grau!.toLowerCase().contains(query) ||
                via.montanha.toString().toLowerCase().contains(query) ||
                via.conquistadores.toString().toLowerCase().contains(query) ||
                via.crux.toString().toLowerCase().contains(query) ||
                via.exposicao.toString().toLowerCase().contains(query) ||
                false);
      }).toList();
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
              decoration: const InputDecoration(
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
                  onTap: () {
                    // Navegue para uma página de detalhes aqui.
                  },
                  child: ViaCard(
                      viaModel: via,
                      montanhaNome: montanhas
                          .map((montanha) =>
                              montanha.id == via.id ? montanha.nome : '')
                          .toString()),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
