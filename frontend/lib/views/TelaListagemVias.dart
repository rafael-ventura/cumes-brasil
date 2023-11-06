// listagem_vias.dart
import 'package:flutter/material.dart';
import 'package:http/https.dart' as http;
import 'dart:convert';

import '../widgets/ViaCard.dart';

// VALIDAR

class ListagemVias extends StatefulWidget {
  @override
  _ListagemViasState createState() => _ListagemViasState();
}

class _ListagemViasState extends State<ListagemVias> {
  List<Map<String, dynamic>> vias = [];

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    try {
      final response = await http.get(Uri.parse('http://localhost:8080/api/vias/'));
      if (response.statusCode == 200) {
        setState(() {
          vias = List<Map<String, dynamic>>.from(json.decode(response.body));
        });
      } else {
        print('Erro ao buscar vias: ${response.statusCode}');
      }
    } catch (error) {
      print('Erro ao buscar vias: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Listagem de Vias'),
      ),
      body: ListView.builder(
        itemCount: vias.length,
        itemBuilder: (context, index) {
          final via = vias[index];
          return InkWell(
            onTap: () {
              Navigator.pushNamed(
                context,
                'DetalhesVia',
                arguments: {'viaId': via['id']},
              );
            },
            child: ViaCard(
              nome: via['nome'],
              grau: via['grau'],
              montanha: via['montanha'],
            ),
          );
        },
      ),
    );
  }
}