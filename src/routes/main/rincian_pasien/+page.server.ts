import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
    const data = await parent();
    return { ...data };
};

export const actions: Actions = {}; 