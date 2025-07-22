import ClientEditPage from './ClientEditPage';

// For SSG (optional)
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

// Next.js 15: params is a Promise and must be awaited
export default async function ClientEditPageWithParams({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClientEditPage clientId={id} />;
}
