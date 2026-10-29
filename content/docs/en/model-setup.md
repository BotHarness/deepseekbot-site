---
{
  "title": "API and Bot models",
  "description": "Configure API providers, choose each Bot’s models and verify its model preset.",
  "order": 13,
  "source": "docs/model-setup.md",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

Continuing from [Install DeepSeekBot](/docs/installation), this guide walks you through configuring model providers and assigning models to each Bot. Set up your API provider in global settings first, then choose models for individual Bots. Multiple Bots can share the same provider.

## 1. Configure a provider in DSH

Open **Settings → Models** at the bottom left. Click **Edit** on an existing provider, or choose **Add model provider** to set up a new one.

- **Third-party provider**: Choose a service from the built-in catalog, enter its API key, and click **Save**. If a key is supplied by your launch environment, the field appears read-only and is managed through that environment.
- **Custom model API**: For OpenAI/Anthropic-compatible gateways or self-hosted services, fill in the fields below, add at least one model, and click **Create provider**.

![DSH provider catalog and custom settings](/guides/settings/model-provider-catalog-zh.webp)

| Field | Value / purpose |
| --- | --- |
| Provider | The service from the built-in catalog; determines the adapter and default model catalog. |
| Provider ID | A unique identifier for a custom provider starting with a lowercase letter, such as `acme-gateway`. Model routing uses this ID rather than the display name. |
| Display name | A friendly name to help you recognize the provider in the UI. |
| API URL | The service's base URL, such as `https://gateway.example/v1`. Leave a built-in provider's override empty to use its default endpoint. |
| API protocol | Match the endpoint format: OpenAI Chat Completions, OpenAI Responses, or Anthropic Messages. |
| API key | Your access credential for the service. Always enter it here in DSH's credentials form—never paste API keys into a Bot persona or chat message. |
| Fetch available models | Queries the service for its model list (when supported by the endpoint and your credentials). If fetching fails, you can add model IDs manually. |
| Model ID | The exact model identifier sent in API requests. |
| Model display name | A readable label shown in the model picker; does not change the underlying Model ID. |
| Model options → Context window | The model's supported context capacity (for example, `256K`). |
| Model options → Maximum output tokens | The model's single-turn output cap (for example, `32K`), representing its upper limit rather than a fixed output length. |
| Model options → Input types | Text is always enabled. Check images only if the model natively supports vision inputs. |

![Custom API form and per-model options](/guides/settings/model-provider-custom-zh.webp)

For built-in providers, **Custom settings** lets you override the default API URL and model list. Make sure your provider has at least one model in its catalog—otherwise, no models from that provider will appear in the picker. Once your provider is saved, continue below to assign models to your Bot.

## 2. Open the target Bot's Model settings

Close Settings, enter **Bot mode**, and open the Bot's DM. In the Channel sidebar on the right, expand **Model** and click the **Main model** card to open the **Model** dialog. See [Model](/docs/channel-sidebar/model) for details on what each card displays.

![The Model entry in the Bot DM's Channel sidebar](/guides/channel-sidebar/14-model-zh.webp)

This dialog configures the current Bot only. Global **Bot settings** control app-wide appearance, sorting, and concurrency limits, while DSH **Agent presets** control native toolsets and working styles independently of your Bot's model configuration.

## 3. Choose the models and save

You can pick models directly in the dialog without creating a preset first.

| Field / action | Purpose |
| --- | --- |
| Main model | The model the Bot uses for receiving messages, coordinating work, and everyday conversation. Type in the search box to filter the list. |
| Task model | The default model used for delegated background tasks when no specific model is selected. |
| Reasoning effort | The reasoning level supported by the selected model. **Default** leaves it unspecified. Available options vary by model. |
| Advanced | The **Simple / Advanced** toggle next to **Task model**. Simple mode (the default) uses a single model and reasoning effort. Switching to Advanced lets you build a list of candidate model cards: add models at the top, check which reasoning efforts each allows, pick a default effort, mark one card as the primary default, and add optional notes describing when to use each model. When delegating a new task, the Orchestrator reads your notes so it can pick a faster or more cost-effective model when appropriate. Switching back to Simple saves a single model again. |
| Save | Saves these settings for the current Bot, taking effect from the next turn. |

![The Model dialog opened from the sidebar](/guides/channel-sidebar/15-model-dialog-zh.webp)

After saving, the two sidebar cards display your chosen `model · effort`. Each Bot can use its own combination of models.

## 4. Use presets (optional)

A preset is a reusable bundle of model settings, which is convenient when several Bots share the same setup.

| Action | Scope |
| --- | --- |
| Save as preset | Saves the dialog's current settings as a new preset and links this Bot to it. |
| Fill from a preset | Populates the dialog from a saved preset; click **Save** to apply it to this Bot. |
| Change anything | Unlinks this Bot from the preset and saves your custom settings for this Bot alone, leaving the preset unchanged. |

A delegated task's model is locked in when the task is created. Changing default models does not alter tasks that are already running or restart a reply that is currently being generated.

## 5. Confirm your model in action

Return to the chat and send a short message. Once the Bot replies, you can open the Bot's Profile (click its name or avatar in the chat header → **View details**) and switch **Token usage** to **By model** to see usage under the new model. To inspect a specific conversation, open its DSH Session from **Sessions** in the right sidebar to view the active model selector and per-turn token usage.

![Actual Session model selector and reply after applying the preset](/guides/settings/model-session-verification-zh.webp)

When you update a Bot's model settings, existing conversations adopt the new model on their next turn. You can check any running background task in its own session view.

| Symptom | What to check |
| --- | --- |
| “No models are available” | Go to **Settings → Models** and make sure your provider is saved, credentials are valid, and at least one model is listed in the catalog, then reopen the Model dialog. |
| “Current model unavailable” / repair needed | A provider or model may have been renamed or removed. Open the Model dialog, pick an available model, and save. |
| No reply / service error | Double-check your API URL, protocol, API key, model ID, and account quota. Test in a local DM first. |
| Session model differs from your settings | Open the Session from the sidebar to check its model selector and next-turn usage after sending a new message. |

For other settings and preferences, see the [Settings guide](/docs/settings). For IM integrations, see the [Lark / Feishu](/docs/lark-connection) and [Slack](/docs/slack-connection) guides.
