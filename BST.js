let root = null;  // raiz da árvore
let lastState = null;  // último estado da árvore
let msg = '';  // mensagem
let printOutput = '';  // saída de impressão
let canvasWidth;  // largura do canvas
let delay = 1000;  // atraso em milissegundos

class Node {
  constructor(d, height, y, parent, loc) {
    if (d instanceof Node) { // se o parâmetro passado for um nó, então use todas as propriedades do nó para clonar o novo nó
      this.data = d.data;
      this.left = d.left;
      this.right = d.right;
      this.parent = d.parent;
      this.loc = d.loc;
      this.height = d.height;
      this.x = d.x;
      this.y = d.y;
      this.highlighted = d.highlighted;
    }
    else {
      this.data = d;
      this.left = null;
      this.right = null;
      this.parent = parent;
      this.loc = loc;
      this.height = height;
      this.x = canvasWidth / 2;
      this.y = y;
      this.highlighted = false;
    }
  }
}

// CLONAR A ÁRVORE ATUAL, INCLUINDO SEUS FILHOS E OS FILHOS DE SEUS FILHOS E ASSIM POR DIANTE.
function treeClone(node) {
  if (node == null) return null;
  const novo = new Node(node);
  novo.left = treeClone(node.left);
  novo.right = treeClone(node.right);
  return novo;
}

// ATRASAR A EXECUÇÃO DO CÓDIGO POR MILISSEGUNDOS ESPECIFICADOS
function sleep(ms) {
  const start = Date.now();
  while (Date.now() < start + ms);
}

// DESMARCAR TODOS OS NÓS
function unhighlightAll(node) {
  if (node !== null) {
    node.highlighted = false;
    unhighlightAll(node.left);
    unhighlightAll(node.right);
  }
}

// OBTER A ALTURA/NÍVEL ATUAL DE UM NÓ
function getHeight(node) {
  if (node == null) return 0;
  return node.height;
}

// PROCURAR UM ELEMENTO NA ÁRVORE
function search(curr, key) {
  if (!curr) { // se o nó atual for nulo, o elemento não existe na árvore
    msg = 'Procurando por ' + key + ' : (Elemento não encontrado)';
    self.postMessage([root, msg, '']);
    return 0;
  }
  unhighlightAll(root);
  curr.highlighted = true;
  self.postMessage([root, msg, '']);
  if (key < curr.data) { // se key < dado do nó atual, olhe na sub-árvore esquerda
    msg = 'Procurando por ' + key + ' : ' + key + ' < ' + curr.data + '. Olhando na sub-árvore esquerda.';
    self.postMessage([root, msg, '']);
    sleep(delay);
    search(curr.left, key);
  }
  else if (key > curr.data) { // se key > dado do nó atual, olhe na sub-árvore direita
    msg = 'Procurando por ' + key + ' : ' + key + ' > ' + curr.data + '. Olhando na sub-árvore direita.';
    self.postMessage([root, msg, '']);
    sleep(delay);
    search(curr.right, key);
  }
  else { // notifique a thread principal que um elemento foi encontrado e destaque esse elemento
    msg = 'Procurando por ' + key + ' : ' + key + ' == ' + curr.data + '. Elemento encontrado!';
    self.postMessage([root, msg, '']);
    sleep(delay);
  }
  return 0;
}

