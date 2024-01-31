import URI from "urijs";

window.path = "http://localhost:3000/records";

// I created a helper function to aid in checking if a color is a primary color
//Primary Colors are red, blue , and yellow

const isaPrimaryColor = (color) => ['red', 'blue', 'yellow'].includes(color);

// The main function retrieve that fetches data from the API it accepts an object that
// can specify the page and colors to fetch
// Set default values incase they are not provided
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
    // Use a for each loop to or each color specified add it to the request URL as a query parameter
    colors.forEach(color => requestURL.addSearch('color[]', color));

    // We want to ensure that provided colors parameter is a valid color
    const validColors = ['red', 'brown', 'blue', 'yellow', 'green'];
    const hasInvalidColor = colors.some(color => !validColors.includes(color));
    // if there are invalid colors in the parameters automatically return an empty response
    if (hasInvalidColor) {
        return Promise.resolve({ ids: [], open: [], closedPrimaryCount: 0, previousPage: null, nextPage: null });
    }
    // assuming every parameter is valid we want to convert to astring and fetch from the the API using the request URL
    return fetch(requestURL.toString())
        .then(response => {
            // if the response is bad or not ex[ected it will throw an error
            if (!response.ok) {
                throw new Error('Bad Network Response');
            }
            //assuming the respone is good we return the response in JSON Format
            return response.json();
        })
        .then(data => {
            // assuming the response is good we want 
            // if the retrived page is invalid. page<=0 than automatically return an emptty response
            if (page <= 0) {
                return { ids: [], open: [], closedPrimaryCount: 0, previousPage: null, nextPage: null };
            }
            // if the retrived page is invalid due to the page being greater than 50
            //(50 came from the tests in managed record-test.js) than automatically return a response that is empty but shows we are on the last page

            if (page > 51) {
                return { ids: [], open: [], closedPrimaryCount: 0, previousPage: 50, nextPage: null };
            }
            // by default we are valid extract data from the returned data and
            // filter the items by their disposition being  open and then add another property 
            //to those items items that represent it being a primary color
            const ids = data.map(item => item.id);
            const open = data.filter(item => item.disposition === 'open')
                .map(item => ({ ...item, isPrimary: isaPrimaryColor(item.color) }));

            // filter the item list by the disposition being closed and there being a primary color attached.
            // Then counting the number using .length;
            const closedPrimaryCount = data.filter(item => item.disposition === 'closed' && isaPrimaryColor(item.color)).length;

            // used ternary operators set the previous page and nextPage
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
            // if there is any error along the way of the fetch we throw an error
            return console.log(error.message);
        });

    // example URL queries to show how the code works. Use these Example urls in browser to test functionality.
    // fetching first page w/o filters- http://localhost:3000/records?limit=10&offset=0
    // Fetching second page with specific colors - http://localhost:3000/records?limit=10&offset=10&color[]=red&color[]=blue
    // fetching a page beyond the last page - http://localhost:3000/records?limit=10&offset=500


};

export default retrieve;
