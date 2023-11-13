import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../widgets/ViaCard.dart';

class Via {
  final int id;
  final String nome;
  final String grau;
  final String montanha;

  Via({
    required this.id,
    required this.nome,
    required this.grau,
    required this.montanha,
  });

  factory Via.fromJson(Map<String, dynamic> json) {
    return Via(
      id: json['id'],
      nome: json['nome'],
      grau: json['grau'],
      montanha:
          json['id_montanha'].toString(), // Ajuste para acessar 'id_montanha'
    );
  }
}

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
      final response = await http
          .get(Uri.http('localhost:4000', 'api/vias')); // consulta feita no id
      print(response.body); //resposta do print é obtida como linha única (id)
      if (response.statusCode == 200) {
        setState(() {
          vias = List<Map<String, dynamic>>.from(json.decode(response.body));
          print(response.body);
        });
      } else {
        print('Erro ao buscar vias: ${response.statusCode}');
      }
    } catch (error) {
      print('Erro de conexão: $error');
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
              nome: via['Nome'] ?? 'Nome não disponível',
              grau: via['Grau'] ?? 'Grau não disponível',
              montanha: via['Montanha'] ?? 'Montanha não disponível',
            ),
          );
        },
      ),
    );
  }
}