// EXCLUIR UM ELEMENTO DA ÁRVORE
function pop(startingNode, key) {
  let node = startingNode;
  if (!node) { // se o nó atual for nulo, o elemento a ser excluído não existe na árvore
    msg = 'Procurando por ' + key + ' : (Elemento não encontrado)';
    self.postMessage([root, msg, '']);
    return null;
  }
  else {
    unhighlightAll(root);
    node.highlighted = true;
    self.postMessage([root, msg, '']);
    if (key < node.data) { // se key < dado do nó atual, olhe na sub-árvore esquerda
      msg = 'Procurando por ' + key + ' : ' + key + ' < ' + node.data + '. Olhando na sub-árvore esquerda.';
      self.postMessage([root, msg, '']);
      sleep(delay);
      node.left = pop(node.left, key);
    }
    else if (key > node.data) { // se key > dado do nó atual, olhe na sub-árvore direita
      msg = 'Procurando por ' + key + ' : ' + key + ' > ' + node.data + '. Olhando na sub-árvore direita.';
      self.postMessage([root, msg, '']);
      sleep(delay);
      node.right = pop(node.right, key);
    }
    else {
      msg = key + ' == ' + node.data + '. Encontrado nó para excluir.'; // notifique a thread principal que o nó a ser excluído foi encontrado.
      self.postMessage([root, msg, '']);
      sleep(delay);
      if (!node.left && !node.right) { // se o nó não tem filhos (é uma folha), basta excluí-lo.
        msg = 'Nó a ser excluído é uma folha. Exclua-o.';
        node = null;
        self.postMessage([root, msg, '']);
      }
      else if (!node.left) { // se o nó tem filho à DIREITA, defina o pai do nó excluído como o filho à DIREITA do nó excluído
        msg = 'Nó a ser excluído não tem filho à esquerda.\nDefina o pai do nó excluído como o filho à direita do nó excluído';
        self.postMessage([root, msg, '']);
        sleep(delay);
        // CÓDIGO PARA ANIMAÇÃO DE PISCAR ETC.
        for (let i = 0; i < 2; i += 1) {
          node.right.highlighted = true;
          if (node === root) node.highlighted = true;
          else node.parent.highlighted = true;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
          node.right.highlighted = false;
          if (node === root) node.highlighted = false;
          else node.parent.highlighted = false;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
        }
        // FIM DO CÓDIGO PARA ANIMAÇÃO DE PISCAR ETC.
        let del = node;
        node.right.parent = node.parent;
        node.right.loc = node.loc;
        node = node.right;
        del = null;
        node.y -= 40;
      }
      else if (!node.right) { // se o nó tem filho à ESQUERDA, defina o pai do nó excluído como o filho à ESQUERDA do nó excluído
        msg = 'Nó a ser excluído não tem filho à direita.\nDefina o pai do nó excluído como o filho à esquerda do nó excluído';
        self.postMessage([root, msg, '']);
        sleep(delay);
        for (let i = 0; i < 2; i += 1) {
          node.left.highlighted = true;
          if (node === root) node.highlighted = true;
          else node.parent.highlighted = true;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
          node.left.highlighted = false;
          if (node === root) node.highlighted = false;
          else node.parent.highlighted = false;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
        }
        let del = node;
        node.left.parent = node.parent;
        node.left.loc = node.loc;
        node = node.left;
        del = null;
        node.y -= 40;
      }
      else { // se o nó tem DOIS filhos, encontre o maior nó na sub-árvore esquerda. Copie o valor dele para o nó a ser excluído. Em seguida, exclua recursivamente o maior nó na sub-árvore esquerda.
        msg = 'Nó a ser excluído tem dois filhos.\nEncontre o maior nó na sub-árvore esquerda.';
        self.postMessage([root, msg, '']);
        sleep(delay);
        let largestLeft = node.left;
        while (largestLeft.right) {
          unhighlightAll(root);
          largestLeft.highlighted = true;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
          largestLeft = largestLeft.right;
        }
        unhighlightAll(root);
        largestLeft.highlighted = true;
        msg = 'O maior nó na sub-árvore esquerda é ' + largestLeft.data + '.\nCopie o maior valor da sub-árvore esquerda para o nó a ser excluído.';
        self.postMessage([root, msg, '']);
        sleep(delay);
        // CÓDIGO PARA ANIMAÇÃO DE PISCAR ETC...
        for (let i = 0; i < 2; i += 1) {
          largestLeft.highlighted = true;
          node.highlighted = true;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
          largestLeft.highlighted = false;
          node.highlighted = false;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
        }
        // FIM DO CÓDIGO PARA ANIMAÇÃO DE PISCAR ETC...
        node.data = largestLeft.data;
        unhighlightAll(root);
        self.postMessage([root, msg, '']);
        sleep(delay);
        msg = 'Exclua recursivamente o maior nó na sub-árvore esquerda';
        self.postMessage([root, msg, '']);
        sleep(delay);
        node.left = pop(node.left, largestLeft.data);
      }
    }
  }
  if (node == null) return node;

  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1; // atualizar as alturas de todos os nós percorridos pela função pop()

  return node; // retorne as modificações para o chamador
}

