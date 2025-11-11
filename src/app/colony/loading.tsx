import { PageLoading } from '@/components/ui/loading';

export default function ColonyLoading() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="border-b pb-3 md:pb-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-2" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
      <PageLoading />
    </div>
  );
}
