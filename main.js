let listaDeItens = []
let itemAEditar
const form = document.getElementById('form-itens')
const itensInput = document.getElementById("receber-item")
const ulItens = document.getElementById("lista-de-itens")
const ulItensComprados = document.getElementById("itens-comprados");
const listaRecuperada = localStorage.getItem('listaDeItens')

function atualizaLocalStorage() {
  // colocando a listaDeItens no localStorage da pagina 
  localStorage.setItem("listaDeItens", JSON.stringify(listaDeItens))
}

// se tiver algo na listaRecuperada, ela retorna true
if (listaRecuperada) {
  // .parse transforma arquivo json para javascript
  listaDeItens = JSON.parse(listaRecuperada)

  mostraItem()
} else {
  listaDeItens = []
}

form.addEventListener('submit', function (evento) {
  // para a pagina não dar reload após enviar
  evento.preventDefault()

  salvaItem()
  mostraItem()

  // manter o foco no input
  itensInput.focus()
})

function salvaItem() {
  const comprasItem = itensInput.value

  // checando para ver se tem duplicado, para não colocar valor duplicado, o some percorre a lista inteira para ver se tem a comparação passada no seu parâmetro, colocando em letra maiúscula para não ter o case sensitive
  const checarDuplicado = listaDeItens.some((elemento) => elemento.valor.toUpperCase() === comprasItem.toUpperCase())

  // caso retorne true
  if (checarDuplicado) {
    alert("Item já colocado na lista")
  } else {
    // usa o push para adicionar um objeto a cada valor, para não ficar tirando o valor velho para colocar o novo, com o psu armazena o novo e o velho
    listaDeItens.push({
      valor: comprasItem,
      checar: false
    })
  }
  
  // resetando o campo do input
  itensInput.value = ''

}

function mostraItem() {
  ulItens.innerHTML = ''
  ulItensComprados.innerHTML = ''

  // segundo parametro do forEach sempre é o index e o primeiro sempre será o elemento
  listaDeItens.forEach((elemento, index) => {
    if (elemento.checar) {
      ulItensComprados.innerHTML += `
      <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
        <div>
            <input type="checkbox" checked class="is-clickable" />  
            <span class="itens-comprados is-size-5">${elemento.valor}</span>
        </div>
        <div>
            <i class="fa-solid fa-trash is-clickable deletar"></i>
        </div>
    </li>
      `
    } else {
      ulItens.innerHTML += `<li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
          <div>
            <input type="checkbox" class="is-clickable" />
            <input type="text" class="is-size-5" value="${elemento.valor}" ${index !== Number(itemAEditar) ? 'disabled' : ''}></input>
          </div>

          <div>
            ${index === Number(itemAEditar) ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
            <i class="fa-solid fa-trash is-clickable deletar"></i>
          </div>
      </li>`
    }
  })

  // pegando todos os inputs que forem do tipo checkbox
  const inputsCheck = document.querySelectorAll('input[type="checkbox"]')

  inputsCheck.forEach( elemento => {
    elemento.addEventListener('click', (evento) => {
      // parentElement mostra o pai do elemento pego pelo target
      // getAttribute pega o valor pelo atributo[data-attributes]
      const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');

      // pegando a lista de itens e acessando o elemento pelo index dele, pego pelo valor do elemento e colocando checked no elemento para passar como true
      listaDeItens[valorDoElemento].checar = evento.target.checked
      mostraItem()
    })
  }) 

  const deletarObject = document.querySelectorAll(".deletar")

  deletarObject.forEach( elemento => {
    elemento.addEventListener('click', (evento) => {
      // parentElement mostra o pai do elemento pego pelo target
      // getAttribute pega o valor pelo atributo[data-attributes]
      const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');

      // splice deleta, primeiro parâmetro é o index, segundo é a quantidade
      listaDeItens.splice(valorDoElemento, 1)

      mostraItem()
    })
  }) 

  const editarItens = document.querySelectorAll(".editar")

  editarItens.forEach( elemento => {
    elemento.addEventListener('click', (evento) => {
      // parentElement mostra o pai do elemento pego pelo target
      // getAttribute pega o valor pelo atributo[data-attributes]
      itemAEditar = evento.target.parentElement.parentElement.getAttribute('data-value');

      mostraItem()
    })
  })

  atualizaLocalStorage()

}

function salvarEdicao() {
  // pegando um input que tenho o msm index da variável
  const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`)

  // trocando na lista pelo novo valor
  listaDeItens[itemAEditar].valor = itemEditado.value

  itemAEditar = '-1'

  mostraItem()
}