// INSERIR UM ELEMENTO NA ÁRVORE
function push(node, data, posY, parent, loc) {
  let curr = node;

  if (curr != null) { // destaque o nó atual em cada etapa de recursão
    curr.highlighted = true;
    self.postMessage([root, msg, '']);
  }

  if (curr == null) { // se o nó atual for nulo, coloque o novo nó lá
    msg = 'Encontrou um nó nulo. Inserido ' + data + '.';
    curr = new Node(data, 1, posY, parent, loc);
  }
  else if (data < curr.data) { // se new data < dado do nó atual, vá para a sub-árvore esquerda
    msg = data + ' < ' + curr.data + '. Olhando na sub-árvore esquerda.';
    self.postMessage([root, msg, '']);
    sleep(delay);
    curr.highlighted = false;
    curr.left = push(curr.left, data, posY + 40, curr, 'left');
  }
  else if (data > curr.data) { // se new data > dado do nó atual, vá para a sub-árvore direita
    msg = data + ' > ' + curr.data + '. Olhando na sub-árvore direita.';
    self.postMessage([root, msg, '']);
    sleep(delay);
    curr.highlighted = false;
    curr.right = push(curr.right, data, posY + 40, curr, 'right');
  }
  else if (data == curr.data) { // se new data == dado do nó atual, retorne o nó atual
    msg = data + ' = ' + curr.data + '. retornando...';
    self.postMessage([root, msg, '']);
    sleep(delay);
    curr.highlighted = false;
    return curr;
  }

  curr.height = Math.max(getHeight(curr.left), getHeight(curr.right)) + 1; // atualizar as alturas de todos os nós percorridos pela função push()

  return curr; // retorne as modificações para o chamador
}

// APÓS INSERIR OU EXCLUIR, SEMPRE ATUALIZE A POSIÇÃO DE TODOS OS NÓS NO CANVAS
// FÓRMULA PARA DETERMINAR A POSIÇÃO DO NÓ É: (POSIÇÃO DO PAI DO NÓ - ((2 ^ (ALTURA ATUAL DO NÓ + 1)) * 10)))
function updatePosition(node) {
  if (node != null) {
    if (node.loc === 'left') node.x = node.parent.x - ((2 ** (getHeight(node.right) + 1)) * 10);
    else if (node.loc === 'right') node.x = node.parent.x + ((2 ** (getHeight(node.left) + 1)) * 10);
    else if (node.loc === 'root') {
      node.x = canvasWidth / 2;
      node.y = 50;
    }
    if (node.parent != null) node.y = node.parent.y + 40;
    if (node.left != null) node.left.parent = node; // atualizar informações de pai do nó atual
    if (node.right != null) node.right.parent = node; // atualizar informações de pai do nó atual
    updatePosition(node.left);
    updatePosition(node.right);
  }
}

// IMPRIMIR TODOS OS NÓS PRÉ-ORDENADAMENTE. 
function printPreOrder(node) {
  if (node !== null) {
    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Imprimindo o valor';
    printOutput = node.data;
    self.postMessage([root, msg, printOutput + ' ', '']);
    sleep(delay);
    msg = 'Indo para a sub-árvore esquerda';
    self.postMessage([root, msg, '', '']);
    sleep(delay);

    printPreOrder(node.left);

    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Indo para a sub-árvore direita';
    self.postMessage([root, msg, '', '']);
    sleep(delay);

    printPreOrder(node.right);

    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Voltando';
    self.postMessage([root, msg, '', '']);
    sleep(delay);
  }
  else {
    msg += '... NULO';
    self.postMessage([root, msg, '', '']);
    sleep(delay);
  }
}

// IMPRIMIR TODOS OS NÓS NA ORDEM. 
function printInOrder(node) {
  if (node !== null) {
    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Indo para a sub-árvore esquerda';
    self.postMessage([root, msg, '', '']);
    sleep(delay);

    printInOrder(node.left);

    msg = 'Imprimindo o valor';
    printOutput = node.data;
    unhighlightAll(root);
    node.highlighted = true;
    self.postMessage([root, msg, printOutput + ' ', '']);
    sleep(delay);
    msg = 'Indo para a sub-árvore direita';
    self.postMessage([root, msg, '', '']);
    sleep(delay);

    printInOrder(node.right);

    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Voltando';
    self.postMessage([root, msg, '', '']);
    sleep(delay);
  }
  else {
    msg += '... NULO';
    self.postMessage([root, msg, '', '']);
    sleep(delay);
  }
}

// IMPRIMIR TODOS OS NÓS PÓS-ORDENADAMENTE. 
function printPostOrder(node) {
  if (node !== null) {
    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Indo para a sub-árvore esquerda';
    self.postMessage([root, msg, '', '']);
    sleep(delay);

    printPostOrder(node.left);

    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Indo para a sub-árvore direita';
    self.postMessage([root, msg, '', '']);
    sleep(delay);

    printPostOrder(node.right);

    msg = 'Imprimindo o valor';
    printOutput = node.data;
    unhighlightAll(root);
    node.highlighted = true;
    self.postMessage([root, msg, printOutput + ' ', '']);
    sleep(delay);
    msg = 'Voltando';
    self.postMessage([root, msg, '', '']);
    sleep(delay);
  }
  else {
    msg += '... NULO';
    self.postMessage([root, msg, '', '']);
    sleep(delay);
  }
}

