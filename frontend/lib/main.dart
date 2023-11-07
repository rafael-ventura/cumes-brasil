import 'package:flutter/material.dart';
import 'package:frontend/widgets/NavBar2.dart';

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
      home: NavBar2(),
    );
  }
}
