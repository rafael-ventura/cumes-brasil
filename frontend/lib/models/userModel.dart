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
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      nome: json['nome'],
      email: json['email'],
      colecoes: List<ColecaoModel>.from(
        (json['colecoes'] as List).map(
          (colecaoJson) => ColecaoModel.fromJson(colecaoJson),
        ),
      ),
      historico: List<HistoricoModel>.from(
        (json['historico'] as List).map(
          (historicoJson) => HistoricoModel.fromJson(historicoJson),
        ),
      ),
      favoritos: List<FavoritoModel>.from(
        (json['favoritos'] as List).map(
          (favoritoJson) => FavoritoModel.fromJson(favoritoJson),
        ),
      ),
    );
  }
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nome': nome,
      'email': email,
      'colecoes': colecoes.map((colecao) => colecao.toJson()).toList(),
      'historico': historico.map((historico) => historico.toJson()).toList(),
      'favoritos': favoritos.map((favorito) => favorito.toJson()).toList(),
    };
  }
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
  factory ColecaoModel.fromJson(Map<String, dynamic> json) {
    return ColecaoModel(
      id: json['id'],
      nome: json['nome'],
      descricao: json['descricao'],
      vias: List<ViaModel>.from(
        (json['vias'] as List).map(
          (viaJson) => ViaModel.fromJson(viaJson),
        ),
      ),
    );
  }
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nome': nome,
      'descricao': descricao,
      'vias': vias.map((via) => via.toJson()).toList(),
    };
  }
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

  factory HistoricoModel.fromJson(Map<String, dynamic> json) {
    return HistoricoModel(
      id: json['id'],
      nome: json['nome'],
      descricao: json['descricao'],
      vias: List<ViaModel>.from(
        (json['vias'] as List).map(
          (viaJson) => ViaModel.fromJson(viaJson),
        ),
      ),
      data: DateTime.parse(json['data']),
    );
  }
  @override
  Map<String, dynamic> toJson() {
    // Chama o toJson da classe pai (ColecaoModel) e adiciona os campos específicos de HistoricoModel
    Map<String, dynamic> json = super.toJson();
    json['data'] = data.toIso8601String();
    return json;
  }
}

class FavoritoModel extends ColecaoModel {
  FavoritoModel({
    required int id,
    required String nome,
    required String descricao,
    required List<ViaModel> vias,
  }) : super(id: id, nome: nome, descricao: descricao, vias: vias);

  factory FavoritoModel.fromJson(Map<String, dynamic> json) {
    return FavoritoModel(
      id: json['id'],
      nome: json['nome'],
      descricao: json['descricao'],
      vias: List<ViaModel>.from(
        (json['vias'] as List).map(
          (viaJson) => ViaModel.fromJson(viaJson),
        ),
      ),
    );
  }
  @override
  Map<String, dynamic> toJson() {
    // Chama o toJson da classe pai (ColecaoModel) e adiciona os campos específicos de FavoritoModel
    Map<String, dynamic> json = super.toJson();
    // Adicione campos específicos de FavoritoModel, se houver
    return json;
  }
}
