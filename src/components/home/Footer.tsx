export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>
          © {new Date().getFullYear()} PosterAI. All rights reserved.
        </p>

        <p>
          AI-assisted design studio
        </p>
      </div>
    </footer>
  );
}