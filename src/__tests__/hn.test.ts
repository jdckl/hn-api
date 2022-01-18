import { getItemById } from '../controllers/hn-api/hackerNewsApi';

// Single item
it('should get a single HN item from the API', async () => {
    const hnItem = await getItemById('29965110');
    expect(hnItem?.title).toBe('The curious case of the Raspberry Pi in the network closet (2019)');
})

// No item found
it('should return an undefined item from the HN API', async () => {
    const hnItem = await getItemById('x');
    expect(hnItem).toBeUndefined();
})