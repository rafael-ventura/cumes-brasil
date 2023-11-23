# PCS - SGBD: Testes de Carga

## Autores
- Elmo Júnior
- Hernan Matiello
- Rafael Cantanhede
- Vitor Índio

## Visão Geral
Este documento aborda os testes de carga realizados para o sistema de gerenciamento de banco de dados (SGBD) como parte do projeto da Universidade Federal do Estado do Rio de Janeiro.

## Testes de Carga - Visualização de Vias
- **Tipo de Operações:** Leitura
- **Arquivos Envolvidos:**
  - ViaController
  - ViaService
  - Via
  - ViaRepository
  - IVia, IViaService, IViaRepository
  - ViaAdapter
  - ViaDocument
- **Código Fonte para Medição do SLA:**
  - Script
- **Datas da Medição:** 17/11, 18/11, 22/11, 23/11/2023

  

## Configurações dos Testes
- **Máquina Padrão:** K6
- **Testes de Carga (SLA):**
  - Requisições com durações limite de 500ms
  - Duração Total do Teste: 4 minutos
  - Variação de usuários: 0 para 10 para 20 e para 0


## Potenciais Gargalos do Sistema
- Limitação de RAM no próprio banco de dados
- Dificuldades de acesso remoto ao Endpoint com o K6 (somente acesso local)

![image](https://github.com/rafael-ventura/cume-brasil/assets/28628701/204880cc-7866-4f74-a728-f9b0467317a4)

![image](https://github.com/rafael-ventura/cume-brasil/assets/28628701/a9161813-97fc-4c1e-a7e1-81f6fe44bbe6)



## Atualização de Via
- **Tipo de Operações:** Update
- **Arquivos Envolvidos:** [Mesmos listados acima]
- **Data da Medição para Update:** 23/11/2023
- **Configurações e Testes de Carga:** [Mesmas listadas acima]
- **Gargalos do Sistema:** Endpoint não acessível remotamente com o K6

![image](https://github.com/rafael-ventura/cume-brasil/assets/28628701/bb9af839-4dbb-4cfa-add4-76079e5a0ab1)

## Conclusão
Para a proxima entrega queremos trazer endpoints que possam trazer melhorias expressivas, ou ao menos, serem acessiveis.

