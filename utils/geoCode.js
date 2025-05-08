const fetch =require("node-fetch");

module.exports.getCoordinates = async (location)=>{
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`);
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