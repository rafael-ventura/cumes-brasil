class Variante {
  final int varianteId;
  final String via;
  final int? grau;
  final String? crux;
  final String? aid;
  final String? duracao;
  final String? exposicao;
  final int? extensao;
  final String? conquistadores;
  final String? data;
  final int? sourceId;

  Variante({
    required this.varianteId,
    required this.via,
    this.grau,
    this.crux,
    this.aid,
    this.duracao,
    this.exposicao,
    this.extensao,
    this.conquistadores,
    this.data,
    this.sourceId,
  });
}
