const express = require("express");
const wishListRouter = express.Router();
wishListRouter.use(express.json());
const { body, validationResult } = require("express-validator");
const countries = require("../data/countries");

const compareAlphabetically = (a, b) =>
  a.name !== b.name ? (a.name < b.name ? -1 : 1) : 0;

const Validator = [
  body("name").isLength({ min: 2 }),
  body("alpha2Code").isLength({ min: 2, max: 3 }),
  body("alpha3Code").isLength({ min: 2, max: 3 }),
];

// const validationCountry = (code) => {
//   if (!code) return null;
//   const countryCode = code.toUpperCase();
//   return countries.find(
//     (country) =>
//       country.alpha2Code === countryCode || country.alpha3Code === countryCode
//   );
// };

wishListRouter.get("/api/countries", (req, res) => {
  const sortCountry = req.query.sort;
  const visitedCountry = req.query.visited;

  if (visitedCountry) {
    const newArray = countries.filter((e) => e.visited === true);
    if (sortCountry) {
      newArray.sort(compareAlphabetically);
    }
    res.send(newArray);
  } else {
    if (sortCountry) {
      const cloneArray = countries.slice();
      cloneArray.sort(compareAlphabetically);
      res.send(cloneArray);
    } else {
      res.send(countries);
    }
  }
});

wishListRouter.get("/api/countries/:code", (req, res) => {
  const country = countries.find(
    (country) =>
      country.alpha2Code === req.params.code ||
      country.alpha3Code === req.params.code
  );
  if (country) {
    res.json(country);
  } else {
    res.send("This country is not on our list");
  }
});

wishListRouter.post("/api/countries", Validator, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, alpha2Code, alpha3Code } = req.body;
  const country = countries.find(
    (country) =>
      country.alpha2Code === req.params.code ||
      country.alpha3Code === req.params.code
  );
  if (country) {
    res.send("Country already exist");
  } else {
    const newCountry = {
      id: countries.length + 1,
      name: name,
      alpha2code: alpha2Code,
      alpha3code: alpha3Code,
      visited: false,
    };

    countries.push(newCountry);
    res.send(newCountry);
  }
});

wishListRouter.put("/api/countries/:code", Validator, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, alpha2Code, alpha3Code, visited } = req.body;

  const country = countries.find(
    (country) =>
      country.alpha2Code === req.params.code ||
      country.alpha3Code === req.params.code
  );

  if (country) {
    (country.name = name),
      (country.alpha2Code = alpha2Code),
      (country.alpha3Code = alpha3Code),
      (country.visited = visited);
    res.json(country);
  } else {
    res.send("Their is not country with this code in our list");
  }
});

wishListRouter.delete("/api/countries/:code", (req, res) => {
  const country = countries.find(
    (country) =>
      country.alpha2Code === req.params.code ||
      country.alpha3Code === req.params.code
  );

  country.visited = true;

  //   const index = countries.indexOf(country)
  //   countries.splice(index, 1)
  res.send(country);
});

module.exports = wishListRouter;
