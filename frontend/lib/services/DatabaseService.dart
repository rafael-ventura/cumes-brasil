import 'package:mysql1/mysql1.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class DatabaseService {

  static MySqlConnection? _connection;

  static Future<void> init() async {
    await dotenv.load(fileName: ".env");
    _connection = await _openConnection();
  }

  static Future<MySqlConnection> _openConnection() async {
    final connectionSettings = ConnectionSettings(
      host: 'localhost',
      port: 3306,
      user: dotenv.env['DB_USER'] ?? 'root',
      db: dotenv.env['DB_NAME'] ?? 'cumes_brasil',
      password: dotenv.env['DB_PASSWORD'],
    );
    return await MySqlConnection.connect(connectionSettings);
  }
}