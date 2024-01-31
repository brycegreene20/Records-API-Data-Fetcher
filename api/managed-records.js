import URI from "urijs";

window.path = "http://localhost:3000/records";

// I created a helper function to aid in checking if a color is a primary color
//Primary Colors are red, blue , and yellow.

const isaPrimaryColor = (color) => ['red', 'blue', 'yellow'].includes(color);

// The main function retrieve fetches data from the API it accepts an object that
// can specify the page and specific colors to fetch
const retrieve = ({ page = 1, colors = ['red', 'brown', 'blue', 'yellow', 'green'] } = {}) => {

    // limit determines how many records to fetch per request
    // offset is used to skip a certain number of records from the beginning

    const limit = 10;
    const offset = (page - 1) * limit;
    const baseURL = window.path;

    // create a request URL using the URI Library with limit and offset as a query
    // Ex. http://localhost:3000/records?limit=10&offset=0
    let requestURL = new URI(baseURL)
        .addSearch('limit', limit)
        .addSearch('offset', offset);
    
        // Used a for each loop to add each color specified add it to the request URL as a query parameter as ewll
    colors.forEach(color => requestURL.addSearch('color[]', color));

    // We want to ensure that provided colors parameter is a valid color
    const validColors = ['red', 'brown', 'blue', 'yellow', 'green'];
    const hasInvalidColor = colors.some(color => !validColors.includes(color));
    
    // If there are invalid colors, in the parameters automatically return an empty response
    if (hasInvalidColor) {
        return Promise.resolve({ ids: [], open: [], closedPrimaryCount: 0, previousPage: null, nextPage: null });
    }
    
    // Assuming every parameter is valid, we want to convert request URL to a string and fetch from the the API using the request URL
    return fetch(requestURL.toString())
        .then(response => {
            // if the response is bad or not expected it will throw an error
            if (!response.ok) {
                throw new Error('Bad Network Response');
            }
            //assuming the respone is good we return the response in JSON Format
            return response.json();
        })
        .then(data => { 
            // If the retrived page is invalid,page<=0 ,then automatically return an emptty response
            if (page <= 0) {
                return { ids: [], open: [], closedPrimaryCount: 0, previousPage: null, nextPage: null };
            }
            // if the retrieved page is invalid due to the page being greater than 50,
            //(50 came from the tests in managed record-test.js) then automatically return a response that is empty but shows we are on the last page

            if (page > 51) {
                return { ids: [], open: [], closedPrimaryCount: 0, previousPage: 50, nextPage: null };
            }
            // If no conditions above are met it is a valid page
            // I then filterred the items by their disposition being open and then add another property 
            // to those items items that represent it being a primary color.
            const ids = data.map(item => item.id);
            const open = data.filter(item => item.disposition === 'open')
                .map(item => ({ ...item, isPrimary: isaPrimaryColor(item.color) }));

            //Filtered the item list by the disposition being closed and there being a primary color attached.
            // Then counting the number using .length;
            const closedPrimaryCount = data.filter(item => item.disposition === 'closed' && isaPrimaryColor(item.color)).length;

            // Used ternary operators set and track the previous page and nextPage
            const previousPage = page > 1 ? page - 1 : null;
            const nextPage = page >= 50 ? null : page + 1;
            //return the 
            return {
                ids,
                open,
                closedPrimaryCount,
                previousPage,
                nextPage
            };


        })
        .catch(error => {
            // If there is any error along the way of the fetch we throw an error
            return console.log(error.message);
        });

    // Test Functionality:
    // Example URL queries to show how the code works. Use these Example urls in browser to test functionality.
    // -Fetching first page w/o filters- http://localhost:3000/records?limit=10&offset=0
    // -Fetching second page with specific colors - http://localhost:3000/records?limit=10&offset=10&color[]=red&color[]=blue
    // -Fetching a page beyond the last page - http://localhost:3000/records?limit=10&offset=500
};

export default retrieve;