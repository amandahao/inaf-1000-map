function drawMap(container, diameter) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", diameter);
  svg.setAttribute("height", diameter);

  let p1 = [0, 0];
  let p2 = [0, 0];

  countries.features.forEach((d) => {
    d.selected = false;
  });

  let path = d3.geoPath(projection);

  let radialGradient = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "radialGradient"
  );
  radialGradient.setAttribute("cx", diameter * 0.48);
  radialGradient.setAttribute("cy", diameter * 0.35);
  radialGradient.setAttribute("r", diameter * 0.64);
  radialGradient.setAttribute("id", "grSea");
  radialGradient.setAttribute("gradientUnits", "userSpaceOnUse");

  const stopOffsets = ["0", "0.5", "0.56", "0.64", "0.7", "0.74", "1"];
  const stopOpacities = [
    "0",
    "0.006",
    "0.009",
    "0.017",
    "0.039",
    "0.055",
    "0.142",
  ];
  stopOffsets.forEach((offset, index) => {
    let stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop.setAttribute("offset", offset);
    stop.style.stopColor = "#000000";
    stop.style.stopOpacity = stopOpacities[index];
    radialGradient.appendChild(stop);
  });

  svg.appendChild(radialGradient);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", diameter / 2);
  circle.setAttribute("cy", diameter / 2);
  circle.setAttribute("r", diameter / 2);
  circle.setAttribute("fill", "white");
  circle.setAttribute("stroke", "none");
  svg.appendChild(circle);

  const countriesPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  countriesPath.setAttribute("id", "countries");
  countries.features.forEach((d) => {
    let countryPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    countryPath.setAttribute("id", d.properties.formal_en);
    countryPath.setAttribute("d", path(d));
    countryPath.setAttribute("fill", d.selected ? "#346733" : "#b9b9b9");
    countryPath.addEventListener("click", function () {
      console.log(d.properties.NAME);
      d.selected = !d.selected;
      countriesPath.childNodes.forEach((child) => {
        let childData = countries.features.find(
          (f) => f.properties.formal_en === child.id
        );
        child.setAttribute("fill", childData.selected ? "#346733" : "#b9b9b9");
        if (childData.selected) {
          child.parentNode.appendChild(child);
        }
      });
      let selectedCodes = countries.features
        .filter((f) => f.selected)
        .map((f) => f.properties.ADM0_A3);
      boundariesPath.childNodes.forEach((child) => {
        let childId = child.id.split(" | ");
        let id = boundaries.features.find(
          (f) => boundariesMetadata[f.properties.NE_ID].ADM0_A3_L === childId[0]
        ).properties.NE_ID;
        child.selected =
          selectedCodes.includes(boundariesMetadata[id].ADM0_A3_L) ||
          selectedCodes.includes(boundariesMetadata[id].ADM0_A3_R);
      });
      boundariesPath.childNodes.forEach((child) => {
        child.setAttribute("stroke", child.selected ? "#335033" : "white");
      });
      if (showDisputed[0]) {
        disputedPath.childNodes.forEach((child) => {
          let id = child.id;
          let disputedlist = disputedMetadata
            .find((d) => d.id === id)
            .countries.split(", ");
          child.selected = disputedlist.some((c) => selectedCodes.includes(c));
        });
      }
      disputedPath.childNodes.forEach((child) => {
        child.setAttribute("display", child.selected ? "" : "none");
      });
      let selectedCountries = {
        type: "FeatureCollection",
        features: countries.features.filter((f) => f.selected),
      };
      if (selectedCountries.features.length > 0) {
        let newCentroid = d3.geoCentroid(selectedCountries).map((v) => -v);
        projection.rotate(newCentroid);
        path = d3.geoPath(projection);
        [
          graticulePath,
          countriesPath,
          disputedPath,
          boundariesPath,
          lakesPath,
        ].forEach((path) => {
          path.childNodes.forEach((child) => {
            child.setAttribute("d", path(child.__data__));
          });
        });
      }
    });
    countryPath.addEventListener("mouseover", function () {
      countryPath.setAttribute("fill", "#8a8a8a");
      countryPath.parentNode.appendChild(countryPath);
    });
    countryPath.addEventListener("mouseout", function () {
      countryPath.setAttribute("fill", d.selected ? "#346733" : "#b9b9b9");
    });
    countriesPath.appendChild(countryPath);
  });
  svg.appendChild(countriesPath);

  const disputedPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  disputedPath.setAttribute("id", "disputed");
  disputed.features.forEach((d) => {
    let disputedPathItem = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    disputedPathItem.setAttribute("d", path(d));
    disputedPathItem.setAttribute("id", d.properties.name);
    disputedPathItem.setAttribute("fill", "#49C946");
    disputedPathItem.setAttribute("display", "none");
    disputedPathItem.setAttribute("pointer-events", "none");
    disputedPath.appendChild(disputedPathItem);
  });
  svg.appendChild(disputedPath);

  const lakesPath = document.createElementNS("http://www.w3.org/2000/svg", "g");
  lakesPath.setAttribute("id", "lakes");
  lakes.features.forEach((d) => {
    let lakePath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    lakePath.setAttribute("d", path(d));
    lakePath.setAttribute("id", d.properties.name);
    lakePath.setAttribute("stroke", "none");
    lakePath.setAttribute("fill", "white");
    lakePath.setAttribute("pointer-events", "none");
    lakesPath.appendChild(lakePath);
  });
  svg.appendChild(lakesPath);

  const boundariesPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  boundariesPath.setAttribute("id", "boundaries");
  boundaries.features.forEach((d) => {
    let boundaryPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    boundaryPath.setAttribute("d", path(d));
    boundaryPath.setAttribute(
      "id",
      `${boundariesMetadata[d.properties.NE_ID].ADM0_A3_L} | ${
        boundariesMetadata[d.properties.NE_ID].ADM0_A3_R
      }`
    );
    boundaryPath.setAttribute("stroke", "white");
    boundaryPath.setAttribute("fill", "none");
    boundaryPath.setAttribute("stroke-linejoin", "round");
    boundaryPath.setAttribute("stroke-linecap", "round");
    boundaryPath.setAttribute("stroke-width", 0.5);
    boundaryPath.setAttribute("pointer-events", "none");
    boundaryPath.setAttribute(
      "stroke-dasharray",
      boundariesStyle[d.properties.FEATURECLA] === "dotted" ? "2,2" : ""
    );
    boundariesPath.appendChild(boundaryPath);
  });
  svg.appendChild(boundariesPath);

  function render() {
    console.log("Render");
    path = d3.geoPath(projection);
    graticulePath.setAttribute("d", path(graticule));
    countriesPath.childNodes.forEach((child) => {
      child.setAttribute(
        "d",
        path(
          countries.features.find((f) => f.properties.formal_en === child.id)
        )
      );
    });
    disputedPath.childNodes.forEach((child) => {
      child.setAttribute(
        "d",
        path(disputed.features.find((f) => f.properties.name === child.id))
      );
    });
    boundariesPath.childNodes.forEach((child) => {
      child.setAttribute(
        "d",
        path(
          boundaries.features.find(
            (f) =>
              boundariesMetadata[f.properties.NE_ID].ADM0_A3_L +
                " | " +
                boundariesMetadata[f.properties.NE_ID].ADM0_A3_R ===
              child.id
          )
        )
      );
    });
    lakesPath.childNodes.forEach((child) => {
      child.setAttribute(
        "d",
        path(lakes.features.find((f) => f.properties.name === child.id))
      );
    });
  }

  const graticulePath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  graticulePath.setAttribute("id", "graticule");
  graticulePath.setAttribute("stroke", "#000");
  graticulePath.setAttribute("opacity", 0.5);
  graticulePath.setAttribute("stroke-width", 0.3);
  graticulePath.setAttribute("fill", "none");
  graticulePath.setAttribute("d", path(graticule));
  graticulePath.setAttribute("pointer-events", "none");
  svg.appendChild(graticulePath);

  const shadedCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  shadedCircle.setAttribute("cx", diameter / 2);
  shadedCircle.setAttribute("cy", diameter / 2);
  shadedCircle.setAttribute("r", diameter / 2);
  shadedCircle.setAttribute("fill", "url(#grSea)");
  shadedCircle.setAttribute("stroke", "#aaaaaa");
  shadedCircle.setAttribute("stroke-width", 1.5);
  shadedCircle.setAttribute("pointer-events", "none");
  svg.appendChild(shadedCircle);

  svg.addEventListener("mousemove", (event) => {
    render();
  });

  return svg;
}
