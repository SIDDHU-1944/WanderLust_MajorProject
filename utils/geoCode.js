const fetch =require("node-fetch");

module.exports.getCoordinates = async (location)=>{
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,{
        headers: {
          "User-Agent": "wanderlust-app/1.0 https://github.com/SIDDHU-1944/WanderLust_MajorProject", 
          Accept: "application/json",
        },
        timeout: 10000,
      });
        const data = await res.json();

        if (!data.length) {
            return {
                type: "Point",
                coordinates: [0, 0]
            };
        }

        return {
            type: "Point",
            coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
        };

    } catch (err) {
        console.error("Geocoding error:", err);
        return {
            type: "Point",
            coordinates: [0, 0]
        };
    }
};
