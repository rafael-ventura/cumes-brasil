import 'package:flutter/material.dart';
import 'package:app_escalada/services/DatabaseService.dart';
import 'package:app_escalada/services/ViasService.dart';
import 'package:app_escalada/models/Via.dart';

void main() async {
  // Garantindo que o Flutter esteja inicializado antes de prosseguir
  WidgetsFlutterBinding.ensureInitialized();

  // Inicializando o banco de dados
  await DatabaseService.init();

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'App de Escalada',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Homepage(),
    );
  }
}

class Homepage extends StatefulWidget {
  @override
  _HomepageState createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  final ViasService _viasService = ViasService();
  List<Via>? _vias;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadVias();
  }

  Future<void> _loadVias() async {
    try {
      _vias = await _viasService.getVias();
    } catch (e) {
      print("Erro ao carregar vias: $e");
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Vias de Escalada'),
      ),
      body: ListView.builder(
        itemCount: _vias?.length ?? 0,
        itemBuilder: (context, index) {
          final via = _vias![index];
          // Aqui, você pode usar um widget personalizado, como MountainClimbCard, para exibir cada 'via'.
          // Por simplicidade, estou usando ListTile. Você pode ajustar conforme sua necessidade.
          return ListTile(
            title: Text(via.via),
            subtitle: Text(via.grau.toString()),
            //... outros campos da 'via'
          );
        },
      ),
    );
  }
}
