export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-wp-chat-bg">
      <div className="text-center">
        <div className="w-64 h-64 mx-auto mb-8 rounded-full bg-wp-green/10 flex items-center justify-center">
          <span className="text-6xl">💬</span>
        </div>
        <h2 className="text-2xl font-light mb-3 text-wp-text-primary">
          WhatsApp Web
        </h2>
        <p className="text-sm text-wp-text-secondary max-w-md mx-auto">
          Send and receive messages without keeping your phone online.
          <br />
          Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
        </p>
      </div>
    </div>
  );
}
