/** Resolve success only after the browser accepts the write; denial stays retryable. */
export async function copyText(
  text: string,
  clipboard: Pick<Clipboard, 'writeText'> | undefined = globalThis.navigator?.clipboard,
): Promise<boolean> {
  try {
    if (!clipboard) return false;
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
