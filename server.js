
const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const EIA_API_KEY = process.env.EIA_API_KEY;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/api/quote", async (req, res) => {
    const { miles, houseSize, floors, packing } = req.body;
    const baseRatePerMile = 2.0;

    let fuelRate = 4.5;
    try {
        const response = await fetch(`https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=${EIA_API_KEY}&frequency=weekly&data[0]=value&facets[product][]=EDSL&facets[area][]=US&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=1`);
        const data = await response.json();
        fuelRate = parseFloat(data.response.data[0].value);
    } catch (err) {
        console.error("Using fallback fuel price:", err);
    }

    const houseMultiplier = houseSize === "large" ? 1.5 : houseSize === "medium" ? 1.2 : 1;
    const floorMultiplier = floors > 1 ? 1.15 : 1;
    const packingFee = packing ? 200 : 0;

    const cost = (miles * baseRatePerMile * houseMultiplier * floorMultiplier) + packingFee + (miles * fuelRate * 0.1);
    const priceWithMargin = cost * 1.4;

    res.json({ quote: Math.round(priceWithMargin) });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
