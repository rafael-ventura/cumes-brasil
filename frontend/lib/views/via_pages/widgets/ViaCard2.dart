import 'package:flutter/material.dart';
import 'package:frontend/models/viaModel.dart';
import 'package:frontend/views/via_pages/ViaView.dart';

class ViaCard2 extends StatelessWidget {
  final String imgUrl =
      'https://images.squarespace-cdn.com/content/v1/598b7343f7e0abaa677c5fd8/1576953784201-VT0GE0GJTZR6OYRNAN33/escalada-rio-de-janeiro-morro-da-urca-face-norte-2.jpg?format=2500w';
  final double width = 400;
  final ViaModel viaModel;
  final String montanhaNome;

  const ViaCard2({
    super.key,
    required this.viaModel,
    required this.montanhaNome,
  });

  String convertToRoman(int number) {
    final List<String> romanNumerals = [
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
      'X'
    ];

    if (number < 1 || number > 10) {
      throw Exception(
          'Número fora do intervalo de conversão para algarismos romanos.');
    }

    return romanNumerals[number - 1];
  }

  String getFormattedGrau(String? grau) {
    if (grau != null && grau.isNotEmpty) {
      try {
        double grauDecimal = double.parse(grau);
        int grauNumerico = grauDecimal.toInt();
        return convertToRoman(grauNumerico);
      } catch (e) {
        // Caso o parsing falhe, retorne o grau original
        return grau;
      }
    }
    return '';
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => ViaView(
                        viaId: viaModel.id,
                      )),
            );
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: width,
                child: Image.network(
                  imgUrl,
                  fit: BoxFit.fitWidth,
                ),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.all(Radius.circular(22)),
                  // color: Colors.red
                ),
                clipBehavior: Clip.antiAlias,
              ),
              SizedBox(
                height: 10,
              ),
              Text(
                montanhaNome,
                style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
                maxLines:
                    2, // Defina o número máximo de linhas que o texto deve ocupar
                overflow: TextOverflow
                    .ellipsis, // Adicione essa linha para mostrar os três pontos
              ),
              SizedBox(
                height: 10,
              ),
              Container(
                  width: width,
                  child: LikeListTile(
                    title: '${viaModel.nome} - ${viaModel.exposicao}',
                    likes: "0",
                    subtitle:
                        'Grau: ${getFormattedGrau(viaModel.grau)} - Crux: ${viaModel.crux}',
                    color: Colors.amber,
                  )),
            ],
          ),
        ),
      ],
    );
  }
}

class LikeListTile extends StatelessWidget {
  const LikeListTile(
      {Key? key,
      required this.title,
      required this.likes,
      required this.subtitle,
      this.color = Colors.grey})
      : super(key: key);
  final String title;
  final String likes;
  final String subtitle;
  final Color color;
  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.all(0),
      leading: Container(
        width: 50,
        child: AspectRatio(
          aspectRatio: 1,
          child: Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
            ),
          ),
        ),
      ),
      title: Text(title),
      subtitle: Row(
        children: [
          Icon(Icons.favorite, color: Colors.orange, size: 15),
          SizedBox(width: 2),
          Text(likes),
          Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.grey,
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: SizedBox(width: 4, height: 4),
              )),
          Text(subtitle)
        ],
      ),
      trailing: LikeButton(onPressed: () {}, color: Colors.orange),
    );
  }
}

class LikeButton extends StatefulWidget {
  const LikeButton(
      {Key? key, required this.onPressed, this.color = Colors.black12})
      : super(key: key);
  final Function onPressed;
  final Color color;
  @override
  _LikeButtonState createState() => _LikeButtonState();
}

class _LikeButtonState extends State<LikeButton> {
  bool isLiked = false;

  @override
  Widget build(BuildContext context) {
    return Container(
        child: IconButton(
      icon: Icon(isLiked ? Icons.favorite : Icons.favorite_border,
          color: widget.color),
      onPressed: () {
        setState(() {
          isLiked = !isLiked;
        });
        widget.onPressed();
      },
    ));
  }
}
