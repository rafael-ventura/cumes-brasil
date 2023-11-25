class ViaModel {
  int id;
  String nome;
  String? grau;
  String? crux;
  String? artificial;
  String? duracao;
  String? exposicao;
  String? extensao;
  String? conquistadores;
  String? detalhes;
  String? data;
  String? montanha;
  String? face;
  String? fonte;
  List<CroquiModel>? croquis;
  String? viaPrincipal;

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
      'data': data,
      'montanha': montanha,
      'face': face,
      'fonte': fonte,
      'croquis': croquis?.map((croqui) => croqui.toJson()).toList(),
      'idViaPrincipal': viaPrincipal,
    };
  }

  factory ViaModel.fromJson(Map<String, dynamic> json) {
    return ViaModel(
      id: json['Id'],
      nome: json['Nome'],
      grau: json['Grau'],
      crux: json['Crux'],
      artificial: json['Artificial'],
      duracao: json['Duracao'],
      exposicao: json['Exposicao'],
      extensao: json['Extensao'],
      conquistadores: json['Conquistadores'],
      detalhes: json['Detalhes'],
      data: json['Data'],
      montanha: json['Montanha'], // Mapear corretamente o campo montanha
      face: json['IdFace'],
      fonte: json['IdFonte'],
      croquis: json['Croquis'] != null
          ? (json['Croquis'] as List<dynamic>)
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
  String? localizacao;
  String? altura;
  String? imagemUrl;

  MontanhaModel(
      {required this.id,
      required this.nome,
      this.localizacao,
      this.altura,
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
      id: json['Id'],
      nome: json['Nome'],
      localizacao: json['localizacao'],
      altura: json['altura'], // Convertendo para double, se existir
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
