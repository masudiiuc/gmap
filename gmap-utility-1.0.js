/**
 * Google Map distance calculation using Distance Matrix
 *
 * @author  M.M.H.Masud<masudiiuc@gmail.com>
 * @date    28th Oct, 2014 
 * @url     https://developers.google.com/maps/documentation/javascript/examples/distance-matrix
 */

var GmapUtility = {
    
    unitSystem  : google.maps.UnitSystem.IMPERIAL,
    gmapService : '',
    distanceArr : [],
    debug       : true,
    
    init: function(address, unit, debug) {
        this.addressList = address;
        this.debug       = (typeof debug == undefined ? debug : this.debug);
        this.gmapService = new google.maps.DistanceMatrixService();

        this.calculateDistance(address);
    },
    
    getDistance: function(){
        
        var result = []
        
        for(i=0; i<this.addressList.length; i++ ) {
            
            if (this.distanceArr[i][i+1] == undefined){
                result.push(this.distanceArr[i][0]);
            }else{
                result.push(this.distanceArr[i][i+1]);    
            }
            
        }
        
        return result;
    }, 
    
    calculateDistance: function(addressList) {
        
        if(this.debug) console.log('source: ', source, '\ndistanation: ',destination, '\n');
        
        this.gmapService.getDistanceMatrix(
        {
            origins         : addressList,
            destinations    : addressList,
            travelMode      : google.maps.TravelMode.DRIVING,
            unitSystem      : this.unitSystem,
            avoidHighways   : false,
            avoidTolls      : false
        }, this.processResponse.bind(this));
    },
    
    processResponse: function(response, status) {
        
        if (status != google.maps.DistanceMatrixStatus.OK) {
            alert('Error was: ' + status);
        }
        
        var origins      = response.originAddresses;
        var destinations = response.destinationAddresses;
        
        for (var i = 0; i < origins.length; i++) {
            
            var results = response.rows[i].elements;
            var temp    = [];
            
            for (var j = 0; j < results.length; j++) {
                
                if (this.debug){
                    temp[j] = {
                                'source'     : origins[i],
                                'distanation': destinations[j],
                                'distance'   : results[j].distance.text,
                                'duration'   : results[j].duration.text
                              };
                }else{
                    temp[j] = {
                                'distance'   : results[j].distance.text,
                                'duration'   : results[j].duration.text
                              };
                }
                
            }
            
            this.distanceArr[i] = temp;
        }
        
    }
    
}