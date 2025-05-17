import { createFileRoute } from '@tanstack/react-router';

import idbCache from '@/lib/idbCache';
import { Shareholder } from '@/lib/shareholder';
import App from '@/pages/app/App';

export const Route = createFileRoute('/')({
    loader: async () => {
        const shareholdersResult = await idbCache.get('shareholders');
        return {
            shareholders: shareholdersResult.unwrapOr<Shareholder[]>([]),
        };
    },
    component: Index,
});

function Index() {
    const { shareholders } = Route.useLoaderData();
    return <App initialShareholders={shareholders} />;
}
