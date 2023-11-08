import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../widgets/ViaCard.dart';

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
      final ravenDB =
          'https://a.free.jardineiros.ravendb.cloud/databases/cumes_brasil/docs';
      final response = await http.get(Uri.parse(ravenDB));
      if (response.statusCode == 200) {
        setState(() {
          vias = List<Map<String, dynamic>>.from(
              json.decode(response.body)['Results']);
        });
      } else {
        print('Erro ao buscar vias: ${response.statusCode}');
      }
    } catch (error) {
      print('Erro ao buscar vias2: $error');
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
              // Você pode navegar para uma página de detalhes aqui.
            },
            child: ViaCard(
              nome: via['Nome'],
              grau: via['Grau'],
              montanha: via['Montanha']['Nome'],
            ),
          );
        },
      ),
    );
  }
}
