import '../models/Via.dart';
import 'DatabaseService.dart';

class ViasService {
  Future<void> createVia(Via via) async {
    final conn = await DatabaseService.getConnection();
    try {
      await conn.query('INSERT INTO vias_main VALUES (?, ?, ?, ...)', [
        via.via,
        via.grau,
        via.crux,
        via.aid,
        via.duracao,
        via.exposicao,
        via.extensao,
        via.conquistadores,
        via.data,
        via.sourceId
      ]);
    } catch (e) {
      throw ('Erro ao inserir via: $e');
    } finally {
      conn.close();
    }
  }

  Future<List<Via>> getVias() async {
    final conn = await DatabaseService.getConnection();
    final results = await conn.query('SELECT * FROM vias_main');

    List<Via> vias = [];
    for (var row in results) {
      vias.add(Via(
        id: row['id'],
        via: row['vias'],
        grau: row['grau'],
        mountId: row['mount_id'],
        faceId: row['face_id'],
      ));
    }
    return vias;
  }

// UPDATE
  Future<void> updateVia(Via via) async {
    final conn = await DatabaseService.getConnection();
    try {
      await conn.query(
          'UPDATE vias_main SET '
            'vias = ?, grau = ?, crux = ?, aid = ?, '
            'duracao = ?, '
            'exposicao = ?, extensao = ?, '
            'data = ?, '
            'mount_id = ?, face_id = ?, '
            'source_id = ?, variante_id = ? '
          'WHERE id = ?',
          [
            via.via,
            via.grau,
            via.crux,
            via.aid,
            via.duracao,
            via.exposicao,
            via.extensao,
            via.data,
            via.mountId,
            via.faceId,
            via.sourceId,
            via.varianteId,
            via.id
          ]);
    } catch (e) {
      throw ('Erro ao atualizar via: $e');
    } finally {
      conn.close();
    }
  }

// DELETE
  Future<void> deleteVia(int id) async {
    final conn = await DatabaseService.getConnection();
    try {
      final relatedRecords = await conn.query('SELECT * FROM vias_variantes WHERE via_id = ?', [id]);
      if (relatedRecords.isNotEmpty) {
        await conn.query('DELETE FROM vias_variantes WHERE via_id = ?', [id]);
      }

      await conn.query('DELETE FROM vias_main WHERE id = ?', [id]);
    } catch (e) {
      throw ('Erro ao excluir via: $e');
    } finally {
      conn.close();
    }
  }
}
