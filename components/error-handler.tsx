interface ErrorHandlerProps {
  error?: string | string[] | undefined;
}

export function ErrorHandler({ error }: ErrorHandlerProps) {
  if (error === 'INVALID_TOKEN') {
    return (
      <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">
          Session expirée. Veuillez vous reconnecter.
        </p>
      </div>
    );
  }

  return null;
}
