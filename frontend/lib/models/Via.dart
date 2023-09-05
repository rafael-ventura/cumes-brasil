class Via {
  final int id;
  final String via;
  final int? grau;
  final String? crux;
  final String? aid;
  final String? duracao;
  final String? exposicao;
  final int? extensao;
  final String? conquistadores;
  final String? data;
  final int mountId;
  final int faceId;
  final int? sourceId;
  final int? varianteId;

  Via({
    required this.id,
    required this.via,
    this.grau,
    this.crux,
    this.aid,
    this.duracao,
    this.exposicao,
    this.extensao,
    this.conquistadores,
    this.data,
    required this.mountId,
    required this.faceId,
    this.sourceId,
    this.varianteId,
  });
}

