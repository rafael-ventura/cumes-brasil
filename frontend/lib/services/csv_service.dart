import 'package:flutter/services.dart';
import 'package:csv/csv.dart';

class CsvService {
  Future<List<List<dynamic>>> loadCsvData(String assetPath) async {
    var result = await rootBundle.loadString(assetPath);
    return const CsvToListConverter().convert(result, eol: "\n");
  }
}
