// URL base da API - ajuste se necessário
const API_URL = 'http://localhost:3000';

// Elementos DOM
const statusEl = document.getElementById('status');
const statusInsertEl = document.getElementById('status-insert');
const statusDeleteEl = document.getElementById('status-delete');
const productsContainer = document.getElementById('products-container');
const baseUrlEl = document.getElementById('base-url');
const productDetailEl = document.getElementById('product-detail');
const newProductNameEl = document.getElementById('produto-nome');
const newProductPriceEl = document.getElementById('produto-preco');

// Atualiza URL base no display
baseUrlEl.textContent = API_URL;

// Formata preços do insert para o padrão brasileiro
newProductPriceEl.addEventListener('input', () => {
  let valorLimpo = newProductPriceEl.value.replace(/\D/g, ''); // Remove caracteres não numéricos
  let valorNumerico = parseFloat(valorLimpo) / 100 || 0; // Converte para float
  newProductPriceEl.value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorNumerico); // Formata para o padrão brasileiro
})


/**
 * Atualiza o status da página, alterando o texto e classe do componente de status, com uma mensagem e um tipo.
 * @param {string} mensagem - A mensagem a ser exibida no status.
 * @param {string} tipo - O tipo de status a ser exibido (loading, success, error).
*/
function updateStatus(mensagem, tipo) {
  statusEl.textContent = mensagem;
  statusEl.className = tipo;
}

function updateInsertStatus(mensagem, tipo) {
  statusInsertEl.textContent = mensagem;
  statusInsertEl.className = tipo;
}

function updateDeleteStatus(mensagem, tipo) {
  statusDeleteEl.textContent = mensagem;
  statusDeleteEl.className = tipo;
}


/**
 * Testa a conexão com a API, atualizando o status da página com uma mensagem de sucesso ou erro.
 * 
 * @throws {Error} Se a resposta da API não for OK.
 */
async function testConnection() {
  updateStatus('Testando conexão...', 'loading');

  try {
    const response = await fetch(`${API_URL}/`);
    if (response.ok) {
      const data = await response.json();
       updateStatus(`✅ Conectado! Mensagem: ${data.message}`, 'success');
    } else {
      throw new Error('Resposta não OK');
    }
  } catch (error) {
    updateStatus(
      mensagem = `❌ Erro ao conectar: ${error.message}. Verifique se o backend está rodando.`, 
      tipo = 'error'
    );
  }
}


/**
 * Carrega produtos da API e exibe na página.
 * 
 * @throws {Error} Se a resposta da API não for OK.
 */
async function loadProducts() {
  updateStatus('Carregando produtos...', 'loading');

  try {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Limpa container
    productsContainer.innerHTML = '';
    
    // Adiciona cada produto
    const products = await response.json();
    products.forEach(product => {
      const productEl = document.createElement('div');
      productEl.className = 'produto-item';
      productEl.innerHTML = `
                        <div class="produto-id">ID: ${product.id}</div>
                        <div class="produto-nome">${product.name}</div>
                        <div class="produto-preco">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</div>
                    `;
      productsContainer.appendChild(productEl);
    });

    updateStatus(`✅ ${products.length} produtos carregados com sucesso!`, 'success');
  } catch (error) {
    updateStatus(`❌ Erro ao carregar produtos: ${error.message}`, 'error');
    productsContainer.innerHTML = `<div style="color: #721c24; padding: 15px; background: #f8d7da; border-radius: 8px;">Erro: ${error.message}</div>`;
  }
}


/**
 * Busca um produto por seu ID e exibe na página.
 * 
 * @throws {Error} Se a resposta da API não for OK.
 */
async function searchProductById() {
  const id = document.getElementById('produto-id').value;

  if (!id) {
    productDetailEl.innerHTML = '<div style="color: #856404; padding: 10px; background: #fff3cd; border-radius: 8px;">Digite um ID válido</div>';
    return;
  }

  productDetailEl.innerHTML = '<div style="color: #0c5460; padding: 10px; background: #d1ecf1; border-radius: 8px;">Buscando...</div>';

  try {
    const response = await fetch(`${API_URL}/products/${id}`);

    if (response.status === 404) {
      productDetailEl.innerHTML = `<div style="color: #721c24; padding: 10px; background: #f8d7da; border-radius: 8px;">Produto com ID ${id} não encontrado</div>`;
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const product = await response.json();

    productDetailEl.innerHTML = `
                    <div class="produto-item">
                        <div class="produto-id">ID: ${product.id}</div>
                        <div class="produto-nome">${product.name}</div>
                        <div class="produto-preco">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</div>
                    </div>
                `;
  } catch (error) {
    productDetailEl.innerHTML = `<div style="color: #721c24; padding: 10px; background: #f8d7da; border-radius: 8px;">Erro: ${error.message}</div>`;
  }
}



/**
 * Limpa a lista de produtos e o detalhe do produto.
 * Atualiza status para "Lista limpa. Clique em "Carregar Produtos" para exibir novamente."
 */
function cleanProducts() {
  productsContainer.innerHTML = '';
  productDetailEl.innerHTML = '';
  updateStatus('Lista limpa. Clique em "Carregar Produtos" para exibir novamente.', 'loading');
}


/**
 * Cria um novo produto com base nos valores informados nos campos "nome do produto" e "preço do produto".
 * Atualiza o status da página com uma mensagem de sucesso ou erro.
 * 
 * @throws {Error} Se a resposta da API não for OK.
 */
async function createProduct() {
  updateInsertStatus('Criando produto...', 'loading');
  
  const name = document.getElementById('produto-nome').value;
  const price = parseFloat(document.getElementById('produto-preco').value.replace(/\D/g, '')) / 100 || 0; // Remove caracteres não numéricos, converte para float e divide por 100 para obter o valor em reais
  
  if (!name || !price) {
    updateInsertStatus('❌ Por favor, insira um nome e preço.', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/products/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price })
    });
    
    if (response.status === 200) {
      updateInsertStatus('Produto criado com sucesso!', 'success');
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    updateInsertStatus(`❌ Erro ao criar produto: ${error.message}`, 'error');
  }
}


/**
 * Deleta um produto com base no ID informado no campo "produto-id-delete".
 * Atualiza o status da página com uma mensagem de sucesso ou erro.
 * 
 * @throws {Error} Se a resposta da API não for OK.
 */
async function deleteProductById(req, res) {
  try {
    const id = document.getElementById('produto-id-delete').value;
    const response = await fetch(`${API_URL}/products/delete/${id}`, {
      method: 'DELETE'
    });
    console.log(response.status)
    if (response.status === 200) {
      updateDeleteStatus('Produto deletado com sucesso!', 'success');
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    updateDeleteStatus(`❌ Erro ao deletar produto: ${error.message}`, 'error');
  }
}


// Testa conexão automaticamente ao carregar a página
window.addEventListener('load', testConnection);
