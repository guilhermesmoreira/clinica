Documentação do Aplicativo React para Clínica Odontológica
Visão Geral
Este documento descreve a estrutura e funcionalidades de um aplicativo React que consome uma API pronta de uma clínica odontológica. O aplicativo permite o gerenciamento de agendamentos, procedimentos, condições de pacientes e acompanhamento financeiro. A interface é baseada em cartões que representam procedimentos, com funcionalidades de destaque, cores indicativas de status e fluxos de trabalho personalizáveis.

Funcionalidades Principais
1. Tela Home
A tela inicial exibe colunas e cartões que representam procedimentos agendados ou em andamento. Cada cartão contém informações relevantes sobre o paciente, procedimentos, status financeiro e condições especiais.

Período Vigente:

Exibe um período de aproximadamente um mês (duas semanas para trás e três para frente).

A data atual é destacada com uma cor diferente.

O período é editável, permitindo ajustes conforme a necessidade.

Balanço:

Exibe totais financeiros no canto superior direito:

TOTAL: Valor total do orçamento.

ENTRADAS: Valor já pago pelo paciente.

PROGRAMADO: Valor planejado para procedimentos agendados.

ENTREGUE: Valor correspondente aos procedimentos já realizados.

Botão "Adicionar Planejamento":

Abre um modal para criar novos agendamentos ou procedimentos.

2. Cartões de Procedimentos
Cada cartão representa um ou mais procedimentos e possui as seguintes características:

Status Visual:

Acinzentado: Quando uma data é selecionada, o cartão fica acinzentado e é movido para o final da lista, mas ainda visível.

Colorido: Na data selecionada, o cartão volta à cor original e pode piscar (highlight na borda) para indicar que as secretárias devem realizar o agendamento.

Cores de Saldo:

Verde: Saldo suficiente para liberar o procedimento.

Laranja: Procedimento agendado sem saldo suficiente (o valor do procedimento excede o saldo disponível).

Vermelho: Saldo insuficiente para realizar o agendamento.

Azul: Tratamento concluído. Se o valor do orçamento for alto, o sistema sugere agendar uma "Consulta de Alta".

3. Modal de Adicionar Planejamento
Ao clicar no botão "Adicionar Planejamento", um modal é exibido sobre a tela inicial, com fundo escurecido. O modal contém os seguintes campos:

Selecionar Paciente: Lista de pacientes cadastrados.

Selecionar Tratamentos: Um ou mais tratamentos podem ser selecionados para o paciente.

Atribuir Condição:

Condições pré-definidas (ex.: "Troca de Protocolo", "Paciente não sobe escadas").

Condições podem adicionar tempo adicional aos procedimentos (ex.: +15 minutos por sessão).

Condições também podem ser apenas alertas para o agendamento.

Criação de Cartões:

Cada cartão representa um ou mais procedimentos.

O tempo de execução é calculado automaticamente com base no tempo BASE do procedimento + tempo variável (dependendo da quantidade de dentes ou outros fatores).

O tempo relacionado à condição do paciente é adicionado ao cálculo.

4. Botão de Configuração
Um botão com um ponto de interrogação (?) abre as configurações do sistema:

Setup de Etapas:

Permite criar e configurar etapas para os procedimentos.

Cada etapa tem um nome e um tempo de execução.

Setup de Limiar de Valor para Consulta de Alta:

Define um valor de orçamento a partir do qual a "Consulta de Alta" é sugerida automaticamente.

O checkbox de "Consulta de Alta" pode ser marcado ou desmarcado manualmente.

Tabelas de Preço:

Exibe uma tabela de preços vinculada ao sistema.

Permite configurar múltiplas tabelas de preço.

Em cada tabela, é possível criar etapas com nomes e tempos de execução.

Fluxo de Trabalho
Criação de Cartões:

O usuário seleciona um paciente, procedimentos e condições.

O sistema calcula automaticamente o tempo de execução com base nos procedimentos e condições.

O cartão é criado e exibido na tela inicial.

Agendamento:

O usuário seleciona uma data para o procedimento.

O cartão fica acinzentado e é movido para o final da lista.

Na data selecionada, o cartão volta à cor original e pode piscar para indicar que o agendamento deve ser realizado.

Acompanhamento Financeiro:

O sistema verifica o saldo do paciente e atualiza as cores dos cartões conforme o status financeiro.

Se o tratamento for concluído e o valor do orçamento for alto, o sistema sugere agendar uma "Consulta de Alta".

Configurações:

O usuário pode configurar etapas, condições e tabelas de preço.

O tempo de execução é calculado automaticamente com base nas configurações.

Estrutura do Projeto em React
1. Componentes Principais
HomeScreen: Tela inicial com colunas, cartões e balanço financeiro.

CardComponent: Componente que representa um cartão de procedimento.

AddPlanningModal: Modal para adicionar novos planejamentos.

SettingsScreen: Tela de configurações para etapas, condições e tabelas de preço.

2. Gerenciamento de Estado
Redux ou Context API: Para gerenciar o estado global, como pacientes, procedimentos, agendamentos e configurações.

3. Integração com API
Axios ou Fetch: Para consumir a API da clínica odontológica e buscar/atualizar dados.

4. Bibliotecas de UI
Material-UI ou Ant Design: Para criar uma interface moderna e responsiva.

React-Modal: Para exibir o modal de adicionar planejamento.

5. Lógica de Negócio
Cálculo de Tempo: Funções para calcular o tempo de execução com base nos procedimentos e condições.

Verificação de Saldo: Funções para verificar o saldo do paciente e atualizar as cores dos cartões.