// OUVINTE DE EVENTOS PARA OUVIR COMANDOS DA THREAD PRINCIPAL. A ÁRVORE EXECUTARÁ TUDO O QUE A THREAD PRINCIPAL DESEJA.
// EM CADA ETAPA DO ALGORITMO, A ÁRVORE NOTIFICARÁ A THREAD PRINCIPAL SOBRE AS MUDANÇAS NA ÁRVORE PARA QUE A THREAD PRINCIPAL POSSA EXIBIR AS ALTERAÇÕES PASSO A PASSO PARA OS USUÁRIOS PARA FACILITAR O ENTENDIMENTO
self.addEventListener('message', (event) => {
  switch (event.data[0]) {
    case 'Inserir': {
      lastState = treeClone(root); // salve o último estado da árvore antes de inserir
      const value = event.data[1]; // obtenha o valor da entrada do usuário
      canvasWidth = event.data[2]; // obtenha canvasWidth da thread principal. Importante para a posição do nó
      root = push(root, value, 50, null, 'root'); // insira-o
      updatePosition(root); // atualize todas as posições dos nós
      self.postMessage([root, msg, 'Concluído']); // informe à thread principal que a operação foi concluída
      break;
    }
    case 'Excluir': {
      lastState = treeClone(root); // salve o último estado da árvore antes de excluir
      const key = event.data[1]; // obtenha o valor da entrada do usuário
      if (root == null) {
        self.postMessage([root, 'Árvore vazia', 'Concluído']); // envie uma mensagem para a thread principal de que a árvore está vazia
      }
      else {
        root = pop(root, key); // exclua-o
        updatePosition(root); // atualize a posição do nó
        unhighlightAll(root); // desmarque todos os nós
        self.postMessage([root, msg, 'Concluído']); // informe à thread principal que a operação foi concluída
      }
      break;
    }
    case 'Encontrar': {
      const key = event.data[1]; // obtenha o valor da entrada do usuário
      if (root == null) {
        self.postMessage([root, 'Árvore vazia', 'Concluído']); // envie uma mensagem para a thread principal de que a árvore está vazia
      }
      else {
        search(root, key);
        unhighlightAll(root); // desmarque todos os nós
        self.postMessage([root, msg, 'Concluído']); // informe à thread principal que a operação foi concluída
      }
      break;
    }
    case 'Imprimir Pré-Ordem': {
      if (root == null) {
        self.postMessage([root, 'Árvore vazia', '', 'Concluído']); // envie uma mensagem para a thread principal de que a árvore está vazia
      }
      else {
        printPreOrder(root);
        unhighlightAll(root); // desmarque todos os nós após a operação
        self.postMessage([root, 'Impressão Concluída', '', 'Concluído']); // informe à thread principal que a operação foi concluída
      }
      break;
    }
    case 'Imprimir In-Ordem': {
      if (root == null) {
        self.postMessage([root, 'Árvore vazia', '', 'Concluído']); // envie uma mensagem para a thread principal de que a árvore está vazia
      }
      else {
        printInOrder(root);
        unhighlightAll(root); // desmarque todos os nós após a operação
        self.postMessage([root, 'Impressão Concluída', '', 'Concluído']); // informe à thread principal que a operação foi concluída
      }
      break;
    }
    case 'Imprimir Pós-Ordem': {
      if (root == null) {
        self.postMessage([root, 'Árvore vazia', '', 'Concluído']); // envie uma mensagem para a thread principal de que a árvore está vazia
      }
      else {
        printPostOrder(root);
        unhighlightAll(root); // desmarque todos os nós após a operação
        self.postMessage([root, 'Impressão Concluída', '', 'Concluído']); // informe à thread principal que a operação foi concluída
      }
      break;
    }
    case 'Desfazer': {
      if (lastState != null) {
        root = treeClone(lastState); // redefina a árvore para o estado anterior
        updatePosition(root); // atualize todas as posições dos nós
        unhighlightAll(root); // desmarque todos os nós
        self.postMessage([root, 'Revertido', 'Concluído']); // informe à thread principal que a operação foi concluída
      }
      break;
    }
    case 'Definir Velocidade de Animação': {
      delay = event.data[1]; // get delay value from user input (slider)
      break;
    }
    default:
      break;
  }
});
