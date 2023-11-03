import 'package:app_escalada/models/MountainClimb.dart';
import 'package:flutter/material.dart';

class MountainClimbCard extends StatelessWidget {
  final MountainClimb climb;

  MountainClimbCard({required this.climb, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 15.0),
      elevation: 5.0,
      child: ListTile(
        leading: const Icon(Icons.landscape, size: 50.0, color: Colors.blue),
        title: Text('Via: ${climb.via}'),
        subtitle: Text('Face: ${climb.face} | ${climb.mountain.toString()} | Altitude: ${climb.altitude}'),
      ),
    );
  }
}
