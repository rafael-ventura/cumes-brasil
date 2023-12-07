import 'package:flutter/material.dart';
import 'package:frontend/models/viaModel.dart';
import 'package:frontend/controller/ViaController.dart';
import 'package:frontend/views/via_pages/ViaView.dart';
import 'package:frontend/views/via_pages/widgets/ViaCard.dart';

class ListagemViasView extends StatefulWidget {
  final String? initialSearchQuery;

  const ListagemViasView({
    Key? key,
    this.initialSearchQuery,
  }) : super(key: key);

  @override
  _ListagemViasViewState createState() => _ListagemViasViewState();
}

class _ListagemViasViewState extends State<ListagemViasView> {
  List<ViaModel> vias = [];
  List<ViaModel> viasFiltradas = [];
  TextEditingController _searchController = TextEditingController();
  ViaController viaController = ViaController();
  List<MontanhaModel> montanhas = List<MontanhaModel>.empty(growable: true);

  @override
  void initState() {
    super.initState();
    _searchController.text = widget.initialSearchQuery ?? "";
    _searchController.addListener(_onSearchChanged);
    _fetchVias();
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
      print('Erro ao buscar montanha: $error');
    }
  }

  void _fetchVias() async {
    try {
      vias = await viaController.getAll();
      _performSearch(_searchController.text);
    } catch (error) {
      print('Erro ao buscar vias: $error');
    }
  }

  void _onSearchChanged() {
    _performSearch(_searchController.text);
  }

  void _performSearch(String query) {
    final lowerCaseQuery = query.toLowerCase();
    setState(() {
      viasFiltradas = vias.where((via) {
        return via.nome.toLowerCase().contains(lowerCaseQuery) ||
            (via.grau!.toLowerCase().contains(lowerCaseQuery) ||
                via.montanha
                    .toString()
                    .toLowerCase()
                    .contains(lowerCaseQuery) ||
                via.conquistadores
                    .toString()
                    .toLowerCase()
                    .contains(lowerCaseQuery) ||
                via.crux.toString().toLowerCase().contains(lowerCaseQuery) ||
                via.exposicao
                    .toString()
                    .toLowerCase()
                    .contains(lowerCaseQuery) ||
                false);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Listagem de Vias'),
        // Inclua outros ícones se necessário
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: _searchController,
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
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ViaView(
                          viaId: via.id,
                        ),
                      ),
                    );
                  },
                  child: ViaCard(
                    viaModel: via,
                    montanhaNome: montanhas
                        .map((montanha) =>
                            montanha.id == via.id ? montanha.nome : '')
                        .toString(),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}
