const {test,expect}=require('@playwright/test');
const FlightPage=require('../src/pages/flights_page');

test.describe('EaseMyTrip Flights_Page', () => {
    test('Verify the user display to Flights Page',async ({page})=>{
    const flightpage=new FlightPage(page);
    }
    );

});

    
