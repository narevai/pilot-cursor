#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";
const PREVIEW = 220;

const args = process.argv.slice(2);
const flag = args.indexOf("--model");
const model = flag === -1 ? "auto" : args[flag + 1];
const prompt = args[args.length - 1];

const child = spawn(
  "agent",
  ["-p", "--force", "--approve-mcps", "--trust", "--output-format", "stream-json", "--stream-partial-output", "--model", model, prompt],
  { stdio: ["ignore", "pipe", "inherit"] },
);

let kind = "";
let segment = "";
const calls = new Map();

function write(next, text) {
  if (kind !== next && kind !== "") process.stdout.write(`${RESET}\n`);
  kind = next;
  process.stdout.write(text);
}

function line(text) {
  if (kind !== "") process.stdout.write(`${RESET}\n`);
  kind = "";
  process.stdout.write(`${text}${RESET}\n`);
}

function preview(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  const flat = (text ?? "").replace(/\s+/g, " ").trim();
  return flat.length > PREVIEW ? `${flat.slice(0, PREVIEW)}…` : flat;
}

function resultText(result) {
  const content = result?.success?.content;
  if (Array.isArray(content)) {
    return content.map((item) => item?.text?.text ?? item?.text ?? "").join(" ");
  }
  return typeof content === "string" ? content : (result?.success ?? result);
}

function toolCall(event) {
  const [name, body] = Object.entries(event.tool_call ?? {})[0] ?? [];
  if (name !== "mcpToolCall" || !body) return;
  const tool = String(body.args?.name ?? body.args?.toolName ?? "tool").replace(/^.*?-(?=[a-z_]+$)/, "");
  if (event.subtype === "started") {
    calls.set(event.call_id, tool);
    line(`${CYAN}⚙ ${tool}${RESET} ${DIM}${preview(body.args?.args ?? {})}`);
  } else if (event.subtype === "completed") {
    const failed = body.result?.error !== undefined || body.result?.success === undefined;
    line(`${failed ? RED + "✗" : GREEN + "✓"} ${tool}${RESET} ${DIM}${preview(resultText(body.result))}`);
  }
}

function handle(event) {
  switch (event.type) {
    case "system":
      line(`${DIM}${event.subtype}: model ${event.model ?? model}`);
      break;
    case "thinking":
      if (event.subtype === "delta" && event.text) write("thinking", `${DIM}${event.text}`);
      break;
    case "assistant": {
      if (event.timestamp_ms === undefined) break;
      const text = (event.message?.content ?? []).map((part) => part.text ?? "").join("");
      if (!text) break;
      if (text.length > 1 && text === segment) {
        segment = "";
        break;
      }
      segment += text;
      write("assistant", `${RESET}${text}`);
      break;
    }
    case "tool_call":
      segment = "";
      toolCall(event);
      break;
    case "result":
      line(`${event.is_error ? RED : GREEN}── ${event.is_error ? "failed" : "done"} in ${((event.duration_ms ?? 0) / 1000).toFixed(1)} s`);
      break;
    default:
      break;
  }
}

createInterface({ input: child.stdout }).on("line", (raw) => {
  if (!raw.trim()) return;
  try {
    handle(JSON.parse(raw));
  } catch {
    line(raw);
  }
});

child.on("error", (error) => {
  line(`${RED}Could not start agent: ${error.message}`);
  process.exit(127);
});
child.on("close", (code) => {
  if (kind !== "") process.stdout.write(`${RESET}\n`);
  process.exit(code ?? 1);
});
