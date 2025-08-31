export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-wp-chat-bg p-4">
      <div className="text-center max-w-md">
        <div className="w-32 h-32 md:w-64 md:h-64 mx-auto mb-6 md:mb-8 rounded-full bg-wp-green/10 flex items-center justify-center">
          <span className="text-4xl md:text-6xl">💬</span>
        </div>
        <h2 className="text-xl md:text-2xl font-light mb-3 text-wp-text-primary">
          WhatsApp Web
        </h2>
        <p className="text-sm text-wp-text-secondary mx-auto px-4">
          Send and receive messages without keeping your phone online.
          <br className="hidden md:block" />
          <span className="md:hidden"> </span>
          Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
        </p>
      </div>
    </div>
  );
}
