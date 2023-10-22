let tree = null;
let controlDiv;
let controlBar;
let insertForm;
let insertButton;
let deleteForm;
let deleteButton;
let searchForm;
let searchButton;
let printInOrderButton;
let printPreOrderButton;
let printPostOrderButton;
let undoButton;
let animationSpeedSliderLabel;
let animationSpeedSlider;
let lastMsg = '';
let printOutput = '';
let value;
let BST;
let payload;

function habilitarUI() {
  insertForm.removeAttribute('disabled');
  insertButton.removeAttribute('disabled');
  deleteForm.removeAttribute('disabled');
  deleteButton.removeAttribute('disabled');
  searchForm.removeAttribute('disabled');
  searchButton.removeAttribute('disabled');
  printPreOrderButton.removeAttribute('disabled');
  printInOrderButton.removeAttribute('disabled');
  printPostOrderButton.removeAttribute('disabled');
  undoButton.removeAttribute('disabled');
  animationSpeedSlider.removeAttribute('disabled');
}

function desabilitarUI() {
  insertForm.attribute('disabled', '');
  insertButton.attribute('disabled', '');
  deleteForm.attribute('disabled', '');
  deleteButton.attribute('disabled', '');
  searchForm.attribute('disabled', '');
  searchButton.attribute('disabled', '');
  printPreOrderButton.attribute('disabled', '');
  printInOrderButton.attribute('disabled', '');
  printPostOrderButton.attribute('disabled', '');
  undoButton.attribute('disabled', '');
  animationSpeedSlider.attribute('disabled', '');
}

function definirVelocidadeAnimacao() {
  const animDelay = Math.abs(animationSpeedSlider.value());
  payload = ['Definir Velocidade de Animação', animDelay];
  BST.postMessage(payload);
}

function desfazer() {
  payload = ['Desfazer'];
  BST.postMessage(payload);
  BST.onmessage = function (event) {
    tree = event.data[0];
    lastMsg = event.data[1];
  };
  undoButton.attribute('disabled', ''); // desabilitar o botão de desfazer após o uso.
}

function exibirNo(atual) {
  if (atual != null) {
    ellipseMode(CENTER);
    textAlign(CENTER);
    stroke('black');
    strokeWeight(3);
    if (atual.left != null) line(atual.x, atual.y, atual.left.x, atual.left.y);
    if (atual.right != null) line(atual.x, atual.y, atual.right.x, atual.right.y);
    noStroke();
    fill(69, 92, 109);
    if (atual.highlighted) ellipse(atual.x, atual.y, 45, 45);
    fill(52, 177, 219);
    ellipse(atual.x, atual.y, 35, 35);
    fill('black');
    text(atual.data, atual.x, atual.y + 5);
    exibirNo(atual.left);
    exibirNo(atual.right);
  }
}

function imprimirPreOrdem() {
  desabilitarUI();
  lastMsg = '';
  printOutput = '';
  payload = ['Imprimir Pré-Ordem'];
  BST.postMessage(payload); // enviar a mensagem 'Imprimir Pré-Ordem' para a BST para imprimir todos os elementos em pré-ordem
  BST.onmessage = function (event) {
    tree = event.data[0];
    lastMsg = event.data[1];
    printOutput += event.data[2];
    if (event.data[3] === 'Concluído') habilitarUI();
  };
  return 0;
}

function imprimirInOrdem() {
  desabilitarUI();
  lastMsg = '';
  printOutput = '';
  payload = ['Imprimir In-Ordem'];
  BST.postMessage(payload); // enviar a mensagem 'Imprimir In-Ordem' para a BST para imprimir todos os elementos em ordem
  BST.onmessage = function (event) {
    tree = event.data[0];
    lastMsg = event.data[1];
    printOutput += event.data[2];
    if (event.data[3] === 'Concluído') habilitarUI();
  };
  return 0;
}

function imprimirPosOrdem() {
  desabilitarUI();
  lastMsg = '';
  printOutput = '';
  payload = ['Imprimir Pós-Ordem'];
  BST.postMessage(payload); // enviar a mensagem 'Imprimir Pós-Ordem' para a BST para imprimir todos os elementos em pós-ordem
  BST.onmessage = function (event) {
    tree = event.data[0];
    lastMsg = event.data[1];
    printOutput += event.data[2];
    if (event.data[3] === 'Concluído') habilitarUI();
  };
  return 0;
}

