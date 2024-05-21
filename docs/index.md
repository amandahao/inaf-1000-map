---
toc: false
---

<style>
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: var(--sans-serif);
    margin: 4rem 0 8rem;
    text-wrap: balance;
    text-align: center;
  }

  .hero h1 {
    margin: 2rem 0;
    max-width: none;
    font-size: 14vw;
    font-weight: 900;
    line-height: 1;
    background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero h2 {
    margin: 0;
    max-width: 34em;
    font-size: 20px;
    font-style: initial;
    font-weight: 500;
    line-height: 1.5;
    color: var(--theme-foreground-muted);
  }

  @media (min-width: 640px) {
    .hero h1 {
      font-size: 90px;
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .colors {
    /* display: flex; */
    /* flex-direction: row; */
    padding: 2px;
    margin-left: 190px;
  }

  .colors input {
    width: 30px;
  }

  /* hides hex codes */
  .colors output {
    display: none;
  }

  .colors div .oi-3a86ea {
    /* --label-width: 0px !important; */
  }

  #reset {
    padding-top: 5px;
    color: blue;
  }
</style>

<div class="hero">
  <h1>INAF-1000 Interactive Map</h1>
  <h2>A simple web app of an orthographic map for Maps of the Modern World. Drag to rotate the globe. Click on a country to select it, click again to deselect.</h2>
</div>

<div class="main">
  <div id="slider"></div>
  <br>
  <div id="graticule"></div>
  <br>
  <div class="colors">
    <div id="default"></div>
    <div id="selected"></div>
    <div id="land"></div>
    <div id="reset"></div>
  </div>
  <br>
  <div id="toggle"></div>
  <br>
  <div id="map"></div>
</dive>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@observablehq/inspector@5/dist/inspector.css">
<script type="module">
import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
import define from "https://api.observablehq.com/d/1571aba8dc93dbb7.js?v=4";
// new Runtime().module(define, Inspector.into("#map"));
new Runtime().module(define, name=> {
  if(name =="viewof diameter") return new Inspector(document.querySelector("#slider"));
  if(name =="viewof showGraticule") return new Inspector(document.querySelector("#graticule"));
  if(name =="viewof defaultColor") return new Inspector(document.querySelector("#default"));
  if(name =="viewof selectedColor") return new Inspector(document.querySelector("#selected"));
  if(name =="viewof landColor") return new Inspector(document.querySelector("#land"));
  if(name =="viewof reset") return new Inspector(document.querySelector("#reset"));
  if(name =="viewof toggleShading") return new Inspector(document.querySelector("#toggle"));
  if(name !="projection") return new Inspector(document.querySelector("#map"));
})

</script>
