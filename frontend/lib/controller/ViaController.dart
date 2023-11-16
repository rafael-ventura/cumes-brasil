import 'dart:convert';
import '../models/viaModel.dart';
import 'package:http/http.dart' as http;

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

  Future<List<ViaModel>> getById(int id) async {
    try {
      final response = await http.get(baseUri.replace(path: '$id'));
      if (response.statusCode == 200) {
        return List<ViaModel>.from(json.decode(response.body));
      } else {
        throw Exception('Erro ao buscar vias: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Erro de conexão: $error');
    }
  }

  Future<List<ViaModel>> getAll() async {
    try {
      final response = await http.get(baseUri);
      if (response.statusCode == 200) {
        return List<ViaModel>.from(json.decode(response.body));
      } else {
        throw Exception('Erro ao buscar vias: ${response.statusCode}');
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