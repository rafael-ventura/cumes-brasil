import 'dart:convert';
import '../models/viaModel.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:io';

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
      final response = await http
          .get(baseUri.replace(queryParameters: {'montanha': nomeMontanha}));
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
        crux: 'Crux 1',
        artificial: 'Sim',
        duracao: '2 horas',
        exposicao: 'Alta',
        extensao: 30.5,
        conquistadores: ['Conquistador 1', 'Conquistador 2'],
        detalhes: 'Detalhes da Via 1',
        data: DateTime.now(),
        montanha: MontanhaModel(
          nome: 'Montanha 1',
          localizacao: 'Local 1',
          altura: 1000,
          imagemUrl:
              'https://upload.wikimedia.org/wikipedia/commons/c/cb/Dedo_de_Deus_vista_do_Soberbo.jpg',
        ),
        face: FaceModel(nome: 'Face 1'),
        fonte: FonteModel(id: 1, referencia: 'Fonte 1'),
        croquis: [
          CroquiModel(id: 1, imagemUrl: 'url1', autor: 'Autor 1'),
          CroquiModel(
              id: 2,
              imagemUrl: 'url2',
              autor: 'Autor 2',
              descricao: 'Descrição 2'),
        ],
        idViaPrincipal: 123,
      ),
      ViaModel(
        id: 'via/V-2',
        nome: 'Via 2',
        grau: '5.8',
        crux: 'Crux 2',
        artificial: 'Não',
        duracao: '1 hora',
        exposicao: 'Moderada',
        extensao: 25.0,
        conquistadores: ['Conquistador 3', 'Conquistador 4'],
        detalhes: 'Detalhes da Via 2',
        data: DateTime.now().subtract(Duration(days: 10)),
        montanha: MontanhaModel(
          nome: 'Montanha 2',
          localizacao: 'Local 2',
          altura: 200,
          imagemUrl:
              'https://images.squarespace-cdn.com/content/v1/598b7343f7e0abaa677c5fd8/1576953784201-VT0GE0GJTZR6OYRNAN33/escalada-rio-de-janeiro-morro-da-urca-face-norte-2.jpg?format=2500w',
        ),
        face: FaceModel(nome: 'Face 2'),
        fonte: FonteModel(id: 2, referencia: 'Fonte 2'),
        croquis: [
          CroquiModel(
              id: 3,
              imagemUrl: 'url3',
              autor: 'Autor 3',
              descricao: 'Descrição 3'),
          CroquiModel(id: 4, imagemUrl: 'url4', autor: 'Autor 4'),
        ],
        idViaPrincipal: 456,
      ),
      ViaModel(
        id: 'via/V-3',
        nome: 'Via 3',
        grau: '5.8',
        crux: 'Crux 3',
        artificial: 'Sim',
        duracao: '1.5 horas',
        exposicao: 'Baixa',
        extensao: 35.0,
        conquistadores: ['Conquistador 5'],
        detalhes: 'Detalhes da Via 3',
        data: DateTime.now().subtract(Duration(days: 20)),
        montanha: MontanhaModel(
          nome: 'Montanha 3',
          localizacao: 'Local 3',
          altura: 400,
          imagemUrl:
              'https://i.pinimg.com/736x/cb/64/a3/cb64a38f4bb6a06a9e4b27998fcfae00.jpg',
        ),
        face: FaceModel(nome: 'Face 1'),
        fonte: FonteModel(id: 3, referencia: 'Fonte 3'),
        croquis: [
          CroquiModel(id: 5, imagemUrl: 'url5', autor: 'Autor 5'),
          CroquiModel(
              id: 6,
              imagemUrl: 'url6',
              autor: 'Autor 6',
              descricao: 'Descrição 6'),
        ],
        idViaPrincipal: 789,
      ),
      ViaModel(
        id: 'via/V-1',
        nome: 'Via do Pico da Neblina',
        grau: '5.11b',
        crux: 'Passagem Técnica da Via',
        artificial: 'Não',
        duracao: '4 horas',
        exposicao: 'Alta',
        extensao: 300.0,
        conquistadores: ['João Almeida', 'Maria Silva'],
        detalhes: 'Uma das vias mais desafiadoras do Pico da Neblina.',
        data: DateTime(2022, 10, 15),
        montanha: MontanhaModel(
            nome: 'Pico da Neblina',
            localizacao: 'Amazonas, Brasil',
            altura: 2994,
            imagemUrl:
                'https://altamontanha.com/wp-content/uploads/2020/12/Pico_da_Neblina_FAB.jpg'),
        face: FaceModel(nome: 'Face Norte'),
        fonte: FonteModel(id: 1, referencia: 'Livro: "Escaladas no Brasil"'),
        croquis: [
          CroquiModel(id: 1, imagemUrl: 'url1', autor: 'Carlos Rocha'),
          CroquiModel(
              id: 2,
              imagemUrl: 'url2',
              autor: 'Ana Oliveira',
              descricao: 'Variação da rota principal.'),
        ],
        idViaPrincipal: 123,
      ),
      ViaModel(
        id: 'via/V-2',
        nome: 'Caminho do Dedo de Deus',
        grau: '5.9',
        crux: 'Travessia na Agulha',
        artificial: 'Não',
        duracao: '2 horas',
        exposicao: 'Moderada',
        extensao: 150.0,
        conquistadores: ['Pedro Souza', 'Fernanda Lima'],
        detalhes:
            'Uma via clássica com vistas incríveis para o Vale do Paraíba.',
        data: DateTime(2022, 9, 5),
        montanha: MontanhaModel(
            nome: 'Dedo de Deus',
            localizacao: 'Rio de Janeiro, Brasil',
            altura: 1692,
            imagemUrl:
                'https://upload.wikimedia.org/wikipedia/commons/c/cb/Dedo_de_Deus_vista_do_Soberbo.jpg'),
        face: FaceModel(nome: 'Face Sul'),
        fonte: FonteModel(id: 2, referencia: 'Guia de escaladas online'),
        croquis: [
          CroquiModel(
              id: 3,
              imagemUrl: 'url3',
              autor: 'Rafaela Santos',
              descricao: 'Detalhes da crux.'),
          CroquiModel(id: 4, imagemUrl: 'url4', autor: 'Marcos Oliveira'),
        ],
        idViaPrincipal: 456,
      ),
      ViaModel(
        id: 'via/V-3',
        nome: 'Rota da Pedra Bonita',
        grau: '5.10c',
        crux: 'Paredão Vertical',
        artificial: 'Não',
        duracao: '3 horas',
        exposicao: 'Baixa',
        extensao: 250.0,
        conquistadores: ['Ana Carolina'],
        detalhes:
            'Uma via desafiadora com uma bela vista da cidade do Rio de Janeiro.',
        data: DateTime(2022, 8, 20),
        montanha: MontanhaModel(
            nome: 'Pedra Bonita',
            localizacao: 'Rio de Janeiro, Brasil',
            altura: 693,
            imagemUrl:
                'https://trilhandomontanhas.com/arquivos/2017-02/pedra-bonita-parque-da-tijuca-rio-de-janeiro-por-marcella-moraes-maior.jpg'),
        face: FaceModel(nome: 'Face Oeste'),
        fonte: FonteModel(
            id: 3, referencia: 'Relato de escalada no site ClimbBrasil'),
        croquis: [
          CroquiModel(id: 5, imagemUrl: 'url5', autor: 'José Silva'),
          CroquiModel(
              id: 6,
              imagemUrl: 'url6',
              autor: 'Mariana Costa',
              descricao: 'Variação para escaladores experientes.'),
        ],
        idViaPrincipal: 789,
      ),
      ViaModel(
        id: 'via/V-5',
        nome: 'Via 5',
        grau: '5.11c',
        crux: 'Crux 5',
        artificial: 'Não',
        duracao: '1.8 horas',
        exposicao: 'Moderada',
        extensao: 40.0,
        conquistadores: ['Conquistador 6', 'Conquistador 7'],
        detalhes: 'Detalhes da Via 5',
        data: DateTime.now().subtract(Duration(days: 15)),
        montanha: MontanhaModel(
          nome: 'Montanha 4',
          localizacao: 'Local 4',
          altura: 800,
        ),
        face: FaceModel(nome: 'Face 3'),
        fonte: FonteModel(id: 4, referencia: 'Fonte 4'),
        croquis: [
          CroquiModel(id: 7, imagemUrl: 'url7', autor: 'Autor 7'),
          CroquiModel(
              id: 8,
              imagemUrl: 'url8',
              autor: 'Autor 8',
              descricao: 'Descrição 8'),
        ],
        idViaPrincipal: 101,
      ),
      ViaModel(
        id: 'via/V-6',
        nome: 'Via 6',
        grau: '5.9',
        crux: 'Crux 6',
        artificial: 'Sim',
        duracao: '1.2 horas',
        exposicao: 'Baixa',
        extensao: 28.0,
        conquistadores: ['Conquistador 8'],
        detalhes: 'Detalhes da Via 6',
        data: DateTime.now().subtract(Duration(days: 25)),
        montanha: MontanhaModel(
          nome: 'Montanha 5',
          localizacao: 'Local 5',
          altura: 600,
        ),
        face: FaceModel(nome: 'Face 2'),
        fonte: FonteModel(id: 5, referencia: 'Fonte 5'),
        croquis: [
          CroquiModel(id: 9, imagemUrl: 'url9', autor: 'Autor 9'),
          CroquiModel(
              id: 10,
              imagemUrl: 'url10',
              autor: 'Autor 10',
              descricao: 'Descrição 10'),
        ],
        idViaPrincipal: 202,
      ),
      ViaModel(
        id: 'via/V-7',
        nome: 'Via 7',
        grau: '5.12b',
        crux: 'Crux 7',
        artificial: 'Não',
        duracao: '2.5 horas',
        exposicao: 'Alta',
        extensao: 45.0,
        conquistadores: ['Conquistador 9', 'Conquistador 10'],
        detalhes: 'Detalhes da Via 7',
        data: DateTime.now().subtract(Duration(days: 30)),
        montanha: MontanhaModel(
          nome: 'Montanha 6',
          localizacao: 'Local 6',
          altura: 1200,
        ),
        face: FaceModel(nome: 'Face 4'),
        fonte: FonteModel(id: 6, referencia: 'Fonte 6'),
        croquis: [
          CroquiModel(id: 11, imagemUrl: 'url11', autor: 'Autor 11'),
          CroquiModel(
              id: 12,
              imagemUrl: 'url12',
              autor: 'Autor 12',
              descricao: 'Descrição 12'),
        ],
        idViaPrincipal: 303,
      ),
      ViaModel(
        id: 'via/V-8',
        nome: 'Via 8',
        grau: '5.10d',
        crux: 'Crux 8',
        artificial: 'Sim',
        duracao: '1.5 horas',
        exposicao: 'Moderada',
        extensao: 35.0,
        conquistadores: ['Conquistador 11'],
        detalhes: 'Detalhes da Via 8',
        data: DateTime.now().subtract(Duration(days: 12)),
        montanha: MontanhaModel(
          nome: 'Montanha 7',
          localizacao: 'Local 7',
          altura: 900,
        ),
        face: FaceModel(nome: 'Face 1'),
        fonte: FonteModel(id: 7, referencia: 'Fonte 7'),
        croquis: [
          CroquiModel(id: 13, imagemUrl: 'url13', autor: 'Autor 13'),
          CroquiModel(
              id: 14,
              imagemUrl: 'url14',
              autor: 'Autor 14',
              descricao: 'Descrição 14'),
        ],
        idViaPrincipal: 404,
      ),
    ];
  }
}

// List<ViaModel> vias = [
//       ViaModel(id: 1, nome: 'Via 1', grau: '5.10a'),
//       ViaModel(id: 2, nome: 'Via 2', grau: '5.8'),
//       // Adicione mais vias conforme necessário
// ];