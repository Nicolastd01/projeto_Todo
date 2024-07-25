//elementos
const addContainer = document.querySelector("#add-container");
const editContainer = document.querySelector("#edit-container");

const todoForm = document.querySelector("#todo-form");
const editForm = document.querySelector("#edit-form");

const todoInput = document.querySelector("#todo-input");
const horaInput = document.querySelector("#hora-input");
const dataInput = document.querySelector("#data-input");
const todoList = document.querySelector("#todo-list");

let antigaTarefa;
let antigaTarefaHora;
let antigaTarefaData;

const editInput = document.querySelector("#edit-input");
const editInputHr = document.querySelector("#edit-input-hora");
const editInputData = document.querySelector("#edit-input-data");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const procuraInput = document.querySelector("#pesquisar-input");
const apagaProcuraBtn = document.querySelector("#apagar-btn");
const filtraBtn = document.querySelector("filter-select");

//Funcoes 
const salvaNaLista = (tarefa, hora, data, feito = 0, salvar = 1) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const tituloTarefa = document.createElement("h3");
    tituloTarefa.innerText = tarefa;

    const horaTarefaEle = document.createElement("h4");
    horaTarefaEle.innerText = hora;
    horaTarefaEle.classList.add("hide");

    const dataTarefaEle = document.createElement("h5");
    dataTarefaEle.innerText = data;
    dataTarefaEle.classList.add("hide");

    if (horaTarefaEle.innerText != "") {
        horaTarefaEle.classList.remove("hide");
    }

    if (dataTarefaEle.innerText != "") {
        dataTarefaEle.classList.remove("hide");
    }

    const atribTarefas = document.createElement("div");
    atribTarefas.appendChild(tituloTarefa);
    atribTarefas.appendChild(horaTarefaEle);
    atribTarefas.appendChild(dataTarefaEle);

    const btnsTarefa = document.createElement("div");
    btnsTarefa.style.display = "flex"

    const finalizBtn = document.createElement("button");
    finalizBtn.classList.add("finish-todo");
    finalizBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    btnsTarefa.appendChild(finalizBtn);
    // todo.appendChild(finalizBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    btnsTarefa.appendChild(editBtn);
    // todo.appendChild(editBtn);

    const apagaBtn = document.createElement("button");
    apagaBtn.classList.add("remove-todo");
    apagaBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    btnsTarefa.appendChild(apagaBtn);
    // todo.appendChild(apagaBtn);

    //localStorege 

    if(feito){
        todo.classList.add("done");
    }

    if(salvar){
        savarListasLoacalStorege({tarefa, hora, data, feito});
    }

    todo.appendChild(atribTarefas);
    todo.appendChild(btnsTarefa);
    todoList.appendChild(todo);

    todoInput.value = "";
    horaInput.value = "";
    dataInput.value = "";

    todoInput.focus();

};

const trocaForms = () => {
    editContainer.classList.toggle("hide");
    addContainer.classList.toggle("hide");
    todoList.classList.toggle("hide");

};

const atualizaTodo = (titulo, hora, data) => {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {
        let tarefaTitulo = todo.querySelector("h3");
        let tarefaHora = todo.querySelector("h4");
        let tarefaData = todo.querySelector("h5");

        if (tarefaHora.innerText != null) {
            tarefaHora.classList.remove("hide");
        }

        if (tarefaData.innerText != null) {
            tarefaData.classList.remove("hide");
        }

        if (tarefaTitulo.innerText === antigaTarefa) {
            tarefaTitulo.innerText = titulo;
            tarefaHora.innerText = hora;
            tarefaData.innerText = data;

            atualizaListaLocalStorage(antigaTarefa, titulo, hora, data);
        }

    });

};

const procuraTarefa = (procura) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let tarefaTitulo = todo.querySelector("h3").innerText.toLowerCase();

        const procuraNormalizada = procura.toLowerCase();

        todo.style.display = "flex";

        if (!tarefaTitulo.includes(procuraNormalizada)) {
            todo.style.display = "none";
        }

    });

};

const filtrarListas = (filtroValor) => {
    const todos = document.querySelectorAll(".todo");

    switch (filtroValor) {
        case "todos":
            todos.forEach((todo) => (todo.style.display = "flex"))
            break;

        case "feitos":
            todos.forEach((todo) =>
                todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
            );
            break;

        case "afazer":
            todos.forEach((todo) =>
                !todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
            );
            break;

        default:
            break;

    };

};

//eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoInputValue = todoInput.value;
    const horaInputValue = horaInput.value;
    const dataInputeValue = dataInput.value;

    if (todoInputValue) {
        salvaNaLista(todoInputValue, horaInputValue, dataInputeValue);
    } else {
        console.log("O campo tarefa e obrigatorio.");
    }

});

todoList.addEventListener("click", (e) => {
    const tarGetEle = e.target;
    const parentEle = tarGetEle.closest('.todo');

    let tarefaTitulo;
    let tarefaHora;
    let tarefaData;

    if ((!parentEle.querySelector("h4") && !parentEle.querySelector("h5"))) {
        const criaH4 = document.createElement("h4");
        const criaH5 = document.createElement("h5");

        parentEle.insertBefore(criaH4, tarGetEle.closest("div"));
        parentEle.insertBefore(criaH5, tarGetEle.closest("button"));
        criaH4.classList.add("hide");
        criaH5.classList.add("hide");
    }

    if (!parentEle.querySelector("h5")) {
        const criaH5 = document.createElement("h5");
        parentEle.insertBefore(criaH5, parentEle.querySelector("div"));
        criaH5.classList.add("hide");

    }

    if (parentEle && parentEle.querySelector("h3")) {
        tarefaTitulo = parentEle.querySelector("h3").innerText;
        tarefaHora = parentEle.querySelector("h4").innerText;
        tarefaData = parentEle.querySelector("h5").innerText;
    }

    if (tarGetEle.classList.contains("finish-todo")) {
        parentEle.classList.toggle("done");

        atualizaTareStatusfaLocalStorage(tarefaTitulo, tarefaHora);
    }

    if (tarGetEle.classList.contains("remove-todo")) {
        parentEle.remove();

        removeListaLocalStorage(tarefaTitulo);
    }

    if (tarGetEle.classList.contains("edit-todo")) {
        trocaForms();

        editInput.value = tarefaTitulo;
        editInputHr.value = tarefaHora;
        editInputData.value = tarefaData;

        antigaTarefa = tarefaTitulo;
        antigaTarefaHora = tarefaHora;
        antigaTarefaData = tarefaData;
    }

});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault;

    trocaForms();

});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editTodoInputValue = editInput.value;
    const editHoraInputValue = editInputHr.value;
    const editDataInputValue = editInputData.value;

    if (editTodoInputValue) {
        atualizaTodo(editTodoInputValue, editHoraInputValue, editDataInputValue)
    }

    trocaForms();

});

procuraInput.addEventListener("keyup", (e) => {
    const procura = e.target.value;

    procuraTarefa(procura);

});

apagaProcuraBtn.addEventListener("click", (e) => {
    e.preventDefault();

    procuraInput.value = "";
    procuraInput.dispatchEvent(new Event("keyup"));

});

filtraBtn, addEventListener("change", (e) => {
    const filtroValor = e.target.value;

    filtrarListas(filtroValor);

});
/////////////////////////////////////////////////////////////
//local storage
const pegaListasLocalStorege = () => {
    const todos = JSON.parse(localStorage.getItem("listas")) || [];

    return todos;
};

const loadListas = () => {
    const todos = pegaListasLocalStorege();
    todos.forEach((todo) => {
        salvaNaLista(todo.tarefa, todo.hora, todo.data, todo.feito, 0)
    });

};

const savarListasLoacalStorege = (lista) => {
    const listas = pegaListasLocalStorege();
    listas.push(lista);

    localStorage.setItem("listas", JSON.stringify(listas));

};

const removeListaLocalStorage = (tarefa) => {
    const todos = pegaListasLocalStorege();
    const filtrarListas = todos.filter((todo) => todo.tarefa !== tarefa);

    localStorage.setItem("listas", JSON.stringify(filtrarListas));

};

const atualizaTareStatusfaLocalStorage = (tarefa, hora) => {
    const todos = pegaListasLocalStorege();
    todos.map((todo) => 
        todo.tarefa === tarefa && todo.hora === hora ? (todo.feito = !todo.feito) : null
    );

    localStorage.setItem("listas", JSON.stringify(todos))

};

const atualizaListaLocalStorage = (listaAntigaTarefa, listaNovaTarefa, listaNovaHora, listaNovaData) => {
    const todos = pegaListasLocalStorege();
    todos.map((todo) => 
        todo.tarefa === listaAntigaTarefa ? (todo.tarefa = listaNovaTarefa, todo.hora = listaNovaHora, todo.data = listaNovaData) : null
    );

    localStorage.setItem("listas", JSON.stringify(todos));

};

loadListas();