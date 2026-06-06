import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="border-t bg-parchment-muted py-8">
      <Container className="text-center text-charcoal-muted">
        <p className="font-serif italic">&quot;Building dreams, preserving memories.&quot;</p>
        <p className="mt-4 text-xs">Made with &hearts; for the Class of 2025</p>
      </Container>
    </footer>
  );
}