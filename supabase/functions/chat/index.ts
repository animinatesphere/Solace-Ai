// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// const OPENROUTER_KEY = Deno.env.get("OPENROUTER_KEY") || "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";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
// };

// serve(async (req) => {
//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }

//   try {
//     const { messages } = await req.json();

//     const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${OPENROUTER_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "nvidia/nemotron-3-nano-30b-a3b:free",
//         messages,
//         max_tokens: 512,
//         temperature: 0.7,
//       }),
//     });

//     const text = await res.text();

//     if (!res.ok) {
//       return new Response(
//         JSON.stringify({ error: `OpenRouter error (${res.status}): ${text}` }),
//         { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }

//     // OpenRouter returns OpenAI-compatible format, pass it through directly
//     return new Response(text, {
//       headers: { ...corsHeaders, "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     return new Response(
//       JSON.stringify({ error: err.message }),
//       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//     );
//   }
// });
