import 'dart:convert';
import '../models/userModel.dart';
import 'package:http/http.dart' as http;

class UserController {
  final baseUri = Uri.http('localhost:4000', '/api/user');

  Future<UserModel> postUser({
    required String nome,
    required String email,
    required String senha,
  }) async {
    try {
      UserModel novoUsuario = UserModel(
        id: '', //chat GPT: preciso passar o id aqui? e como passo?
        nome: nome,
        email: email,
        colecoes: [],
        historico: [],
        favoritos: [],
      );

      print('JSON de novoUsuario antes da codificação:');
      print(novoUsuario.toJson());

      final response = await http.post(
        baseUri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(
            novoUsuario.toJson()), // Converte o objeto UserModel em JSON
      );
      if (response.statusCode == 200) {
        return UserModel.fromJson(json.decode(response.body));
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

  Future<bool> getUserNome(String nome) async {
    try {
      final response = await http.get(
        Uri.http('localhost:4000', '/api/user/getUserNome/$nome'),
      );
      if (response.statusCode == 200) {
        // Verifica se o usuário com o nome fornecido existe
        return json.decode(response.body)['existe'] == true;
      } else {
        throw Exception('Erro ao verificar nome: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Erro de conexão: $error');
    }
  }

  Future<bool> getUserEmail(String email) async {
    try {
      final response = await http.get(
        Uri.http('localhost:4000', '/api/user/getUserEmail/$email'),
      );
      if (response.statusCode == 200) {
        // Verifica se o usuário com o email fornecido existe
        return json.decode(response.body)['existe'] == true;
      } else {
        throw Exception('Erro ao verificar email: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Erro de conexão: $error');
    }
  }

  //Necessário fazer ajuste para consultar nome existente - ideia seria fazer um get nome, e validar se ele já existe
  Future<bool> verificarNomeExistente(String nome) async {
    try {
      // Use o método getUserNome para verificar a existência do nome
      return await getUserNome(nome);
    } catch (error) {
      throw Exception('Erro ao verificar nome: $error');
    }
  }

  Future<bool> verificarEmailExistente(String email) async {
    try {
      // Use o método getUserNome para verificar a existência do email
      return await getUserEmail(email);
    } catch (error) {
      throw Exception('Erro ao verificar email: $error');
    }
  }

  Future<bool> autenticarUsuario({
    required String email,
    required String senha,
  }) async {
    try {
      // Lógica de autenticação aqui
      // ...
      return true; // ou false, dependendo da lógica de autenticação
    } catch (error) {
      throw Exception('Erro ao autenticar usuário: $error');
    }
  }
}
