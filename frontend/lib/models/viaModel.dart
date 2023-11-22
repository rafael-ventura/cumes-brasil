class ViaModel {
  int id;
  String nome;
  String? grau;
  String? crux;
  String? artificial;
  String? duracao;
  String? exposicao;
  double? extensao;
  List<String>? conquistadores;
  String? detalhes;
  DateTime? data;
  int? montanha;
  int? face;
  FonteModel? fonte;
  List<CroquiModel>? croquis;
  int? viaPrincipal;

  ViaModel({
    required this.id,
    required this.nome,
    this.grau,
    this.crux,
    this.artificial,
    this.duracao,
    this.exposicao,
    this.extensao,
    this.conquistadores,
    this.detalhes,
    this.data,
    this.montanha,
    this.face,
    this.fonte,
    this.croquis,
    this.viaPrincipal,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nome': nome,
      'grau': grau,
      'crux': crux,
      'artificial': artificial,
      'duracao': duracao,
      'exposicao': exposicao,
      'extensao': extensao,
      'conquistadores': conquistadores,
      'detalhes': detalhes,
      'data': data?.toIso8601String(),
      'montanha': montanha,
      'face': face,
      'fonte': fonte?.toJson(),
      'croquis': croquis?.map((croqui) => croqui.toJson()).toList(),
      'idViaPrincipal': viaPrincipal,
    };
  }

  factory ViaModel.fromJson(Map<String, dynamic> json) {
    return ViaModel(
      id: json['id'],
      nome: json['nome'],
      grau: json['grau'],
      crux: json['crux'],
      artificial: json['artificial'],
      duracao: json['duracao'],
      exposicao: json['exposicao'],
      extensao: json['extensao']?.toDouble(),
      conquistadores: json['conquistadores'] != null
          ? List<String>.from(json['conquistadores'])
          : null,
      detalhes: json['detalhes'],
      data: json['data'] != null ? DateTime.parse(json['data']) : null,
      montanha: json['montanha'], // Mapear corretamente o campo montanha
      face: json['id_face'],
      fonte: json['id_fonte'] != null
          ? FonteModel.fromJson(json['id_fonte'])
          : null,
      croquis: json['croquis'] != null
          ? (json['croquis'] as List<dynamic>)
              .map((croqui) => CroquiModel.fromJson(croqui))
              .toList()
          : null,
      viaPrincipal: json['id_viaPrincipal'],
    );
  }
}

class MontanhaModel {
  int id;
  String nome;
  String localizacao;
  double altura;
  String? imagemUrl;

  MontanhaModel(
      {required this.id,
      required this.nome,
      required this.localizacao,
      required this.altura,
      this.imagemUrl});

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nome': nome,
      'localizacao': localizacao,
      'altura': altura,
      'imagemUrl': imagemUrl
    };
  }

  factory MontanhaModel.fromJson(Map<String, dynamic> json) {
    return MontanhaModel(
      id: json['id'],
      nome: json['nome'],
      localizacao: json['localizacao'],
      altura: json['altura']?.toDouble() ??
          0.0, // Convertendo para double, se existir
      imagemUrl: json['imagemUrl'],
    );
  }
}

class FaceModel {
  int? id;
  String nome;

  FaceModel({
    this.id,
    required this.nome,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'nome': nome,
    };
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nome': nome,
    };
  }

  factory FaceModel.fromJson(Map<String, dynamic> json) {
    return FaceModel(
      id: json['id'],
      nome: json['nome'],
    );
  }
}

class FonteModel {
  int? id;
  String referencia;

  FonteModel({
    this.id,
    required this.referencia,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'referencia': referencia,
    };
  }

  factory FonteModel.fromJson(Map<String, dynamic> json) {
    return FonteModel(
      id: json['id'],
      referencia: json['referencia'],
    );
  }
}

class CroquiModel {
  int? id;
  String imagemUrl;
  String autor;
  String? descricao;

  CroquiModel({
    this.id,
    required this.imagemUrl,
    required this.autor,
    this.descricao,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'imagemUrl': imagemUrl,
      'autor': autor,
      'descricao': descricao,
    };
  }

  factory CroquiModel.fromJson(Map<String, dynamic> json) {
    return CroquiModel(
      id: json['id'],
      imagemUrl: json['imagemUrl'],
      autor: json['autor'],
      descricao: json['descricao'],
    );
  }
}
