import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:frontend/models/viaModel.dart';
import 'package:frontend/views/via_pages/ViaView.dart';

class ViaCard extends StatelessWidget {
  final ViaModel viaModel;
  final String montanhaNome;
  final String image =
      'https://i.pinimg.com/736x/cb/64/a3/cb64a38f4bb6a06a9e4b27998fcfae00.jpg';

  const ViaCard({
    super.key,
    required this.viaModel,
    required this.montanhaNome,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Container(
        height: 140,
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) =>
                      ViaView(
                        viaId: viaModel.id,
                      )),
            );
          },
          child: Container(
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10), color: Colors.green),
            child: Row(children: [
              Expanded(
                flex: 2,
                child: Container(
                  child: Image.network((image), fit: BoxFit.contain),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(30.0),
                  ),
                ),
              ),
              SizedBox(
                width: 20,
              ),
              Expanded(
                flex: 3,
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Container(
                        child: Text(
                          viaModel.nome,
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Container(
                        child: Text(
                            '${viaModel.grau} - ${montanhaNome ?? "Não possui nome de montanha"}',
                            style: TextStyle(
                              fontSize: 18,
                            )),
                      ),
                    ]),
              ),
            ]),
          ),
        ),
      ),
    );
  }
}