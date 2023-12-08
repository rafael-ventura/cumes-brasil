import 'package:flutter/material.dart';
import 'package:frontend/models/viaModel.dart';
import 'package:frontend/controller/ViaController.dart';
import 'package:frontend/views/via_pages/widgets/ViaCard.dart';
import 'package:frontend/views/via_pages/widgets/ViaCard2.dart';

class ViasView extends StatefulWidget {
  final String? initialSearchQuery;

  const ViasView({Key? key, this.initialSearchQuery}) : super(key: key);

  @override
  _ListagemViasViewState createState() => _ListagemViasViewState();
}

class _ListagemViasViewState extends State<ViasView> {
  List<ViaModel> vias = [];
  ViaController viaController = ViaController();
  List<ViaModel> viasFiltradas = [];
  TextEditingController _searchController = TextEditingController();
  Map<String, MontanhaModel> montanhasMap = {};

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      _performSearch(_searchController.text);
    });
    getAllVia().then((_) {
      // Se uma query de busca inicial foi fornecida, faça a busca.
      if (widget.initialSearchQuery != null) {
        _searchController.text = widget.initialSearchQuery!;
        _performSearch(widget.initialSearchQuery!);
      }
    });
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

      // Verificar se o widget ainda é válido antes de chamar setState
      if (mounted) {
        setState(() {
          montanhasMap[montanhaId] = montanha;
        });
      }
    } catch (error) {
      print('Erro ao buscar nome da montanha: $error');
    }
  }

  void _performSearch(String query) {
    setState(() {
      if (query.isEmpty) {
        viasFiltradas = vias;
      } else {
        viasFiltradas = vias.where((via) {
          final nomeVia = via.nome.toLowerCase();
          final grauVia = via.grau?.toLowerCase() ?? '';
          final nomeMontanha =
              montanhasMap[via.montanha!]?.nome.toLowerCase() ?? '';
          final conquistadoresVia =
              via.conquistadores?.toString().toLowerCase() ?? '';
          final cruxVia = via.crux?.toString().toLowerCase() ?? '';
          final exposicaoVia = via.exposicao?.toString().toLowerCase() ?? '';
          return nomeVia.contains(query) ||
              grauVia.contains(query) ||
              nomeMontanha.contains(query) ||
              conquistadoresVia.contains(query) ||
              cruxVia.contains(query) ||
              exposicaoVia.contains(query);
        }).toList();
      }
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
              decoration: InputDecoration(
                labelText:
                    'Pesquisar (Via, Montanha, Grau, Crux - só aceita letras minúsculas)',
                prefixIcon: Icon(Icons.search),
              ),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(
                  left: 8), // Adicione o espaçamento desejado
              child: GridView.builder(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing:
                      8.0, // Espaçamento horizontal entre os cartões
                  mainAxisSpacing: 8.0, // Espaçamento vertical entre os cartões
                ),
                itemCount: viasFiltradas.length,
                itemBuilder: (context, index) {
                  final via = viasFiltradas[index];
                  return InkWell(
                    child: ViaCard2(
                      viaModel: via,
                      montanhaNome: montanhasMap[via.montanha]?.nome ??
                          'Carregando montanha...',
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
