import 'dart:convert';
import '../models/viaModel.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:io';

class ViaController {
  final baseUri = Uri.http('localhost:4000', '/api/vias');

  Future<List<ViaModel>> postVia(ViaModel novaVia) async {
    try {
      final response = await http.post(
        baseUri, headers: {'Content-Type': 'application/json'},
        body:
            jsonEncode(novaVia.toJson()), // Converte o objeto ViaModel em JSON
      );
      if (response.statusCode == 200) {
        return List<ViaModel>.from(json.decode(response.body));
      } else {
        throw Exception('Erro ao criar via: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Erro de conexão: $error');
    }
  }

  Future<ViaModel> getById(int id) async {
    try {
      final response = await http.get(baseUri.replace(path: '$id'));
      if (response.statusCode == 200) {
        return ViaModel.fromJson(json.decode(response.body));
      } else {
        throw Exception('Erro ao buscar vias: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Erro de conexão: $error');
    }
  }

  Future<List<ViaModel>> getAll() async {
    try {
      final response = await http.get(Uri.http('localhost:4000', '/api/vias'));
      print(response.body);
      if (response.statusCode == 200) {
        final List<dynamic> responseData = json.decode(response.body);
        final List<ViaModel> vias =
            responseData.map((viaJson) => ViaModel.fromJson(viaJson)).toList();
        return vias;
      } else {
        throw Exception('Erro ao buscar vias: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Erro de conexão: $error');
    }
  }

  Future<List<ViaModel>> getViasFromJsonFile() async {
    try {
      String data = await rootBundle.loadString('assets/vias_data.json');

      List<dynamic> viasJson = json.decode(data);
      List<ViaModel> vias = viasJson
          .map((json) => ViaModel.fromJson(json.cast<String, dynamic>()))
          .toList(); // Converte o JSON para ViaModel usando o construtor fromJson
      return vias;
    } catch (error) {
      throw Exception('Erro ao carregar vias do arquivo JSON: $error');
    }
  }

  Future<List<ViaModel>> getMontanha(String nomeMontanha) async {
    try {
      final response = await http
          .get(baseUri.replace(queryParameters: {'montanha': nomeMontanha}));
      if (response.statusCode == 200) {
        return List<ViaModel>.from(json.decode(response.body));
      } else {
        throw Exception(
            'Erro ao buscar vias por montanha: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Erro de conexão: $error');
    }
  }
}

// List<ViaModel> vias = [
//       ViaModel(id: 1, nome: 'Via 1', grau: '5.10a'),
//       ViaModel(id: 2, nome: 'Via 2', grau: '5.8'),
//       // Adicione mais vias conforme necessário
// ];