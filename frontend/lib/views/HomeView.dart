import 'package:flutter/material.dart';
import 'package:frontend/views/via_pages/ListagemViasView.dart';

class HomeView extends StatelessWidget {
  const HomeView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GridView.count(
        crossAxisCount: 2,
        padding: const EdgeInsets.all(16),
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        children: <Widget>[
          _buildCategoryButton(
            context,
            label: 'Vias de 5º grau',
            icon: Icons.filter_5,
            searchQuery: '5',
          ),
          _buildCategoryButton(
            context,
            label: 'Vias de duração 3',
            icon: Icons.timer,
            searchQuery: 'duração 3',
          ),
          _buildCategoryButton(
            context,
            label: 'Vias no Morro do Cantagalo',
            icon: Icons.landscape,
            searchQuery: 'Morro do Cantagalo',
          ),
          // Adicionando o novo botão
          _buildCategoryButton(
            context,
            label: 'Vias do André Ilha',
            icon: Icons.flag,
            searchQuery: 'André Ilha',
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryButton(BuildContext context,
      {required String label,
      required IconData icon,
      required String searchQuery}) {
    return ElevatedButton.icon(
      icon: Icon(icon),
      label: Text(label),
      onPressed: () => _navigateAndSearch(context, searchQuery),
      style: ElevatedButton.styleFrom(
        primary: Theme.of(context).primaryColor,
        onPrimary: Colors.white,
        fixedSize: const Size(10, 10),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        minimumSize: const Size(10, 10), // Ajuste aqui
      ),
    );
  }

  void _navigateAndSearch(BuildContext context, String searchQuery) {
    Navigator.of(context).push(MaterialPageRoute(
      builder: (context) => ListagemViasView(
        initialSearchQuery: searchQuery,
      ),
    ));
  }
}
