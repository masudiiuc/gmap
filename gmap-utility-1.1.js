/**
 * Google Map distance calculation using direction service
 *
 * @author  M.M.H.Masud<masudiiuc@gmail.com>
 * @date    28th Oct, 2014 
 * @url     https://developers.google.com/maps/documentation/javascript/directions
 *
 * @todo
 * 1. set "optimizewaypoints" to get best directions and best route
 * 2. set "unitSystem" for geting distance in Mile or Kilometers
 */

var GmapUtility = {
    
    unitSystem  : google.maps.UnitSystem.IMPERIAL,
    gmapService : '',
    distanceArr : [],
    debug       : false,
    wayPoints   : [],
    callback    : '',
    
    init: function(address, callBack) {
        
        this.addressList = address;
        this.debug       = (typeof debug == undefined ? debug : this.debug);
        this.gmapService = new google.maps.DirectionsService();
        
        if (typeof callBack === 'function') {
            this.callback = callBack;
        }

        this.calculateDistance(address);
    },
    
    getDistance: function(){
        
        return this.distanceArr;
    }, 
    
    getDistanceWithCallBack: function() {
        
            
    },
    
    getWayPoints: function(){
      
        //omit the first address as it will be start and end address
        var wayPoints = [];
        
        for(i=1; i <this.addressList.length; i++ ) {
            wayPoints.push({
                'location': this.addressList[i],
                'stopover': true
            })
        }
        
        if(this.debug)  console.log('WayPoints: ', wayPoints);
        
        return wayPoints;
        
    },
    
    calculateDistance: function(addressList) {
        var start = addressList[0],
            end = addressList[0];
        
        if(this.debug) console.log('Start: ', start, '\nEnd: ',end, '\n');
        
        this.gmapService.route({
            origin              : start,
            destination         : end,
            waypoints           : this.getWayPoints(),
            optimizeWaypoints   : false,
            travelMode          : google.maps.TravelMode.DRIVING
        }, this.processResponse.bind(this));
        
    },
    
    processResponse: function(response, status) {
        
        if (status != google.maps.DistanceMatrixStatus.OK) {
            alert('Error was: ' + status);
        }
        
        var routes = response.routes[0] ? response.routes[0].legs : '';
        var _that  = this;
        
        if (routes) {
            $.each(routes, function(key, values){
               
                _that.distanceArr.push({
                                'source'     : values.start_address,
                                'distanation': values.end_address,
                                'distance'   : values.distance.text,
                                'duration'   : values.duration.text
                              });
                
            });
        }
        
        if (typeof this.callback === 'function') {
            if(this.debug) console.log('i am in process Response');
            this.callback.call(this, _that.distanceArr);
        }
    }
    
}