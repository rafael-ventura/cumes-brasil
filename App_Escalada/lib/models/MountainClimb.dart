import 'package:flutter/material.dart';

class MountainClimb {
  final dynamic mountain;
  final dynamic altitude;
  final dynamic face;
  final dynamic via;
  final dynamic generalGrade;
  final dynamic cruxGrade;
  final dynamic artificialGrade;
  final dynamic durationGrade;
  final dynamic exposureGrade;
  final dynamic extension;
  final dynamic conquerors;
  final dynamic conquestDate;

  MountainClimb({
    required this.mountain,
    this.altitude,
    required this.face,
    required this.via,
    this.generalGrade,
    this.cruxGrade,
    this.artificialGrade,
    this.durationGrade,
    this.exposureGrade,
    this.extension,
    this.conquerors,
    this.conquestDate,
  });
}
