
import MatterDetail from './MatterDetail';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ];
}

export default function MatterDetailPage({ params }: { params: { id: string } }) {
  return <MatterDetail params={params} />;
}
