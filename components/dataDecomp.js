
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy+'-'+ mm + '-' + dd;

async function setupDate(){
    var harvestQuarter = 1;
    const setupQuery = 'Select harvestdate, harvestquarter from harvest where harvestdate = \'' + today + '\' Group BY harvestdate, harvestquarter';
    
    let promise = domo.post('/sql/v1/harvest', setupQuery, {contentType: 'text/plain'})
            .then(function(harvest){
                return harvest.rows[0][1];       
                });
        
    harvestQuarter = await promise;
    return harvestQuarter;
}