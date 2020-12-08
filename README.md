# <ins> LabVIEW Data Visulization</ins>

## A desktop and mobile web front end for the sensor, displaying real-time data in a user-friendly way to web-connected phones in the field. The front end is built upon LabVIEW and displays 1Hz results, which include velocity, methane concentration, and methane emissions rate.

<br>

* ### For test purpose 

setInterval(() => {

    d3.select("#v1").property("value", (Math.random() * 9 + 1).toFixed(2));
    d3.select("#v2").property("value", (Math.random() * 9 + 1).toFixed(2));
    d3.select("#c1").property("value", (Math.random() * 9 + 1).toFixed(2));
    d3.select("#c2").property("value", (Math.random() * 9 + 1).toFixed(2));
    d3.select("#f1").property("value", (Math.random() * 9 + 1).toFixed(2));
    d3.select("#f2").property("value", (Math.random() * 9 + 1).toFixed(2));
}, 1000);

data.push({ 

    time: new Date().getTime(), 
    velocity1: Math.random() * 10 + 9, 
    velocity2: Math.random() * 10 + 9, 
});

data = len === 0 ? data : data.slice(-len);

redrawLine(timeline, data);

<br>

* ### For production purpose 

let URL = document.URL;
URL = URL.replace("index.html", "") + "responseArray_trueformat";

$.getJSON(URL, (res) => {

    data.push({
    time: new Date().getTime(),
    velocity1: +res.Array.split(",")[getNum(cate)[0]],
    velocity2: +res.Array.split(",")[getNum(cate)[1]],
    });
    data = len === 0 ? data : data.slice(-len);
    redrawLine(timeline, data);
    d3.select("#v1").property("value", res.Array.split(",")[0]);
    d3.select("#v2").property("value", res.Array.split(",")[1]);
    d3.select("#c1").property("value", res.Array.split(",")[2]);
    d3.select("#c2").property("value", res.Array.split(",")[3]);
    d3.select("#f1").property("value", res.Array.split(",")[4]);
    d3.select("#f2").property("value", res.Array.split(",")[5]);
});

function getNum(cate) {

    if (cate === "v") {
    return [0, 1];
    } else if (cate === "c") {
    return [2, 3];
    } else {
    return [4, 5];
    }
}

