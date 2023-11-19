import { initServer, initClient } from "@typed-router/core"

export const { route, createRouter, declareSchema } = initServer((req, res) => {
  console.log("debug")
  return {
    greetings: (name: string) => `hello ${name}!`,
    version: `v 1.33.7`
  } as const
})