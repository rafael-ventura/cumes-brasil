import 'dart:convert';
import '../models/userModel.dart';
import 'package:http/http.dart' as http;

class UserController {
  final baseUri = Uri.http('localhost:4000', '/api/user');

  Future<List<UserModel>> getById(int id) async {
    try {
      final response = await http.get(baseUri.replace(path: '$id'));
      if (response.statusCode == 200) {
        return List<UserModel>.from(json.decode(response.body));
      } else {
        throw Exception('Erro ao buscar vias: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Erro de conexão: $error');
    }
  }

  //novo usuário
  Future<List<UserModel>> postUser() async {
    try {
      final response = await http.get(baseUri.replace(path: ''));
      if (response.statusCode == 200) {
        return List<UserModel>.from(json.decode(response.body));
      } else {
        throw Exception('Erro ao buscar vias: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Erro de conexão: $error');
    }
  }

  Future<List<UserModel>> getFavoritos(UserModel dynamic) async {
    try {
      final response = await http.get(baseUri.replace(path: 'favoritos'));
      if (response.statusCode == 200) {
        return List<UserModel>.from(json.decode(response.body));
      } else {
        throw Exception('Erro ao buscar vias: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Erro de conexão: $error');
    }
  }

  Future<List<UserModel>> putFavorito(UserModel dynamic) async {
    try {
      final response = await http.get(baseUri.replace(path: 'favoritos'));
      if (response.statusCode == 200) {
        return List<UserModel>.from(json.decode(response.body));
      } else {
        throw Exception('Erro ao buscar vias: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Erro de conexão: $error');
    }
  }
}
