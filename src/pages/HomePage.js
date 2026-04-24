const { JsonFormatter, UsageJsonFormatter } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { json } = require('stream/consumers');

class HomePage {
constructor(page){
    this.page=page;
    this.homepagetitle='https://www.easemytrip.com';
    
}
    async goto(){
        await this.page.goto(process.env.BASE_URL || 'https://www.easemytrip.com/');
console.log('Navigate to the EaseMyTrip website');
    }
 
async closeBrowser(){
    await this.page.close();
}
async homePageTitle()
{
const homepagetitle=await this.page.title();
console.log('Display the TITLE of the page : ' +homepagetitle);
await expect(this.page).toHaveTitle(homepagetitle);

}
async homePagetabs()
{
    const pagetabs=await this.page.locator('//div[@class="_onerohdr"]').allTextContents();
    console.log('Display the tabs of the page : ' +pagetabs);

}
}
 module.exports = HomePage;