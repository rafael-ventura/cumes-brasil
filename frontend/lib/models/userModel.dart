import 'package:frontend/models/viaModel.dart';

class UserModel {
  String id; // Formato "usuario/U-1"
  String nome;
  String email;
  List<ColecaoModel> colecoes;
  List<HistoricoModel> historico;
  List<FavoritoModel> favoritos;

  UserModel({
    required this.id,
    required this.nome,
    required this.email,
    required this.colecoes,
    required this.historico,
    required this.favoritos,
  });
}

class ColecaoModel {
  int id;
  String nome;
  String descricao;
  List<ViaModel> vias;

  ColecaoModel({
    required this.id,
    required this.nome,
    required this.descricao,
    required this.vias,
  });
}

class HistoricoModel extends ColecaoModel {
  DateTime data;

  HistoricoModel({
    required int id,
    required String nome,
    required String descricao,
    required List<ViaModel> vias,
    required this.data,
  }) : super(id: id, nome: nome, descricao: descricao, vias: vias);
}

class FavoritoModel extends ColecaoModel {
  FavoritoModel({
    required int id,
    required String nome,
    required String descricao,
    required List<ViaModel> vias,
  }) : super(id: id, nome: nome, descricao: descricao, vias: vias);
}
