exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { name = "", phone = "", message = "" } =
      JSON.parse(event.body || "{}");

    if (!name || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Заполните имя и телефон" })
      };
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Telegram не настроен" })
      };
    }

    const text =
      `🟣 НОВАЯ ЗАЯВКА WEBORA\n\n` +
      `👤 Имя: ${name}\n` +
      `📞 Контакт: ${phone}\n` +
      `💬 Сообщение: ${message || "—"}`;

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text
        })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Ошибка Telegram" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ошибка сервера" })
    };
  }
};
