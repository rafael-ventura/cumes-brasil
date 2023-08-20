# Estrutura do Banco de Dados MySQL

## Tabelas
### vias_main
Tabela que contém as informações principais a serem exibidas aos participantes sobre as vias de escalada. Contém 13 colunas:

- **id:** um valor inteiro único para cada entrada;
- **vias:** nome da via de escalada;
- **grau:** grau geral da via segundo a escala brasileira de graduação;
- **crux:** grau do lance mais difícil da via. Essa coluna deve ser usada para converter o grau para outras escalas;
- **aid:** grau do lance artificial, se houver. Número de passadas para transpor o lance pode ser opcionalmente indicado entre parênteses;
- **duracao:** duranção da via;
- **exposicao:** grau de exposição da via;
- **extensao:** quantos metros tem a via. Essa coluna deve ser usada para converter do sistema mético para o sistema imperial;
- **conquistadores:** nomes dos conquistadores da via;
- **data:** data de conquista da via.
- **mount_id:** o código identificador da montanha onde está localizada a via. Referência à tabela 'montanhas';
- **faces_id:** o código identificador da face onde está localizada a via. Referência à tabela 'faces';
- **source_id:** o código identificador da fonte primária onde a informação sobre a via foi localizada. Referência à tabela 'fontes';

### montanhas
Tabela que contém a lista de montanhas onde as vias estão localizadas e sua altitude, em mestros.

- **mount_id:** um valor inteiro único para cada entrada;
- **montanhas:** o nome da montanha onde está localizada a via;
- **altitude:** a altitude, em metros, da referida montanha. Essa coluna deve ser usada para a conversão para o sistema imperial.

### faces
Tabela com as faces das montanhas onde as vias estão localizadas, bem como informações complementares.

- **face_id:** um valor inteiro único para cada entrada;
- **faces:** o nome da face onde está localizada a via bem como informações complementares entre parênteses, como rua de acesso;
- **mount_id:** o código identificador da montanha onde a face está localizada. Referência à tabela 'montanhas'.

### fontes
Tabela com as fontes de informação - livros, catálogos, sites, etc. - de onde foram retiradas as informações sobre as vias.

- **source_id:** um valor inteiro único para cada entrada;
- **fontes:** a referência bibliográfica de onde foi tirada a informação sobre a via.
