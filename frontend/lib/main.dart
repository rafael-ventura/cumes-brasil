import 'package:flutter/material.dart';
import 'package:frontend/views/MainView.dart';
import 'package:frontend/widgets/barraDeNavegacao/NavBar.dart';

void main() {
  runApp(MaterialApp(
    title: "Cume Brasil",
    home: MyApp(),
  ));
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: NavBar(), // Use o NavBar2 como o novo widget principal
    );
  }
}
