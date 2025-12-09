export function Footer() {
  const currentData = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-white/5 bg-background text-muted-foreground">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">© {currentData} Novus. All rights reserved.</p>
      </div>
    </footer>
  );
}
