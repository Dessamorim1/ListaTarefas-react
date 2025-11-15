import './App.css'
import { useState, useEffect } from 'react'
import Parse from './parseConfig'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [tarefas, setTarefas] = useState([])
  const [input, setInput] = useState("")

  useEffect(() => {
    buscarTarefas()
  }, [])

  async function adicionarTarefa() {
    if (!input) return

    await criarTarefa(input)
    setInput("")
    buscarTarefas()
  }

  async function criarTarefa(titulo) {
    const Tarefas = Parse.Object.extend("ListaTarefas")
    const tarefa = new Tarefas()
    tarefa.set("Nome_Tarefa", titulo)

    try {
      await tarefa.save()
      console.log("Tarefa Salva com Sucesso")
    } catch (error) {
      console.log("Erro ao salvar tarefa: ", error)
    }
  }

  async function buscarTarefas() {
    const Tarefas = Parse.Object.extend("ListaTarefas")
    const query = new Parse.Query(Tarefas)

    try {
      const results = await query.find()
      const lista = results.map(obj => ({
        id: obj.id,
        titulo: obj.get("Nome_Tarefa")
      }))
      setTarefas(lista)
    } catch (err) {
      console.log("Erro ao buscar:", err)
    }
  }

  async function deletarTarefa(id) {
    const Tarefas = Parse.Object.extend("ListaTarefas")
    const query = new Parse.Query(Tarefas)

    try {
      const tarefa = await query.get(id)
      await tarefa.destroy()
      buscarTarefas()
    } catch (err) {
      console.log("Erro ao deletar:", err)
    }
  }

  return (
    <div>
      <h1>Lista de Tarefas</h1>

      <div className="container text-center">
        <div class="row">
          <div className="col mt-2">
            <p>Adicione uma tarefa em sua lista</p>
          </div>
          <div className="col">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Nova tarefa" />
          </div>
          <div className="col">
            <button className= "btn-add" onClick={adicionarTarefa}>Adicionar</button>
          </div>
        </div>
      </div>

      <ul className="container-fluid">
        {tarefas.map((tarefa) => (
          <li key={tarefa.id} className="col d-flex align-items-center justify-content-between">
            <span>{tarefa.titulo}</span>
            <button className= "btn-excluir" onClick={() => deletarTarefa(tarefa.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App