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

  // busca as vias que tenham a montanha pesquisada
  Future<List<ViaModel>> getMontanha(String nomeMontanha) async {
    try {
      final response = await http.get(
          baseUri.replace(queryParameters: {'montanha': nomeMontanha}));
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

  List<ViaModel> mockVias() {
    return [
      ViaModel(
        id: 'via/V-1',
        nome: 'Via 1',
        grau: '5.10a',
        montanha: MontanhaModel(
            nome: 'Montanha 1', localizacao: 'Local 1', altura: 1000),
        face: FaceModel(nome: 'Face 1'),
      ),
      ViaModel(
        id: 'via/V-2',
        nome: 'Via 2',
        grau: '5.8',
        montanha: MontanhaModel(
            nome: 'Montanha 2', localizacao: 'Local 2', altura: 200),
        face: FaceModel(nome: 'Face 2'),
      ),
      ViaModel(
        id: 'via/V-3',
        nome: 'Via 3',
        grau: '5.8',
        montanha: MontanhaModel(
            nome: 'Montanha 3', localizacao: 'Local 3', altura: 400),
        face: FaceModel(nome: 'Face 1'),
      ),
      // Adicione mais vias conforme necessário
    ];
  }
}

// List<ViaModel> vias = [
//       ViaModel(id: 1, nome: 'Via 1', grau: '5.10a'),
//       ViaModel(id: 2, nome: 'Via 2', grau: '5.8'),
//       // Adicione mais vias conforme necessário
// ];