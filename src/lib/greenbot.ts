export async function askGreenBot(message: string, kitType?: string): Promise<string> {
  const response = await fetch(import.meta.env.VITE_CHAT_FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, kitType }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al contactar GreenBot");
  }

  return data.reply;
}
