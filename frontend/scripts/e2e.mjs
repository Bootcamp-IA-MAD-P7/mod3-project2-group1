import { execFileSync, execSync } from "node:child_process"
import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import net from "node:net"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const BACKEND = path.resolve(ROOT, "../backend")
const CORS = '["http://localhost:5176","http://localhost:5177"]'

function waitForPort(port, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs
  const hosts = ["127.0.0.1", "::1"]
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      let tried = 0
      for (const host of hosts) {
        const socket = net.connect({ port, host })
        socket.once("connect", () => {
          socket.destroy()
          resolve()
        })
        socket.once("error", () => {
          socket.destroy()
          tried += 1
          if (tried === hosts.length) {
            if (Date.now() > deadline) reject(new Error(`port ${port} not ready in time`))
            else setTimeout(tryConnect, 400)
          }
        })
      }
    }
    tryConnect()
  })
}

function spawnServer(command, args, opts) {
  const child = spawn(command, args, { ...opts, shell: false })
  child.stdout?.on("data", (data) => process.stdout.write(`[${command}] ${data}`))
  child.stderr?.on("data", (data) => process.stderr.write(`[${command}] ${data}`))
  child.on("error", (error) => {
    console.error(`[e2e] failed to spawn ${command}:`, error.message)
  })
  return child
}

function killTree(pid) {
  try {
    execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" })
  } catch {
    /* best effort */
  }
}

async function main() {
  const backendMarker = existsSync(path.join(BACKEND, ".env"))
  if (!backendMarker) {
    console.warn("[e2e] backend/.env not found; backing off external env only.")
  }

  const backendEnv = (port, model_path) => ({
    PORT: String(port),
    APP_ENV: model_path ? "development" : "production",
    MODEL_PATH: model_path,
    CORS_ORIGINS: CORS,
  })

  const children = []
  try {
    children.push(spawnServer("uv", ["run", "python", "scripts/e2e_backend.py"], { cwd: BACKEND, env: { ...process.env, ...backendEnv(8101, "ml/artifacts/qa_preview.joblib") } }))
    children.push(spawnServer("uv", ["run", "python", "scripts/e2e_backend.py"], { cwd: BACKEND, env: { ...process.env, ...backendEnv(8102, "") } }))
    const viteBin = path.join(ROOT, "node_modules", "vite", "bin", "vite.js")
    children.push(spawnServer("node", [viteBin, "--port", "5176", "--strictPort"], { cwd: ROOT, env: { ...process.env, VITE_API_BASE_URL: "http://localhost:8101/api/v1" } }))
    children.push(spawnServer("node", [viteBin, "--port", "5177", "--strictPort"], { cwd: ROOT, env: { ...process.env, VITE_API_BASE_URL: "http://localhost:8102/api/v1" } }))

    await Promise.all([
      waitForPort(8101),
      waitForPort(8102),
      waitForPort(5176),
      waitForPort(5177),
    ])
    console.log("[e2e] servers ready (8101/8102 + 5176/5177)")

    try {
      execSync("npx playwright test " + process.argv.slice(2).join(" "), { stdio: "inherit", cwd: ROOT })
    } catch (error) {
      process.exitCode = typeof error.status === "number" ? error.status : 1
    }
  } finally {
    for (const child of children) {
      if (child.pid) killTree(child.pid)
    }
  }
}

main().catch((error) => {
  console.error("[e2e] runner error:", error.message)
  process.exitCode = 1
})