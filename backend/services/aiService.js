const OpenAI = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
const client = apiKey ? new OpenAI({ apiKey }) : null;

async function chat(messages, context) {
  // Demo fallback helper (no external API)
  function demoReply(msgs, ctx) {
    const last = (msgs || []).filter(Boolean).slice(-4);
    const tasks = Array.isArray(ctx?.tasks) ? ctx.tasks : [];
    const todo = tasks.filter(t=>t.status==='todo').length;
    const ip = tasks.filter(t=>t.status==='in_progress').length;
    const done = tasks.filter(t=>t.status==='done').length;
    const recent = last.map(m=>`- ${m.role}: ${m.content}`).join('\n');
    return [
      'AI demo (no external API):',
      `Tasks → To Do: ${todo}, In Progress: ${ip}, Done: ${done}.`,
      'Recent messages:',
      recent || '(none)',
      'Suggestion: pick the top 1-2 To Do items, set owners and due dates, then move them to In Progress.'
    ].join('\n');
  }

  // If no key and demo is allowed, return local response
  if ((!apiKey || !client) && process.env.AI_DEMO_MODE === 'true') {
    return demoReply(messages, context);
  }
  if (!apiKey || !client) {
    throw new Error('Missing OPENAI_API_KEY in environment');
  }

  const sys = {
    role: 'system',
    content: `You are AICo, an AI assistant embedded in a collaborative workspace. Use provided context to be concise and actionable.`
  };
  const userContext = context ? JSON.stringify(context).slice(0, 4000) : '';
  const finalMessages = [sys, ...messages, userContext ? { role: 'system', content: `Context: ${userContext}` } : null].filter(Boolean);
  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: finalMessages
    });
    return completion.choices[0].message.content;
  } catch (e) {
    const code = e?.status || e?.code;
    if (code === 429 && process.env.AI_DEMO_MODE === 'true') {
      return demoReply(messages, context);
    }
    throw e;
  }
}

module.exports = { chat };
