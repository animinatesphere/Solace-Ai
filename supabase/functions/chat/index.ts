// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// const GROQ_KEY = Deno.env.get("GROQ_KEY") || "";
// const OPENROUTER_KEY = Deno.env.get("OPENROUTER_KEY") || "";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
// };

// // AI providers in priority order — tries each until one works
// const providers = [
//   {
//     name: "Groq",
//     url: "https://api.groq.com/openai/v1/chat/completions",
//     key: () => GROQ_KEY,
//     model: "llama-3.1-8b-instant",
//   },
//   {
//     name: "OpenRouter",
//     url: "https://openrouter.ai/api/v1/chat/completions",
//     key: () => OPENROUTER_KEY,
//     model: "nvidia/nemotron-3-nano-30b-a3b:free",
//   },
// ];

// async function tryProvider(provider, messages) {
//   const res = await fetch(provider.url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${provider.key()}`,
//     },
//     body: JSON.stringify({
//       model: provider.model,
//       messages,
//       max_tokens: 512,
//       temperature: 0.7,
//     }),
//   });

//   const text = await res.text();
//   if (!res.ok) throw new Error(`${provider.name} (${res.status}): ${text}`);

//   const data = JSON.parse(text);
//   const content = data.choices?.[0]?.message?.content;
//   if (!content) throw new Error(`${provider.name}: empty response`);

//   return data;
// }

// serve(async (req) => {
//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }

//   try {
//     const { messages } = await req.json();
//     const errors = [];

//     // Try each provider in order
//     for (const provider of providers) {
//       if (!provider.key()) continue; // skip if no key set
//       try {
//         const data = await tryProvider(provider, messages);
//         return new Response(JSON.stringify(data), {
//           headers: { ...corsHeaders, "Content-Type": "application/json" },
//         });
//       } catch (err) {
//         errors.push(err.message);
//         // Continue to next provider
//       }
//     }

//     // All providers failed
//     return new Response(
//       JSON.stringify({ error: `All AI providers failed: ${errors.join(" | ")}` }),
//       { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//     );
//   } catch (err) {
//     return new Response(
//       JSON.stringify({ error: err.message }),
//       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//     );
//   }
// });
