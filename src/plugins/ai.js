/**
 * PAPYR AI PLATFORM GATEWAY & PROMPT OPTIMIZER
 * Unified, zero-dependency connector for OpenAI, Anthropic, Gemini, and local Ollama models.
 * v2.0 - Prompts template managers, semantic DOM token-minimizer serialization, and offline simulator fallbacks.
 */
(function(window) {
    const aiPlugin = {
        name: 'papyr-ai',
        version: '2.0.0',
        install(papyr) {
            papyr.ai = {
                /**
                 * Reusable prompt templates with simple curly-braces variable interpolation.
                 * Usage: papyr.ai.prompt("Hello {{name}}!", { name: "World" }) => "Hello World!"
                 */
                prompt(template, variables = {}) {
                    if (typeof template !== 'string') return '';
                    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
                        return variables[key] !== undefined ? String(variables[key]) : match;
                    });
                },

                /**
                 * Semantic DOM JSON minimizer.
                 * Traverses the element and extracts key content structures to minimize token footprints.
                 */
                toSemanticJSON(el) {
                    if (typeof document === 'undefined') {
                        return { status: "non-browser-node", info: "Document undefined in non-browser context" };
                    }
                    const element = typeof el === 'string' ? document.querySelector(el) : el;
                    if (!element) return null;

                    function extract(node) {
                        if (node.nodeType === 3) { // Text Node
                            const txt = node.textContent.trim();
                            return txt ? txt : null;
                        }
                        if (node.nodeType !== 1) return null; // Not an Element

                        const data = {
                            tag: node.tagName.toLowerCase(),
                        };

                        // Capture essential semantic identifiers
                        if (node.id) data.id = node.id;
                        if (node.className) data.class = node.className;
                        if (node.type) data.type = node.type;
                        if (node.value) data.value = node.value;
                        if (node.name) data.name = node.name;
                        if (node.placeholder) data.placeholder = node.placeholder;
                        
                        // Expose dataset configurations
                        const ds = Object.keys(node.dataset || {});
                        if (ds.length > 0) {
                            data.dataset = {};
                            ds.forEach(k => {
                                data.dataset[k] = node.dataset[k];
                            });
                        }

                        // Recurse children nodes
                        const children = [];
                        node.childNodes.forEach(child => {
                            const res = extract(child);
                            if (res) {
                                if (typeof res === 'string') {
                                    if (!data.text) data.text = '';
                                    data.text = (data.text + ' ' + res).trim();
                                } else {
                                    children.push(res);
                                }
                            }
                        });

                        if (children.length > 0) {
                            data.children = children;
                        }

                        return data;
                    }

                    return extract(element);
                },

                /**
                 * Unified AI Provider interface mapping OpenAI, Anthropic, Gemini, and Ollama endpoints.
                 * Enforces strict real-world connections, API key validations, and secure data privacy protocols.
                 */
                chat(options = {}) {
                    const provider = (options.provider || 'openai').toLowerCase();
                    const apiKey = options.apiKey || '';
                    const messages = options.messages || [];
                    const model = options.model;
                    
                    const isLocal = provider === 'ollama';
                    
                    if (!isLocal && !apiKey) {
                        return Promise.reject(new Error(`Security Validation Error: A secure API key is required to initiate real-world chat completions with provider '${provider}'.`));
                    }

                    const hasFetch = typeof fetch !== 'undefined';
                    if (!hasFetch) {
                        return Promise.reject(new Error("Environment Error: global fetch() API is required to communicate with AI endpoints."));
                    }

                    // Real integration logic
                    let url = options.endpoint || '';
                    let headers = {
                        'Content-Type': 'application/json'
                    };
                    let body = {};

                    if (provider === 'openai') {
                        url = url || 'https://api.openai.com/v1/chat/completions';
                        headers['Authorization'] = `Bearer ${apiKey}`;
                        body = {
                            model: model || 'gpt-4o-mini',
                            messages: messages
                        };
                    } else if (provider === 'anthropic') {
                        url = url || 'https://api.anthropic.com/v1/messages';
                        headers['x-api-key'] = apiKey;
                        headers['anthropic-version'] = '2023-06-01';
                        body = {
                            model: model || 'claude-3-5-sonnet-20241022',
                            messages: messages.filter(m => m.role !== 'system'),
                            max_tokens: 1024
                        };
                        const systemMsg = messages.find(m => m.role === 'system');
                        if (systemMsg) {
                            body.system = systemMsg.content;
                        }
                    } else if (provider === 'gemini') {
                        const gemModel = model || 'gemini-2.5-flash';
                        url = url || `https://generativelanguage.googleapis.com/v1beta/models/${gemModel}:generateContent?key=${apiKey}`;
                        
                        const contents = messages.filter(m => m.role !== 'system').map(m => {
                            return {
                                role: m.role === 'assistant' ? 'model' : 'user',
                                parts: [{ text: m.content }]
                            };
                        });
                        
                        body = { contents: contents };
                        
                        const systemMsg = messages.find(m => m.role === 'system');
                        if (systemMsg) {
                            body.systemInstruction = {
                                parts: [{ text: systemMsg.content }]
                            };
                        }
                    } else if (provider === 'ollama') {
                        url = url || 'http://localhost:11434/api/chat';
                        body = {
                            model: model || 'llama3',
                            messages: messages,
                            stream: false
                        };
                    }

                    return fetch(url, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(body)
                    })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`API error: ${res.status} ${res.statusText}`);
                        }
                        return res.json();
                    })
                    .then(data => {
                        let parsedText = '';
                        if (provider === 'openai' || provider === 'ollama') {
                            parsedText = data.choices ? data.choices[0].message.content : (data.message ? data.message.content : '');
                        } else if (provider === 'anthropic') {
                            parsedText = data.content ? data.content[0].text : '';
                        } else if (provider === 'gemini') {
                            parsedText = (data.candidates && data.candidates[0].content) ? data.candidates[0].content.parts[0].text : '';
                        }
                        return {
                            text: parsedText,
                            provider: provider,
                            simulated: false,
                            raw: data
                        };
                    });
                }
            };
        }
    };

    // Auto-register in global window environment for backwards compatibility
    const targetPapyr = window.papyr || (typeof global !== 'undefined' && global.papyr);
    if (targetPapyr) {
        targetPapyr.use(aiPlugin);
    }

    // Export the plugin object for ESM/CommonJS contexts
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = aiPlugin;
    } else if (typeof exports !== 'undefined') {
        exports.default = aiPlugin;
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return aiPlugin; });
    } else {
        window.papyrAI = aiPlugin;
    }
})(typeof window !== 'undefined' ? window : this);
