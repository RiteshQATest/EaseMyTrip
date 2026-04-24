const {test,expect}=require('@playwright/test');
const HomePage=require('../src/pages/homepage');

test.describe('EaseMyTrip Home_Page', () => {
    test('Verify the user navigate to EaseMyTrip website',async ({page})=>{
    const homepage=new HomePage(page);
    await homepage.goto();
    await homepage.closeBrowser();
    });
    test('Verify the TITLE of the page',async ({page})=>{
const homepage=new HomePage(page);
await homepage.goto();
await homepage.homePageTitle();
await homepage.closeBrowser();

    });

    test('Display the tabs of the homepage',async ({page})=>{
        const homepage=new HomePage(page);
        await homepage.goto();
        await homepage.homePagetabs();
        await homepage.closeBrowser();
    })

});