import type { PageLoad } from './$types';
export const load: PageLoad = async ({ data }) => {
    return {
        userId: data.userId,
        factoryLines: data.factoryLines
    };
};