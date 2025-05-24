// utils/translate.js
export const translateWithGPT = async (text, targetLanguage) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Translate the following text to ${targetLanguage}. Return only the translated text, nothing else.`,
        },
        { role: "user", content: text },
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  return data.choices[0]?.message?.content || text; // Fallback to original if error
};