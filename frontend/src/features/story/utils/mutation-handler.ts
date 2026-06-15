import { toast } from "sonner";

/**
 * Wrap a mutation call with toast notifications + console.error.
 * Replaces 5 try/catch + toast duplications in story actions.
 */
export async function withMutationToast<T>(
  label: string,
  successMessage: string,
  errorMessage: string,
  fn: () => Promise<T>
): Promise<T> {
  try {
    const result = await fn();
    if (successMessage) toast.success(successMessage);
    return result;
  } catch (err) {
    console.error(`Failed to ${label}:`, err);
    if (errorMessage) toast.error(errorMessage);
    throw err;
  }
}
