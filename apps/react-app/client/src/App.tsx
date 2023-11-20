import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '../public/vite.svg'
import './App.css'
import { initClient } from "@typed-router/core";
import { router } from "server/src/router";

const client = initClient(router, async (input) => {
  const params = new URLSearchParams({
    ...input.query
  });
  return await fetch(`http://127.0.0.1:8100${input.path}?${params}`, {
    method: input.method,
    body: JSON.stringify(input.body), // body data type must match "Content-Type" header
  }).then(s => s.json())
})

type User = { name: string, age: number, role: string }

function App() {
  const [data, setData] = useState<User[] | User>([])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo"/>
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo"/>
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={async () => {
          client.userRouter.greetings({ query: { name: "John" } })
            .then(s => alert(s))
        }}>Hello
        </button>
        <button onClick={async () => {
          client.userRouter.all({ query: { age: "18", name: "" } })
            .then(s => setData(s))
        }}>Get Data
        </button>
        <br/> <br/> <br/>
        <div>{Array.isArray(data) && data.length > 0 ? data.map((s, k) => {
          return <div key={k}>
            <b>Имя</b>: {s.name} / <b>Возраст</b>: {s.age} / <b>Роль</b>: {s.role}
          </div>
        }) : "Нет данных"}</div>
        <div>{!Array.isArray(data) && Boolean(data) ? <div>
          <b>Имя</b>: {data.name} / <b>Возраст</b>: {data.age} / <b>Роль</b>: {data.role}
        </div> : "Нет данных"}</div>
      </div>
    </>
  )
}

export default App
