import { route, declareSchema } from "./init"

type User = {
  id: number
  name: string,
  age: number,
  role: "admin" | "moderator"
}

type CreateUser = Omit<User, "id">

const users: User[] = [
  { id: 1, name: "Max", age: 18, role: "admin" },
  { id: 2, name: "Dima", age: 29, role: "moderator" }
]

const all = route()
  .path("user")
  .method("GET")
  .query(declareSchema<{ name: string, age: string }>())
  .handler(req => {
    console.log(req.query)
    const user = users.find(s => s.name === req.query.name || s.age === Number(req.query.age))
    if (user) return user
    else return users
  })


const greetings = route()
  .path("greetings")
  .method("GET")
  .query(declareSchema<{ name: string }>())
  .handler(req => {
    return req.greetings(req.query.name)
  })

const getUserTest = all

const create = route()
  .path("user")
  .method("POST")
  .body(declareSchema<CreateUser>())
  .handler((req) => {
    const user: User = {
      id: 1,
      ...req.body
    }
    return user
  })

const byId = route()
  .path("user/:id")
  .method("GET")
  .handler((req) => {
    return users.find(s => s.id === Number(req.params.id))
  })

const createUserTest = create.path

export const userRouter = {
  create,
  all,
  byId,
  greetings
}