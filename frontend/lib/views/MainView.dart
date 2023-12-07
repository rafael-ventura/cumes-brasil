import 'package:flutter/material.dart';
import 'package:frontend/views/FavoritosView.dart';
import 'package:frontend/views/HomeView.dart';
import 'package:frontend/views/PerfilView.dart';
import 'package:frontend/views/ViasView.dart';
import '../widgets/barraDeNavegacao/NavBar.dart';

class MainView extends StatefulWidget {
  const MainView({Key? key}) : super(key: key);
//eu consigo usar o copilot. melhor tu compartilhar no code with me nao?
  @override
  _MainViewState createState() => _MainViewState();
}

class _MainViewState extends State<MainView> {
  int _selectedIndex = 0;

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          const HomeView(),
          const ViasView(),
          FavoritosView(),
          PerfilView(),
        ],
      ),
      bottomNavigationBar: NavBar(onNavigate: _onItemTapped),
    );
  }
}