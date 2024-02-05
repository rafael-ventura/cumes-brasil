import 'package:flutter/material.dart';
import 'package:frontend/views/FavoritosView.dart';
import 'package:frontend/views/HomeView.dart';
import 'package:frontend/views/PerfilView.dart';
import 'package:frontend/views/ViasView.dart';

class NavBarService {
  static final NavBarService _instance = NavBarService._internal();

  factory NavBarService() {
    return _instance;
  }

  NavBarService._internal();

  int selectedIndex = 0;
  final List<Widget> pages = [
    HomeView(),
    ViasView(),
    FavoritosView(),
    PerfilView(),
  ];
}
