import 'package:app_escalada/views//MountainClimbCard.dart';
import 'package:flutter/material.dart';
import 'package:app_escalada/models/MountainClimb.dart';
import 'package:app_escalada/services/csv_service.dart';


void main() {
  runApp(
    const MaterialApp(
      home: Homepage(),
    ),
  );
}

class Homepage extends StatefulWidget {
  const Homepage({super.key});

  @override
  State<Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  List<MountainClimb>? mountainClimbs;
  bool isLoading = true;
  String? errorMessage;

  final CsvService _csvService = CsvService();

  @override
  void initState() {
    super.initState();
    loadCsvData();
  }

  Future<void> loadCsvData() async {
    try {
      final csvData = await _csvService.loadCsvData("assets/ViasEscaladaZonaSul.csv");
      mountainClimbs = csvData
          .skip(1) //ignorar todos headers
          .map((row) => MountainClimb(
            mountain: (row[0] ?? 'Desconhecido').toString(),
            altitude: row[1] ?? 'Desconhecido',
            face: (row[2] ?? 'Desconhecido').toString(),
            via: (row[3] ?? 'Desconhecido').toString(),
            generalGrade: row[4] ?? 'Desconhecido',
            cruxGrade: row[5] ?? 'Desconhecido',
            artificialGrade: row[6] ?? 'Desconhecido',
            durationGrade: row[7] ?? 'Desconhecido',
            exposureGrade: row[8] ?? 'Desconhecido',
            extension: row[9] ?? 'Desconhecido',
            conquerors: row[10] ?? 'Desconhecido',
            conquestDate: row[11] ?? 'Desconhecido',
          ))
              .toList();

      setState(() {
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
        errorMessage = "Erro ao carregar os dados: $e";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.red,
        title: const Text("Catalogo Escaladas"),
      ),

      body: _buildBodyContent(),
    );
  }

  Widget _buildBodyContent() {
    if (isLoading) {
      return const CircularProgressIndicator();
    } else if (errorMessage != null) {
      return Text(errorMessage!);
    } else {
      return _buildCsvDataTable();
    }
  }

  Widget _buildCsvDataTable() {
    if (mountainClimbs == null || mountainClimbs!.isEmpty) {
      return const Text("Dados não carregados");
    }

    return ListView.builder(
      itemCount: mountainClimbs!.length,
      itemBuilder: (BuildContext context, int index) {
        return MountainClimbCard(climb: mountainClimbs![index]);
      },
    );
  }


}


