import 'package:flutter/material.dart';
import 'package:frontend/views/FavoritosView.dart';
import 'package:frontend/views/HomeView.dart';
import 'package:frontend/views/PerfilView.dart';
import 'package:frontend/views/ViasView.dart';

class AppNavigator {
  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();
}

class PersistentNavBar extends StatefulWidget {
  @override
  _PersistentNavBarState createState() => _PersistentNavBarState();
}

class _PersistentNavBarState extends State<PersistentNavBar> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    HomeView(),
    ViasView(),
    FavoritosView(),
    PerfilView(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          // ... Seu código existente
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.amber[800],
        onTap: _onItemTapped,
      ),
    );
  }
}
