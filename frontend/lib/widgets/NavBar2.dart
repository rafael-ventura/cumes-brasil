import 'package:flutter/material.dart';
import 'dart:convert';
import '../views/ConfigView.dart';
import '../views/PerfilView.dart';
import '../views/FavoritosView.dart';
import '../views/HomeView.dart';
import '../views/ViasView.dart';

/// Flutter code sample for [BottomNavigationBar].

void main() => runApp(const NavBar2());

class NavBar2 extends StatelessWidget {
  const NavBar2({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: BottomNavBar(),
    );
  }
}

class BottomNavBar extends StatefulWidget {
  const BottomNavBar({super.key});

  @override
  State<BottomNavBar> createState() => _BottomNavBarState();
}

class _BottomNavBarState extends State<BottomNavBar> {
  int _selectedIndex = 0;
  final List<Widget> _children = [
    HomeView(),
    SearchBarApp(),
    FavoritosView(),
    ConfigView(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: _children.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
            backgroundColor: Colors.red,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.hiking),
            label: 'Vias',
            backgroundColor: Colors.green,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.star),
            label: 'Favoritas',
            backgroundColor: Colors.purple,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Configurações',
            backgroundColor: Color.fromARGB(255, 66, 66, 66),
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.amber[800],
        onTap: _onItemTapped,
      ),
    );
  }
}