function inserir() {
  lastMsg = '';
  printOutput = '';
  value = parseInt(insertForm.value(), 10);
  insertForm.value('');
  if (isNaN(value) === true) return undefined;
  desabilitarUI();
  payload = ['Inserir', value, width];
  BST.postMessage(payload); // enviar a mensagem 'Inserir', valor inserido e largura do canvas para pedir à árvore que insira um novo elemento
  BST.onmessage = function (event) {
    tree = event.data[0]; // receber as modificações na árvore da BST para que a thread principal do navegador possa exibir as mudanças em cada etapa do algoritmo, em vez da mudança final
    lastMsg = event.data[1]; // também receber mensagem da BST após cada etapa do algoritmo
    if (event.data[2] === 'Concluído') habilitarUI();
  };
  return 0;
}

function excluir() {
  lastMsg = '';
  printOutput = '';
  value = parseInt(deleteForm.value(), 10);
  deleteForm.value('');
  if (isNaN(value) === true) return undefined;
  desabilitarUI();
  payload = ['Excluir', value];
  BST.postMessage(payload); // enviar mensagem 'Excluir' e valor inserido para pedir à árvore que exclua um elemento
  BST.onmessage = function (event) {
    tree = event.data[0]; // receber as modificações na árvore da BST para que a thread principal do navegador possa exibir as mudanças em cada etapa do algoritmo, em vez da mudança final
    lastMsg = event.data[1]; // também receber mensagem da BST após cada etapa do algoritmo
    if (event.data[2] === 'Concluído') habilitarUI();
  };
  return 0;
}

function encontrar() {
  lastMsg = '';
  printOutput = '';
  value = parseInt(searchForm.value(), 10);
  searchForm.value('');
  if (isNaN(value) === true) return undefined;
  desabilitarUI();
  payload = ['Encontrar', value];
  BST.postMessage(payload); // enviar mensagem 'Encontrar' e valor inserido para pedir à árvore que encontre um elemento
  BST.onmessage = function (event) {
    tree = event.data[0]; // receber as modificações na árvore da BST para que a thread principal do navegador possa exibir as mudanças em cada etapa do algoritmo, em vez da mudança final
    lastMsg = event.data[1]; // também receber mensagem da BST após cada etapa do algoritmo
    if (event.data[2] === 'Concluído') habilitarUI();
  };
  return 0;
}

function adicionarControles(tipo, nome, onClick) {
  let elemento;
  switch (tipo) {
    case 'Input':
      elemento = createInput();
      elemento.size(60);
      break;
    case 'Button':
      elemento = createButton(nome);
      elemento.mousePressed(onClick);
      break;
    case 'Slider':
      elemento = createSlider(-2000, -500, -1000, 20);
      elemento.mouseReleased(onClick);
      elemento.touchEnded(onClick);
      elemento.style('width', '100px');
      break;
    case 'Label':
      elemento = createP(nome);
      elemento.class('control-label');
      break;
    default: break;
  }
  const entradaTabela = createElement('td');
  entradaTabela.child(elemento);
  controlBar.child(entradaTabela);
  return elemento;
}

function setup() {
  // INICIALIZAR A THREAD DO WEBWORKER PARA O ALGORITMO DA ÁRVORE E VISUALIZAÇÃO
  BST = new Worker('BST.js');

  // INICIAR CONTROLE DE VISUALIZAÇÃO
  controlDiv = createDiv();
  controlDiv.parent('mainContent');
  controlDiv.id('controlSection');
  controlBar = createElement('table');
  controlDiv.child(controlBar);
  insertForm = adicionarControles('Input', '', '');
  insertButton = adicionarControles('Button', 'Inserir', inserir);
  deleteForm = adicionarControles('Input', '', '');
  deleteButton = adicionarControles('Button', 'Remover', excluir);
  searchForm = adicionarControles('Input', '', '');
  searchButton = adicionarControles('Button', 'Consultar', encontrar);
  printPreOrderButton = adicionarControles('Button', 'Imprimir Pré-Ordem', imprimirPreOrdem);
  printInOrderButton = adicionarControles('Button', 'Imprimir In-Ordem', imprimirInOrdem);
  printPostOrderButton = adicionarControles('Button', 'Imprimir Pós-Ordem', imprimirPosOrdem);
  undoButton = adicionarControles('Button', 'Desfazer', desfazer);
  animationSpeedSliderLabel = adicionarControles('Label', 'Velocidade da Animação:', '');
  animationSpeedSlider = adicionarControles('Slider', '', definirVelocidadeAnimacao);
  // FINALIZAR CONTROLE DE VISUALIZAÇÃO

  // DEFINIR TAMANHO DO CANVAS E DO TEXTO
  const canvas = createCanvas(1024, 500);
  canvas.parent('mainContent');
  canvas.id('canvas');
  canvas.style('background-color', '#d8eaff');
  textSize(15);
}

function draw() {
  background('#d8eaff');
  exibirNo(tree);
  fill('black');
  textAlign(LEFT);
  text(lastMsg, 30, 50);
  text(printOutput, 30, 90);
}
