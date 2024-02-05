import 'package:flutter/material.dart';
import 'package:frontend/controller/ViaController.dart';
import 'package:frontend/models/viaModel.dart'; // Certifique-se de importar o arquivo correto

class MontanhaComponent extends StatefulWidget {
  final int montanha_id;

  MontanhaComponent({required this.montanha_id});

  @override
  _MontanhaComponentState createState() => _MontanhaComponentState();
}

class _MontanhaComponentState extends State<MontanhaComponent> {
  late Future<MontanhaModel> montanhaFuture;

  @override
  void initState() {
    super.initState();
    montanhaFuture = getMontanha(widget.montanha_id);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<MontanhaModel>(
      future: montanhaFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return CircularProgressIndicator();
        } else if (snapshot.hasError) {
          return Text('Erro ao carregar dados da montanha: ${snapshot.error}');
        } else if (!snapshot.hasData) {
          return Text('Nenhum dado da montanha encontrado.');
        } else {
          MontanhaModel montanha = snapshot.data!;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('${montanha.nome}'),
              // Adicione mais campos conforme necessário
            ],
          );
        }
      },
    );
  }

  Future<MontanhaModel> getMontanha(int montanha_id) async {
    try {
      ViaController viaController = ViaController(); // Crie uma instância
      MontanhaModel montanha = await viaController.getMontanhaById(montanha_id);
      print(montanha);
      return montanha;
    } catch (error) {
      throw Exception('Erro ao buscar montanha: $error');
    }
  }

  Future<MontanhaModel> getMontanhaMock(int montanha_id) async {
    try {
      ViaController viaController = ViaController(); // Crie uma instância
      MontanhaModel montanha =
          await viaController.getMontanhaByIdromJsonFile(montanha_id);
      print(montanha);
      return montanha;
    } catch (error) {
      throw Exception('Erro ao buscar montanha: $error');
    }
  }
}
