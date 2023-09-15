# Estrutura do Banco de Dados - Cumes Brasil

## Tabelas

### Montanha

Tabela que contém informações sobre as montanhas do Brasil.

- **id**: Valor inteiro único para cada montanha.
- **nome**: Nome da montanha.
- **altitude**: Altitude da montanha em metros. Pode ser NULL se a altitude não estiver disponível.

### Face

Tabela que contém informações sobre as faces das montanhas, que são os locais específicos onde as vias de escalada estão localizadas.

- **id**: Valor inteiro único para cada face.
- **nome**: Nome ou descrição da face.
- **id_montanha**: Código identificador da montanha onde a face está localizada. Referência à tabela 'Montanha'.

### Fonte

Tabela que contém as fontes de informações sobre as vias, que podem ser livros, sites, entre outros.

- **id**: Valor inteiro único para cada fonte.
- **referencia**: Descrição ou referência bibliográfica da fonte.

### Via

Tabela que contém informações detalhadas sobre as vias de escalada.

- **id**: Valor inteiro único para cada via.
- **nome**: Nome da via de escalada.
- **grau**: Grau de dificuldade da via. Pode ser NULL se o grau não estiver disponível.
- **crux**: Grau do lance mais difícil da via.
- **artificial**: Grau do lance artificial, se houver.
- **duracao**: Estimativa da duração para completar a via.
- **exposicao**: Grau de exposição da via.
- **extensao**: Extensão total da via em metros. Pode ser NULL se a extensão não estiver disponível.
- **conquistadores**: Nomes dos conquistadores da via.
- **data**: Data de conquista da via.
- **id_montanha**: Código identificador da montanha onde a via está localizada. Referência à tabela 'Montanha'.
- **id_face**: Código identificador da face onde a via está localizada. Referência à tabela 'Face'.
- **id_fonte**: Código identificador da fonte da informação. Referência à tabela 'Fonte'.
- **id_variante**: Código identificador de uma possível variante da via. Referência à própria tabela 'Via'.
- **id_croqui**: Código identificador do croqui associado à via. Referência à tabela 'Croqui'.

### Croqui

Tabela que contém os croquis das vias, que são desenhos esquemáticos mostrando o trajeto da escalada.

- **id**: Valor inteiro único para cada croqui.
- **caminho_imagem**: Caminho ou URL da imagem do croqui.
- **autor**: Nome do autor ou responsável pelo croqui.
- **id_via**: Código identificador da via associada ao croqui. Referência à tabela 'Via'.
