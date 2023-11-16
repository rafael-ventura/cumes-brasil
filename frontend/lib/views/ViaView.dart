// lib/widgets/via_card.dart
import 'package:flutter/material.dart';
import 'package:frontend/views/ListagemViasView.dart';

class ViaView extends StatelessWidget {
  final String nome;
  final String grau;
  final String montanha;
  final String image =
      'https://images.squarespace-cdn.com/content/v1/598b7343f7e0abaa677c5fd8/1576953784201-VT0GE0GJTZR6OYRNAN33/escalada-rio-de-janeiro-morro-da-urca-face-norte-2.jpg?format=2500w';

  const ViaView({
    required this.nome,
    required this.grau,
    required this.montanha,
  });

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 10,
        backgroundColor: Colors.green,
        title: Text(
          '$nome',
          selectionColor: Colors.green,
        ),
      ),
      body: Column(
        children: [
          Container(
            color: Colors.amber,
            child: Text('Nome: $nome'),
          ),
          Container(
            color: Colors.amber,
            child: Text('Grau: $grau'),
          ),
          Container(
            color: Colors.amber,
            child: Text('Montanha: $montanha'),
          ),
          Container(
            color: Colors.pink,
            child: InkWell(
              onTap: () {
                // Navegue para a outra página aqui
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          ListagemViasView()), // Substitua 'NovaPagina' pelo nome da sua nova página
                );
              },
              child: Container(
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: Colors.green),
                child: Row(children: [
                  Container(
                    child: Image.network(
                      image,
                      width: 10,
                    ),
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(30.0)),
                  ),
                  Container(
                    width: 20,
                  ),
                  Column(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Container(
                          child: Text(
                            nome,
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        Container(
                          child: Text('$grau - $montanha',
                              style: TextStyle(
                                fontSize: 18,
                              )),
                        ),
                      ]),
                ]),
              ),
            ),
          )
        ],
      ),
    );
  }
}



// TODO- ver o que aproveitar daqui !
/*import 'package:flutter/material.dart';
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
*/